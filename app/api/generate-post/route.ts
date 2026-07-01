import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const branchInfo: any = {
  철산점: {
    status: "운영 중인 지점",
    area: "경기도 광명시 철산동",
    hours: "월-금 14:00~23:00, 토·일 14:00~18:00, 공휴일 휴무",
    note: "광명 철산동에서 복싱 입문, 다이어트, 체력 향상, 스트레스 해소를 편하게 시작할 수 있는 운영 중인 체육관 느낌으로 작성",
    seoKeywords: ["철산 복싱", "광명 복싱", "철산역 복싱", "철산 다이어트"],
  },

  목동점: {
    status: "운영 중인 지점",
    area: "서울시 양천구 목동",
    hours: "월-금 14:00~24:00, 토 11:00~16:00",
    note: "학생 회원, 여성회원, 직장인 회원 비율이 높고 밝고 편한 분위기의 체육관 느낌으로 작성",
    seoKeywords: ["목동 복싱", "양천구 복싱", "목동 다이어트", "목동 복싱장"],
  },

  신정점: {
    status: "운영 중인 지점",
    area: "서울시 양천구 신정동",
    hours: "월-금 10:00~24:00, 토 10:00~16:00",
    note: "직장인 회원과 운동초보 회원들이 부담 없이 다니는 친근한 분위기로 작성",
    seoKeywords: ["신정 복싱", "신정동 복싱", "양천구 복싱", "신정 다이어트"],
  },

  개봉점: {
    status: "운영 중인 지점",
    area: "서울시 구로구 개봉동",
    hours: "월-금 13:00~23:00",
    note: "동네 주민들이 편하게 운동하러 오는 친근한 분위기로 작성",
    seoKeywords: ["개봉 복싱", "개봉동 복싱", "구로 복싱", "개봉 다이어트"],
  },

  영등포점: {
    status: "운영 중인 지점",
    area: "서울시 영등포구",
    hours: "월-금 13:00~23:00",
    note: "직장인 회원들이 퇴근 후 편하게 운동하는 분위기로 작성",
    seoKeywords: ["영등포 복싱", "영등포구 복싱", "영등포 다이어트", "영등포 복싱장"],
  },
};

export async function POST(request: Request) {
  try {
    const { keyword, branch_name } = await request.json();

    if (!keyword) {
      return Response.json(
        { ok: false, message: "키워드는 필수입니다." },
        { status: 400 }
      );
    }

    const branch = branchInfo[branch_name] || {};
    const seoKeywords = branch.seoKeywords || ["복싱", "다이어트 복싱", "복싱장"];

    // 매번 다른 글 각도를 랜덤으로 선택
    const angles = [
      "처음 복싱을 시작하러 왔을 때의 첫날 경험을 중심으로",
      "복싱으로 살을 빼고 싶은 사람이 3개월 다니면 어떻게 달라지는지 경험담 스타일로",
      "혼자 운동이 질릴 때 복싱을 선택한 이유를 이야기하듯",
      "퇴근 후 스트레스를 풀 운동을 찾다가 복싱을 발견한 직장인 시각으로",
      "운동 초보인데 복싱이 가능할지 고민하는 사람한테 솔직하게 설명하듯",
      "복싱이 다이어트에 왜 효과적인지 구체적인 이유를 들어서",
      "체육관 처음 가기 전 궁금한 것들(수업방식, 분위기, 복장 등)을 미리 알려주는 스타일로",
      "오랫동안 운동을 안 하다가 복싱으로 다시 시작하는 사람의 시각으로",
      "여성 입장에서 복싱이 무섭지 않고 오히려 재밌는 이유를 중심으로",
      "복싱 vs 다른 운동 비교 없이, 복싱만의 독특한 재미에 집중해서",
    ];
    const angle = angles[Math.floor(Math.random() * angles.length)];

    const response = await client.responses.create({
      model: "gpt-4.1-mini",

      input: `
너는 네이버 지역 체육관 블로그 전문 마케터야.

브랜드명: 스트롱복싱
현재 작성 지점: ${branch_name}

지점 정보:
- 지역: ${branch.area}
- 운영시간: ${branch.hours}
- 분위기: ${branch.note}
- 지점 SEO 키워드: ${seoKeywords.join(", ")}

사용자가 입력한 핵심 키워드:
${keyword}

이번 글의 각도 (반드시 이 시각으로 써야 해):
${angle}

[핵심 규칙]

- 위 "이번 글의 각도"를 글 전체 흐름의 중심으로 삼을 것
- 절대로 "도입 → 장점 나열 → 대상별 설명 → 마무리" 같은 뻔한 구성 금지
- 각도에 맞게 자유롭게 이야기를 풀어가면 돼
- 글의 중심은 ${branch_name} 기준으로 작성
- 다른 지점은 마지막 문단에서만 한 줄 자연스럽게 언급 가능
- 동네 체육관의 친근하고 편안한 분위기
- 광고 느낌, 과장, 딱딱한 표현 금지
- 처음 운동하는 사람도 편하게 읽힐 것
- 이모지는 최대 2~3개, 자연스러운 위치에만 사용
- 억지로 같은 키워드 반복 금지

[말투 규칙 — 매우 중요]

- "안녕하세요", "안녕하세요!" 같은 인사말로 시작 절대 금지
- "~입니다", "~합니다", "~됩니다" 같은 딱딱한 격식체 금지
- "~해요", "~어요", "~거든요", "~더라고요", "~잖아요" 같은 자연스러운 구어체로 작성
- 실제로 아는 사람한테 말하듯 편하게 풀어가는 느낌
- 문장 끝에 "~다!" 식의 선언형 끝맺음 금지
- 블로그 글이지만 대화하는 느낌이 나야 해

[SEO 규칙]

- 제목에 "${keyword}" 앞부분에 포함
- 본문 첫 문단에 "${keyword}" 자연스럽게 포함
- 지점 SEO 키워드 중 2~3개 본문에 자연스럽게 포함
- 소제목 3~5개, "## 소제목" 형식
- 글 길이 최소 1200자
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
  "hashtags": [
    "스트롱복싱",
    "복싱입문",
    "다이어트복싱"
  ]
}
`,
    });

    const text = response.output_text.trim();
    const json = JSON.parse(text);

    return Response.json({
      ok: true,
      post: json,
    });
  } catch (error) {
    console.error("AI 생성 오류:", error);

    return Response.json(
      {
        ok: false,
        message: "AI 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}