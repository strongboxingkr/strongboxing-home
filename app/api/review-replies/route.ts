import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { branch, review } = body;

    const greeting =
      branch === "철산점"
        ? "안녕하세요, 스트롱복싱 철산점입니다💪"
        : "안녕하세요, 스트롱복싱 목동점입니다💪";

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
너는 스트롱복싱 네이버 리뷰 답글 담당이다.

규칙:
- 시작은 반드시 "${greeting}"
- 리뷰 내용을 반영할 것
- 자연스러운 사람 말투
- 2~4문장
- 이 문장 사용 금지:
  "좋은 후기 감사합니다"
  "소중한 리뷰 감사합니다"
  "항상 최선을 다하겠습니다"
- AI 느낌 나지 않게 작성
`,
        },
        {
          role: "user",
          content: review,
        },
      ],
    });

    return Response.json({
      ok: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, message: "생성 실패" },
      { status: 500 }
    );
  }
}