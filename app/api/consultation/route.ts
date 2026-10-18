import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// consultations 테이블에 reservation_type 컬럼이 없으면 추가
async function ensureReservationTypeColumn() {
  try {
    await db.query(
      `ALTER TABLE consultations ADD COLUMN IF NOT EXISTS reservation_type VARCHAR(20) NOT NULL DEFAULT '방문 상담'`
    );
  } catch {
    // 이미 있거나 지원 안 되는 경우 무시
  }
}

let migrated = false;

export async function POST(req: Request) {
  try {
    if (!migrated) {
      await ensureReservationTypeColumn();
      migrated = true;
    }

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

    const type = reservation_type || "방문 상담";

    const [exists]: any = await db.query(
      `SELECT id FROM consultations
       WHERE branch = ? AND reservation_date = ? AND reservation_time = ?
       LIMIT 1`,
      [branch, reservation_date, reservation_time]
    );

    if (exists.length > 0) {
      return Response.json({
        ok: false,
        message: "이미 예약이 있는 시간입니다. 다른 시간을 선택해주세요.",
      });
    }

    const branchMap: any = {
      개봉점: "GAEBONG",
      신정점: "SINJEONG",
      목동점: "MOKDONG",
      철산점: "CHEOLSAN",
      영등포점: "YEONGDEUNGPO",
    };

    const branchCode = branchMap[branch] || "BRANCH";
    const phoneLast4 = phone.replace(/[^0-9]/g, "").slice(-4);
    const reservationNo = `HOME-${branchCode}-${reservation_date.replaceAll("-", "")}-${reservation_time.replace(":", "")}-${phoneLast4}`;

    await db.query(
      `INSERT INTO consultations (
        reservation_no, name, phone, branch, reservation_date,
        reservation_time, goal, message, reservation_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reservationNo, name, phone, branch, reservation_date, reservation_time, goal || "", message || "", type]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    try {
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
      console.error("메일 발송 실패:", mailError);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, message: "예약 접수 중 오류가 발생했습니다." });
  }
}
