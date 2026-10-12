// 기본 주제 10개 + 첫 결과물 초안
import { relatedCandidates, toRelatedLinks, validateLinks } from "./links";
import { renderContent } from "./render";
import { uniqueSlug, type DraftInput } from "./repo";
import type { AdminCheck, DraftBody, DraftImage } from "./types";

export const SEED_TOPICS = [
  { title: "복싱 처음 배우면 어떤 것부터 할까?", keyword: "복싱 처음 배우기", audience: "복싱을 막 시작했거나 등록을 고민하는 성인 입문자", priority: 10 },
  { title: "복싱 첫날 준비물", keyword: "복싱 첫날 준비물", audience: "첫 수업을 앞둔 입문자", priority: 20 },
  { title: "복싱 배우면 꼭 스파링해야 할까?", keyword: "복싱 스파링", audience: "맞는 것이 걱정돼 등록을 망설이는 입문자", priority: 30 },
  { title: "체력이 부족해도 복싱을 시작할 수 있을까?", keyword: "복싱 체력", audience: "운동 경험이 적거나 오래 쉰 성인", priority: 40 },
  { title: "여자 혼자 복싱 체육관에 가도 괜찮을까?", keyword: "여자 복싱", audience: "혼자 등록을 고민하는 여성", priority: 50 },
  { title: "복싱 초보는 일주일에 몇 번 운동하면 좋을까?", keyword: "복싱 운동 횟수", audience: "운동 빈도를 정하려는 입문자", priority: 60 },
  { title: "복싱 체육관 등록 전 확인할 것", keyword: "복싱장 등록", audience: "체육관을 비교 중인 예비 회원", priority: 70 },
  { title: "초등학생 복싱 수업에서는 무엇을 배울까?", keyword: "초등학생 복싱", audience: "자녀 등록을 고민하는 학부모", priority: 80 },
  { title: "복싱 글러브 고르는 법", keyword: "복싱 글러브 고르는 법", audience: "첫 글러브를 사려는 입문자", priority: 90 },
  { title: "운동 후 글러브와 핸드랩 관리 방법", keyword: "글러브 관리", audience: "장비를 막 산 회원", priority: 100 },
];

const SLUG = "boxing-beginner-where-to-start";

