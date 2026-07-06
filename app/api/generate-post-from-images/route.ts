import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const branchInfo: any = {
  철산점: {
    area: "경기도 광명시 철산동",
    hours: "월-금 14:00~23:00, 토·일 14:00~18:00, 공휴일 휴무",
    note: "광명 철산동에서 복싱 입문, 다이어트, 체력 향상, 스트레스 해소를 편하게 시작할 수 있는 운영 중인 체육관",
    seoKeywords: ["철산 복싱", "광명 복싱", "철산역 복싱", "철산 다이어트"],
  },
  목동점: {
    area: "서울시 양천구 목동",
    hours: "월-금 14:00~24:00, 토 11:00~16:00",
    note: "키즈/어린이 회원이 특히 많고, 학생·여성·직장인 회원도 많은 밝고 편한 분위기",
    seoKeywords: ["목동 복싱", "양천구 복싱", "목동 키즈복싱", "목동 어린이복싱"],
  },
  신정점: {
    area: "서울시 양천구 신정동",
    hours: "월-금 10:00~24:00, 토 10:00~16:00",
    note: "키즈/어린이 회원이 특히 많고 직장인·주부·초보 회원도 많음",
    seoKeywords: ["신정 복싱", "신정동 복싱", "신정 키즈복싱", "양천구 어린이복싱"],
  },
  개봉점: {
    area: "서울시 구로구 개봉동",
    hours: "월-금 13:00~23:00",
    note: "동네 주민 중심으로 어린이·키즈 회원도 있고 직장인·여성·초보 회원도 골고루 있는 친근한 분위기",
    seoKeywords: ["개봉 복싱", "개봉동 복싱", "구로 복싱", "개봉 키즈복싱"],
  },
  영등포점: {
    area: "서울시 영등포구",
    hours: "월-금 13:00~23:00",
    note: "퇴근 후 오는 직장인 회원이 많고 키즈·어린이 회원도 일부 있음",
    seoKeywords: ["영등포 복싱", "영등포구 복싱", "영등포 다이어트", "영등포 직장인복싱"],
  },
};

export async function POST(request: Request) {
  try {
    const { imageUrls, branch_name } = await request.json();

    if (!imageUrls || imageUrls.length === 0) {
      return Response.json({ ok: false, message: "사진을 먼저 업로드해주세요." }, { status: 400 });
    }

    const branch = branchInfo[branch_name] || {};
    const seoKeywords = branch.seoKeywords || ["복싱", "다이어트 복싱", "복싱장"];

    const angles = [
      "처음 복싱을 시작하러 왔을 때의 첫날 경험을 중심으로",
      "복싱으로 살을 빼고 싶은 사람이 3개월 다니면 어떻게 달라지는지 경험담 스타일로",
      "퇴근 후 스트레스를 풀 운동을 찾다가 복싱을 발견한 직장인 시각으로",
      "운동 초보인데 복싱이 가능할지 고민하는 사람한테 솔직하게 설명하듯",
      "체육관 처음 가기 전 궁금한 것들(수업방식, 분위기, 복장 등)을 미리 알려주는 스타일로",
      "여성 입장에서 복싱이 무섭지 않고 오히려 재밌는 이유를 중심으로",
      "아이 키즈 복싱을 고민하는 부모 입장에서 체육관을 처음 알아보는 시각으로",
      "초등학생 아이가 복싱을 배우면 어떤 점이 좋은지 부모 시각으로",
      "복싱이 단순 운동이 아니라 자신감, 집중력, 멘탈 강화에도 좋다는 관점으로",
      "헬스장 다니다 지쳐서 복싱으로 넘어온 사람의 시각으로",
      "복싱 글러브 처음 끼는 순간부터 미트 치는 쾌감까지 생생하게",
      "운동 동기부여가 안 될 때 복싱이 답인 이유를 친구한테 말하듯",
      "오늘 수업 현장을 생생하게 전달하는 현장 보고서 스타일로",
      "복싱 스파링 없이 운동만 해도 되는지 걱정하는 초보자에게 설명하듯",
      "처음엔 무서웠는데 다녀보니 완전 다른 분위기였다는 반전 스타일로",
    ];
    const angle = angles[Math.floor(Math.random() * angles.length)];

    const prompt = `
너는 네이버 지역 체육관 블로그 전문 마케터야.

브랜드명: 스트롱복싱
현재 작성 지점: ${branch_name}

지점 정보:
- 지역: ${branch.area}
- 운영시간: ${branch.hours}
- 분위기: ${branch.note}
- 지점 SEO 키워드: ${seoKeywords.join(", ")}

위 사진들을 보고 오늘 어떤 수업/운동 현장이었는지 파악한 뒤, 그 내용을 중심으로 블로그 글을 작성해.
사진에 보이는 것들(아이들, 어른, 키즈 수업, 스파링, 미트 훈련, 다이어트 운동 등)을 자연스럽게 본문에 녹여넣어.

이번 글의 각도 (반드시 이 시각으로 써야 해):
${angle}

[핵심 규칙]
- 위 "이번 글의 각도"를 글 전체 흐름의 중심으로 삼되, 사진 속 실제 장면을 소재로 쓸 것
- "도입 → 장점 나열 → 마무리" 같은 뻔한 구성 금지
- 글의 중심은 ${branch_name} 기준으로 작성
- 동네 체육관의 친근하고 편안한 분위기
- 과장되거나 허위 느낌 금지
- 이모지는 문단 사이나 소제목 옆에 자연스럽게 3~5개 사용

[말투 규칙]
- "안녕하세요! 스트롱복싱 ${branch_name}입니다 😊" 같은 인사로 시작
- "~입니다", "~합니다" 격식체 유지
- 네이버 블로그 체육관 글 특유의 밝고 친근한 격식체

[SEO 규칙]
- 제목에 지점 SEO 키워드 중 하나를 앞부분에 포함
- 본문 첫 문단에 지역명(${branch.area}) 자연스럽게 포함
- 반드시 소제목 3~5개 사용, 형식은 정확히 "## 소제목내용"
- 글 길이 최소 1200자
- 지점 SEO 키워드 중 2~3개 본문에 자연스럽게 포함
- 마지막 문단에 방문 상담이나 홈페이지로 자연스럽게 연결

[해시태그]
- 8~12개
- # 없이, 띄어쓰기 없는 태그
- 지역명, 스트롱복싱, 복싱입문, 다이어트복싱 포함

반드시 아래 JSON 형식으로만 답변해.
설명 문장, 코드블럭, markdown 없이 순수 JSON만 출력.

{
  "title": "블로그 제목",
  "slug": "영문-url-slug",
  "description": "블로그 목록에 보일 짧은 설명",
  "content": "본문 전체",
  "hashtags": ["스트롱복싱", "복싱입문", "다이어트복싱"]
}
`;

    // Chat Completions API (vision 지원)
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            // 이미지들
            ...imageUrls.map((url: string) => ({
              type: "image_url" as const,
              image_url: {
                url: url.startsWith("http") ? url : `https://strongboxing.kr${url}`,
                detail: "low" as const, // 비용 절감
              },
            })),
            // 프롬프트
            { type: "text" as const, text: prompt },
          ],
        },
      ],
    });

    const raw = response.choices[0].message.content?.trim() || "";
    // 코드블럭 감싸진 경우 제거
    const text = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const json = JSON.parse(text);

    return Response.json({ ok: true, post: json });
  } catch (error: any) {
    console.error("AI 이미지 기반 생성 오류:", error?.message || error);
    return Response.json({ ok: false, message: "AI 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
