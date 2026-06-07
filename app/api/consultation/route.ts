import { db } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const {
      name,
      phone,
      branch,
      reservation_date,
      reservation_time,
      goal,
      message,
    } = await req.json();

    if (!name || !phone || !branch || !reservation_date || !reservation_time) {
      return Response.json({
        ok: false,
        message: "필수 항목을 입력해주세요.",
      });
    }

    const [exists]: any = await db.query(
      `
      SELECT id
      FROM consultations
      WHERE branch = ?
        AND reservation_date = ?
        AND reservation_time = ?
      LIMIT 1
      `,
      [branch, reservation_date, reservation_time]
    );

    if (exists.length > 0) {
      return Response.json({
        ok: false,
        message: "이미 예약이 있는 시간입니다.",
      });
    }

    await db.query(
      `
      INSERT INTO consultations (
        name, phone, branch, reservation_date,
        reservation_time, goal, message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        phone,
        branch,
        reservation_date,
        reservation_time,
        goal || "",
        message || "",
      ]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"스트롱복싱 홈페이지" <${process.env.SMTP_USER}>`,
      to: process.env.CONSULT_EMAIL,
      subject: `[홈페이지예약][${branch}] ${name} / ${reservation_date} ${reservation_time}`,
      html: `
        <h2>새 홈페이지 체험 예약</h2>
        <p><b>이름:</b> ${name}</p>
        <p><b>전화번호:</b> ${phone}</p>
        <p><b>지점:</b> ${branch}</p>
        <p><b>예약일:</b> ${reservation_date}</p>
        <p><b>예약시간:</b> ${reservation_time}</p>
        <p><b>운동목적:</b> ${goal || "-"}</p>
        <p><b>문의사항:</b> ${message || "-"}</p>
      `,
    });

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      ok: false,
      message: "예약 접수 중 오류가 발생했습니다.",
    });
  }
}