const BODY: DraftBody = {
  summary:
    "복싱을 처음 배우면 펀치보다 기본자세와 스텝을 먼저 익힙니다. 자세가 잡히면 잽과 스트레이트를 배우고, 섀도복싱·샌드백·미트로 같은 동작을 반복하면서 몸에 붙입니다. 스파링은 기본기가 충분히 익은 뒤에 본인이 원할 때 해도 늦지 않습니다.",
  sections: [
    {
      heading: "자세와 스텝이 먼저인 이유",
      basis: "general",
      paragraphs: [
        "체육관에 처음 가면 샌드백부터 치고 싶은 마음이 큽니다. 그런데 복싱 수업은 대부분 주먹을 내기 전에 서는 법부터 가르칩니다. 펀치의 힘은 팔이 아니라 발과 골반에서 시작되기 때문입니다.",
        "자세가 흐트러진 채로 세게 치면 힘이 제대로 실리지 않고 손목이나 어깨에 무리가 가기 쉽습니다. 처음 며칠은 같은 동작만 반복해서 지루할 수 있지만, 이 시간이 이후에 배우는 모든 기술의 바탕이 됩니다.",
      ],
      bullets: [],
    },
    {
      heading: "기본자세와 가드: 처음 며칠은 이것만으로 충분합니다",
      basis: "general",
      paragraphs: [
        "기본자세는 몸을 정면에서 비스듬히 틀고 두 손으로 얼굴을 지키는 자세입니다. 처음 배울 때는 주로 이런 부분을 확인합니다.",
        "오른손잡이는 보통 왼발과 왼손이 앞으로 나오는 자세로 시작합니다. 다만 발 간격과 각도는 키와 체형에 따라 조금씩 달라서, 코치가 직접 보고 잡아 주는 대로 따라가는 것이 가장 정확합니다.",
      ],
      bullets: [
        "발은 어깨너비 정도로 벌리고 앞발과 뒷발을 앞뒤로 엇갈리게 둡니다.",
        "무릎을 살짝 굽혀 체중을 두 발에 고르게 나눕니다.",
        "두 주먹은 턱 높이에 두고 팔꿈치는 옆구리 가까이 붙입니다.",
        "턱은 살짝 당기고 시선은 정면을 봅니다.",
      ],
    },
    {
      heading: "스텝: 발이 따라와야 펀치가 나갑니다",
      basis: "general",
      paragraphs: [
        "스텝은 기본자세를 유지한 채 앞뒤, 좌우로 움직이는 연습입니다. 원칙은 단순합니다.",
        "처음에는 발을 신경 쓰면 손이 내려가고, 손을 신경 쓰면 발이 꼬입니다. 누구나 거치는 과정이니 조급해하지 않아도 됩니다.",
      ],
      bullets: [
        "앞으로 갈 때는 앞발이 먼저, 뒤로 갈 때는 뒷발이 먼저 움직입니다.",
        "움직인 뒤에도 두 발 간격이 처음과 같아야 합니다.",
        "두 발이 모이거나 엇갈리지 않게 합니다.",
      ],
    },
    {
      heading: "첫 펀치는 잽과 스트레이트",
      basis: "general",
      paragraphs: [
        "자세와 스텝이 조금 익숙해지면 가장 기본이 되는 두 가지 펀치를 배웁니다.",
        "두 펀치 모두 치고 난 뒤 손을 원래 자리로 빠르게 되돌리는 것까지가 한 동작입니다. 처음에는 세게 치는 것보다 곧게 뻗고 제자리로 돌아오는 데 집중하는 편이 좋습니다. 훅과 어퍼컷은 보통 잽과 스트레이트가 안정된 다음에 배웁니다.",
      ],
      bullets: [
        "**잽**: 앞손으로 곧게 뻗는 펀치입니다. 거리를 재고 다음 공격을 여는 역할을 합니다.",
        "**스트레이트**: 뒷손으로 치는 펀치입니다. 뒷발과 골반을 함께 돌려 체중을 싣습니다.",
      ],
    },
    {
      heading: "섀도복싱, 샌드백, 미트는 무엇이 다를까",
      basis: "general",
      paragraphs: ["같은 펀치라도 어떤 방식으로 연습하느냐에 따라 익히는 것이 다릅니다."],
      bullets: [
        "**섀도복싱**: 거울 앞에서 상대가 있다고 생각하고 움직입니다. 자세와 동작을 스스로 확인하기 좋습니다.",
        "**샌드백**: 실제로 무언가를 칠 때의 거리감과 타격감을 익힙니다. 손목이 꺾이지 않게 주먹을 바르게 쥐는 연습도 됩니다.",
        "**미트**: 코치가 미트를 들고 받아 주는 연습입니다. 타이밍과 연결 동작을 그 자리에서 교정받을 수 있습니다.",
      ],
    },
    {
      heading: "줄넘기와 체력 운동을 함께 하는 이유",
      basis: "general",
      paragraphs: [
        "복싱 수업에는 줄넘기나 맨몸 운동이 함께 들어가는 경우가 많습니다. 줄넘기는 발을 가볍게 쓰는 리듬감을 길러 주고, 3분 동안 움직이고 잠깐 쉬는 복싱 특유의 라운드 흐름에 몸을 익숙하게 만듭니다.",
        "처음부터 오래 뛰지 못해도 괜찮습니다. 중간에 쉬어 가면서 자기 속도로 늘려 가면 됩니다.",
      ],
      bullets: [],
    },
    {
      heading: "처음 한 달은 이런 순서로 생각하면 편합니다",
      basis: "general",
      paragraphs: ["아래는 일반적인 예시입니다. 체육관의 수업 방식과 개인의 속도에 따라 얼마든지 달라질 수 있습니다."],
      bullets: [
        "1주차: 기본자세, 가드, 앞뒤 스텝",
        "2주차: 잽과 스트레이트, 둘을 잇는 원투",
        "3주차: 샌드백과 미트로 원투 반복, 좌우 스텝",
        "4주차: 펀치 뒤 가드로 돌아오는 습관 들이기, 간단한 콤비네이션",
      ],
    },
    {
      heading: "처음 배울 때 자주 하는 실수",
      basis: "general",
      paragraphs: [],
      bullets: [
        "어깨와 팔에 힘을 잔뜩 주고 친다. 힘을 빼야 펀치가 빨라집니다.",
        "펀치를 친 뒤 손을 내린다. 치고 나서 바로 가드로 돌아오는 습관이 중요합니다.",
        "숨을 참는다. 펀치를 낼 때 짧게 내쉬는 호흡을 함께 연습합니다.",
        "처음부터 매일 무리해서 나온다. 몸이 적응할 시간을 두는 편이 오래 다니기에 좋습니다.",
      ],
    },
  ],
  faq: [
    {
      q: "운동을 거의 안 해 봤는데 따라갈 수 있을까요?",
      a: "기본자세와 스텝은 체력보다 반복이 중요한 동작이라 운동 경험이 없어도 시작할 수 있습니다. 체력 운동은 처음에 힘들 수 있으니 쉬는 시간을 충분히 가지면서 강도를 조금씩 올리면 됩니다.",
    },
    {
      q: "처음부터 스파링을 하나요?",
      a: "입문 단계에서는 보통 스파링 없이 기본기 위주로 배웁니다. 스파링은 기본기가 충분히 익은 뒤 본인이 원할 때 보호 장비를 갖추고 시작하는 경우가 많습니다.",
    },
    {
      q: "글러브와 핸드랩은 바로 사야 하나요?",
      a: "처음 며칠은 체육관에서 빌려 쓸 수 있는지 먼저 확인해 보세요. 수업을 몇 번 들어 보고 계속 다닐 생각이 들 때 손 크기와 용도에 맞춰 사면 실패가 적습니다.",
    },
    {
      q: "일주일에 몇 번 가는 게 좋을까요?",
      a: "처음에는 주 2~3회 정도로 시작해 몸이 적응하는 것을 보며 횟수를 늘리는 방법이 무난합니다. 근육통이 심하면 하루 이틀 쉬어 가도 괜찮습니다.",
    },
  ],
  cta: {
    text: "스트롱복싱은 목동·신정·개봉·철산·영등포에 지점이 있습니다. 첫날 무엇부터 하게 되는지 궁금하다면 가까운 지점에 방문 상담을 예약해 직접 물어보세요.",
    linkLabel: "방문 상담 예약하기",
    href: "/reservation",
  },
};

