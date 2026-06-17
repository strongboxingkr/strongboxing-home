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
  - 다음 표현 사용 금지

"좋은 후기 감사합니다"
"소중한 후기 감사합니다"
"기쁘게 생각합니다"
"기쁘게 생각해요"
"신경 쓰겠습니다"
"언제든지 문의 주세요"
"언제든지 말씀해 주세요"
"최선을 다하겠습니다"
"만족하실 수 있도록 노력하겠습니다"

- 서비스센터 말투 금지
- 실제 체육관 관장이 직접 작성한 것처럼 자연스럽게 작성
- 너무 길게 작성하지 말 것
- 2~3문장 정도로 짧게 작성
- 리뷰 내용을 한두 문장으로 자연스럽게 언급할 것
- 같은 표현을 반복하지 말 것
- 너무 과한 친절 표현은 사용하지 말 것
- 말투는 친구처럼 쓰지 말고, 너무 딱딱하지도 않게 작성
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