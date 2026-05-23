import { db } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, phone, branch, goal, message } = await req.json();

    if (!name || !phone || !branch) {
      return Response.json({
        ok: false,
        message: "이름, 전화번호, 지점을 입력해주세요.",
      });
    }

    await db.query(
      `
      INSERT INTO consultation_requests (
        name,
        phone,
        branch,
        goal,
        message
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, phone, branch, goal || "", message || ""]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONSULT_EMAIL,
      subject: `[홈페이지예약][만원체험] ${branch} - ${name}님 / ${phone}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7;">
          <h2>🥊 새로운 1일 체험 예약</h2>
          <p><b>이름:</b> ${name}</p>
          <p><b>전화번호:</b> ${phone}</p>
          <p><b>지점:</b> ${branch}</p>
          <p><b>운동 목적:</b> ${goal || "-"}</p>
          <p><b>문의사항:</b><br/>${message || "-"}</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    return Response.json({
      ok: false,
      message: "예약 접수 중 오류가 발생했습니다.",
    });
  }
}