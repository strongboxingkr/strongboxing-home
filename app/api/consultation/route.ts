import { db } from "@/lib/db";
import { createHash } from "node:crypto";
import nodemailer from "nodemailer";

import type { RowDataPacket } from "mysql2";

let reservationSchema: Promise<void> | undefined;

function ensureReservationTypeColumn() {
  reservationSchema ??= (async () => {
    const [columns] = await db.query<RowDataPacket[]>(
      "SHOW COLUMNS FROM consultations WHERE Field = 'reservation_type'"
    );
    if (columns.length) return;

    try {
      await db.query(
        "ALTER TABLE consultations ADD COLUMN reservation_type VARCHAR(20) NOT NULL DEFAULT '방문 상담'"
      );
    } catch (error) {
      // Two server processes may discover the missing column at the same time.
      if ((error as { code?: string }).code !== "ER_DUP_FIELDNAME") throw error;
    }
  })().catch((error) => {
    reservationSchema = undefined;
    throw error;
  });

  return reservationSchema;
}

export async function POST(req: Request) {
  let step = "read request";
  try {
    const {
      name,
      phone,
      branch,
      reservation_date,
      reservation_time,
      goal,
      message,
      reservation_type,
    } = await req.json();

    if (!name || !phone || !branch || !reservation_date || !reservation_time) {
      return Response.json({
        ok: false,
        message: "필수 항목을 입력해주세요.",
      });
    }

    const type = reservation_type === "일일 체험" ? "일일 체험" : "방문 상담";
    const typeCode = type === "일일 체험" ? "TRIAL" : "CONSULT";

    step = "check reservation schema";
    await ensureReservationTypeColumn();

    const branchMap: any = {
      개봉점: "GAEBONG",
      신정점: "SINJEONG",
      목동점: "MOKDONG",
      철산점: "CHEOLSAN",
      영등포점: "YEONGDEUNGPO",
    };

    const branchCode = branchMap[branch] || "BRANCH";
    const phoneLast4 = phone.replace(/[^0-9]/g, "").slice(-4);
    const reservationNo = `HOME-${branchCode}-${reservation_date.replaceAll("-", "")}-${reservation_time.replace(":", "")}-${phoneLast4}-${typeCode}`;

    step = "lock reservation slot";
    const lockName = "booking:" + createHash("sha256")
      .update(JSON.stringify([branch, reservation_date, reservation_time, typeCode]))
      .digest("hex").slice(0, 48);
    const connection = await db.getConnection();
    let locked = false;
    try {
      const [lock] = await connection.query<RowDataPacket[]>("SELECT GET_LOCK(?, 5) AS acquired", [lockName]);
      locked = Number(lock[0]?.acquired) === 1;
      if (!locked) {
        return Response.json({ ok: false, message: "예약 시간을 확인하는 중입니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
      }

      step = "check existing reservation";
      const [exists] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM consultations
         WHERE branch = ? AND reservation_date = ? AND reservation_time = ?
           AND COALESCE(NULLIF(reservation_type, ''), '방문 상담') = ?
         LIMIT 1`,
        [branch, reservation_date, reservation_time, type]
      );
      if (exists.length) {
        return Response.json({ ok: false, message: "이미 같은 유형의 예약이 있는 시간입니다. 다른 시간을 선택해주세요." });
      }

      step = "save reservation";
      await connection.query(
        `INSERT INTO consultations (
          reservation_no, name, phone, branch, reservation_date,
          reservation_time, goal, message, reservation_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [reservationNo, name, phone, branch, reservation_date, reservation_time, goal || "", message || "", type]
      );
    } finally {
      if (locked) {
        try {
          await connection.query("SELECT RELEASE_LOCK(?)", [lockName]);
          connection.release();
        } catch {
          connection.destroy();
        }
      } else {
        connection.release();
      }
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: `"스트롱복싱 홈페이지" <${process.env.SMTP_USER}>`,
        to: process.env.CONSULT_EMAIL,
        subject: `[홈페이지예약][${type}][${reservationNo}][${branch}] ${name} / ${reservation_date} ${reservation_time}`,
        html: `
          <h2>새 홈페이지 방문 예약</h2>
          <p><b>예약번호:</b> ${reservationNo}</p>
          <p><b>예약 유형:</b> ${type}</p>
          <p><b>이름:</b> ${name}</p>
          <p><b>전화번호:</b> ${phone}</p>
          <p><b>지점:</b> ${branch}</p>
          <p><b>예약일:</b> ${reservation_date}</p>
          <p><b>예약시간:</b> ${reservation_time}</p>
          <p><b>운동목적:</b> ${goal || "-"}</p>
          <p><b>문의사항:</b> ${message || "-"}</p>
        `,
      });
    } catch (mailError) {
      console.error("Reservation notification failed", { code: (mailError as { code?: string }).code });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Reservation submission failed", { step, code: (error as { code?: string }).code });
    return Response.json({ ok: false, message: "예약 접수 중 오류가 발생했습니다." }, { status: 500 });
  }
}
