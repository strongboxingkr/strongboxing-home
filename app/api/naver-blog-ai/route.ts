import OpenAI from "openai";
import sharp from "sharp";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const branchInfo: any = {
  목동점: {
    area: "서울 양천구 목동",
    hours: "월-금 14:00~24:00, 토 11:00~16:00",
    keywords: ["목동 복싱", "목동 복싱장", "목동 다이어트", "양천구 복싱"],
  },
  신정점: {
    area: "서울 양천구 신정동",
    hours: "월-금 10:00~24:00, 토 10:00~16:00",
    keywords: ["신정 복싱", "신정동 복싱", "양천구 복싱", "신정 다이어트"],
  },
  개봉점: {
    area: "서울 구로구 개봉동",
    hours: "월-금 13:00~23:00",
    keywords: ["개봉 복싱", "개봉동 복싱", "구로 복싱", "개봉 다이어트"],
  },
  철산점: {
    area: "경기도 광명시 철산동",
    hours: "월-금 14:00~23:00, 토·일 14:00~18:00, 공휴일 휴무",
    keywords: ["철산 복싱", "광명 복싱", "철산역 복싱", "철산 다이어트"],
  },
  영등포점: {
    area: "서울 영등포구",
    hours: "월-금 13:00~23:00",
    keywords: ["영등포 복싱", "영등포구 복싱", "영등포 다이어트", "영등포 복싱장"],
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const branch = String(formData.get("branch") || "목동점");
    const keyword = String(formData.get("keyword") || "");
    const topic = String(formData.get("topic") || "복싱 입문");
    const memo = String(formData.get("memo") || "");

    if (!keyword) {
      return Response.json(
        { ok: false, message: "키워드를 입력해주세요." },
        { status: 400 }
      );
    }

    const files = formData.getAll("files") as File[];
    const limitedFiles = files.slice(0, 12);

    const imageInputs: any[] = [];

    for (const file of limitedFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const resized = await sharp(buffer)
        .resize(900)
        .jpeg({ quality: 70 })
        .toBuffer();

      imageInputs.push({
        type: "input_image",
        image_url: `data:${file.type};base64,${resized.toString("base64")}`,
      });
    }

    const info = branchInfo[branch] || branchInfo["목동점"];

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
너는 스트롱복싱 네이버 블로그 전용 글쓰기 AI야.

작성 톤:
- 스트롱복싱 목동점 블로그처럼 친근하고 자연스럽게
- 너무 광고 같지 않게
- 실제 방문 후기처럼 편안하게
- 초보자, 여성회원, 직장인도 부담 없이 느껴지게
- 문단은 짧고 읽기 쉽게
- 네이버 블로그에 그대로 복붙 가능하게
- 사진 위치를 [사진1], [사진2] 형식으로 본문에 넣기
- 사진 내용을 보고 배치 순서 추천
- 과장 표현 금지
- "최고", "무조건", "완벽한" 같은 말 피하기

지점: ${branch}
지역: ${info.area}
운영시간: ${info.hours}
핵심 키워드: ${keyword}
글 주제: ${topic}
추가 메모: ${memo || "없음"}
SEO 키워드: ${info.keywords.join(", ")}

철산점은 현재 정상 운영 중이므로 오픈 예정, 오픈 준비 중, 곧 오픈 표현 절대 금지.

반드시 JSON만 출력해.

{
  "title": "블로그 제목 1개",
  "thumbnail": "썸네일 추천 사진 번호와 이유",
  "photoPlan": [
    "[사진1] 설명",
    "[사진2] 설명"
  ],
  "body": "네이버 블로그 본문 전체",
  "hashtags": [
    "스트롱복싱",
    "복싱입문"
  ]
}
`,
            },
            ...imageInputs,
          ],
        },
      ],
    });

    const text = response.output_text.trim();
    const json = JSON.parse(text);

    return Response.json({
      ok: true,
      draft: json,
    });
  } catch (error) {
    console.error("네이버 블로그 AI 오류:", error);

    return Response.json(
      { ok: false, message: "네이버 블로그 AI 생성 실패" },
      { status: 500 }
    );
  }
}