const IMAGES: DraftImage[] = [
  {
    role: "cover",
    kind: "illustration",
    filename: `${SLUG}-cover.jpg`,
    alt: "어두운 배경 위에 놓인 빨간 복싱 글러브 한 쌍과 감아 둔 핸드랩, 줄넘기를 그린 일러스트",
    caption: "복싱을 시작할 때 처음 만나는 장비들",
    prompt:
      "A pair of red boxing gloves resting together, a rolled-up hand wrap with its loose tail, and a jump rope curved on the floor, simple geometric shapes, centered composition with empty space on the left",
    afterSection: -1,
    needsCoachReview: false,
    coachApproved: false,
    status: "ready",
    url: `/images/blog-auto/${SLUG}-cover.jpg`,
    width: 1200,
    height: 630,
  },
  {
    role: "body1",
    kind: "illustration",
    filename: `${SLUG}-basic-stance.webp`,
    alt: "오른손잡이 기본자세에서 두 발의 위치와 손 높이를 옆에서 본 일러스트",
    caption: "오른손잡이 기본자세 예시",
    prompt:
      "Side view of a faceless stylized figure in an orthodox boxing stance: left foot forward, feet shoulder-width apart and staggered, knees slightly bent, both fists at chin height, elbows close to the ribs, chin tucked. Minimal flat shapes, no gym background",
    afterSection: 1,
    needsCoachReview: true,
    coachApproved: false,
    status: "pending",
    url: null,
  },
];

const CHECKS: AdminCheck[] = [
  {
    id: "c1",
    text: "스트롱복싱 첫 수업에서 자세를 어떻게 잡아 주는지(코치 개별 교정인지, 그룹 진행인지) 확인되면 '스트롱복싱에서는' 단락을 추가할 수 있습니다. 확인 전이라 본문에 넣지 않았습니다.",
    status: "open",
  },
  {
    id: "c2",
    text: "글러브·핸드랩 대여 여부 — 대여가 된다면 FAQ '글러브와 핸드랩은 바로 사야 하나요?' 답변에 지점 기준으로 덧붙일 수 있습니다.",
    status: "open",
  },
  {
    id: "c3",
    text: "스파링이 선택 사항인지(희망자만 진행 등) 운영 방침 확인 — 확인되면 FAQ '처음부터 스파링을 하나요?' 답변에 반영할 수 있습니다.",
    status: "open",
  },
  {
    id: "c4",
    text: "체험 수업 운영 여부 — 지금 예약 페이지가 '방문 상담 예약'이라 본문 마지막 안내도 상담 예약으로 썼습니다. 체험 수업이 있다면 문구를 바꿔도 됩니다.",
    status: "open",
  },
  {
    id: "c5",
    text: "'처음 한 달' 주차별 예시가 실제 수업 진행과 크게 다르지 않은지 코치 확인.",
    status: "open",
  },
];

export async function buildSeedDraft(topicId: number): Promise<DraftInput> {
  const slug = await uniqueSlug(SLUG, topicId);
  const cands = await relatedCandidates(SEED_TOPICS[0].title, SEED_TOPICS[0].keyword, slug);
  const related = toRelatedLinks(cands, [], 3);
  const content_html = renderContent(BODY, IMAGES, related);
  return {
    title: "복싱 처음 배우면 어떤 것부터 할까? 첫 한 달 배우는 순서",
    slug,
    description: "복싱을 처음 배우면 펀치보다 자세와 스텝을 먼저 익힙니다. 첫 한 달 동안 무엇을 어떤 순서로 배우는지 정리했습니다.",
    keyword: SEED_TOPICS[0].keyword,
    body: BODY,
    content_html,
    images: IMAGES,
    checks: CHECKS,
    related,
    link_report: await validateLinks(content_html, slug),
    dup_report: [],
  };
}

// 미리보기(아티팩트·로컬 확인)용
export const SEED_PREVIEW = { slug: SLUG, body: BODY, images: IMAGES, checks: CHECKS };
