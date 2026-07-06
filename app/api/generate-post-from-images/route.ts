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

    // 이미지 content 배열 구성
    const imageContents = imageUrls.map((url: string) => ({
      type: "input_image" as const,
      image_url: url.startsWith("http") ? url : `https://strongboxing.kr${url}`,
    }));

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            ...imageContents,
            {
              type: "input_text",
              text: `
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

[핵심 규칙]
- 사진에서 보이는 실제 장면을 글의 중심 소재로 쓸 것
- "도입 → 장점 나열 → 마무리" 같은 뻔한 구성 금지
- 동네 체육관의 친근하고 편안한 분위기
- 과장되거나 허위 느낌 금지
- 이모지는 문단 사이나 소제목 옆에 자연스럽게 3~5개 사용

[말투 규칙]
- "안녕하세요! 스트롱복싱 ${branch_name}입니다 😊" 같은 인사로 시작
- "~입니다", "~합니다" 격식체 유지
- 네이버 블로그 체육관 글 특유의 밝고 친근한 격식체

[SEO 규칙]
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
`,
            },
          ],
        },
      ],
    });

    const text = response.output_text.trim();
    const json = JSON.parse(text);

    return Response.json({ ok: true, post: json });
  } catch (error) {
    console.error("AI 이미지 기반 생성 오류:", error);
    return Response.json({ ok: false, message: "AI 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
