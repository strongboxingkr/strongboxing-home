import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const branchInfo: any = {
  철산점: {
    status: "오픈 예정 지점",
    area: "경기도 광명시 철산동",
    hours: "월-금 13:00~23:00, 토 11:00~16:00",
    note: "가족 단위, 신혼부부, 운동초보 문의가 많고 밝고 편한 분위기의 체육관 느낌으로 작성",
  },

  목동점: {
    status: "운영 중인 지점",
    area: "서울시 양천구 목동",
    hours: "월-금 14:00~24:00, 토 11:00~16:00",
    note: "학생 회원, 여성회원, 직장인 회원 비율이 높고 밝고 편한 분위기의 체육관 느낌으로 작성",
  },

  신정점: {
    status: "운영 중인 지점",
    area: "서울시 양천구 신정동",
    hours: "월-금 10:00~24:00, 토 10:00~16:00",
    note: "직장인 회원과 운동초보 회원들이 부담 없이 다니는 친근한 분위기로 작성",
  },

  개봉점: {
    status: "운영 중인 지점",
    area: "서울시 구로구 개봉동",
    hours: "월-금 13:00~23:00",
    note: "동네 주민들이 편하게 운동하러 오는 친근한 분위기로 작성",
  },

  영등포점: {
    status: "운영 중인 지점",
    area: "서울시 영등포구",
    hours: "월-금 13:00~23:00",
    note: "직장인 회원들이 퇴근 후 편하게 운동하는 분위기로 작성",
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

    const response = await client.responses.create({
      model: "gpt-4.1-mini",

      input: `
너는 네이버 지역 체육관 블로그 전문 마케터야.

브랜드명: 스트롱복싱
현재 작성 지점: ${branch_name}

지점 정보:
- 상태: ${branch.status}
- 지역: ${branch.area}
- 운영시간: ${branch.hours}
- 참고사항: ${branch.note}

키워드:
${keyword}

반드시 아래 규칙을 지켜서 작성해.

[핵심 규칙]

- 글의 중심은 반드시 ${branch_name} 기준으로 작성
- 다른 지점은 마지막 안내 문단에서만 자연스럽게 짧게 언급 가능
- 이전에 생성했던 다른 글 내용을 섞지 말 것
- 실제 운영 중인 체육관 블로그처럼 자연스럽게 작성
- 네이버 지역 체육관 블로그 느낌으로 작성
- 모든 지점은 스트롱복싱 목동점 블로그 느낌의 말투와 분위기로 작성
- 동네 체육관 느낌의 친근하고 편안한 분위기
- 가족 단위 회원, 신혼부부, 직장인 회원, 운동초보 회원들이 많이 오는 분위기
- 학생 회원들도 자연스럽게 운동하는 밝은 분위기
- 회원들과 편하게 소통하는 실제 체육관 느낌
- 너무 광고 같거나 과장되지 않게 작성
- 너무 전문적이거나 딱딱하지 않게 작성
- 처음 운동하는 사람도 편하게 읽히는 느낌
- 실제 회원 상담하듯 작성
- 여성회원도 편하게 읽을 수 있는 분위기
- 문장 중간에 🙂 정도의 가벼운 이모지는 소량 사용 가능
- 억지 SEO 문장 반복 금지
- 지역 키워드는 자연스럽게만 포함
- 실제 체육관 소개글 느낌으로 작성
- 글 흐름은 자연스럽고 읽기 편하게 작성
- 문단은 적절히 줄바꿈
- 제목은 검색 키워드가 앞쪽에 오게 작성
- 네이버 블로그 감성의 자연스러운 말투 사용

[중요]

- 철산점은 오픈예정이면 이미 운영 중인 것처럼 작성하지 말 것
- 목동점 글이면 철산점 내용을 섞지 말 것
- 개봉점 글이면 목동점 분위기를 섞지 말 것
- 지점별 특징은 자연스럽게만 반영
- 복싱이 처음인 사람도 부담 없이 느껴지게 작성

반드시 아래 JSON 형식으로만 답변해.
설명 문장, 코드블럭, markdown 없이 순수 JSON만 출력.

{
  "title": "블로그 제목",
  "slug": "영문-url-slug",
  "description": "블로그 목록에 보일 짧은 설명",
  "content": "본문 전체"
}
`,
    });

    const text = response.output_text;
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