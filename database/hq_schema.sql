-- ============================================================
--  STRONG BOXING HQ — 전용 테이블 스키마 + 초기 데이터
--  MySQL 8 / InnoDB / utf8mb4
--
--  주의:
--    - 기존 테이블은 절대 변경하지 않습니다.
--    - DROP TABLE 사용 금지, CREATE TABLE IF NOT EXISTS 만 사용
--    - 모든 테이블명은 hq_ 로 시작
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+09:00';


-- ============================================================
-- 1. 지점 정보
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_branches (
  id                      BIGINT        NOT NULL AUTO_INCREMENT,
  name                    VARCHAR(50)   NOT NULL COMMENT '지점명 (예: 목동점)',
  slug                    VARCHAR(50)   NOT NULL COMMENT 'URL 슬러그 (예: mokdong)',
  phone                   VARCHAR(20)            COMMENT '대표 전화번호',
  address                 VARCHAR(200)           COMMENT '주소',
  instagram               VARCHAR(100)           COMMENT '인스타그램 계정 (@ 제외)',
  kakao_map_url           TEXT                   COMMENT '카카오맵 링크',
  naver_reservation_url   TEXT                   COMMENT '네이버 예약 링크',
  business_hours          JSON                   COMMENT '운영시간 JSON',
  memo                    TEXT                   COMMENT '내부 메모',
  is_active               TINYINT(1)    NOT NULL DEFAULT 1,
  created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at              DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hq_branches_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 지점 정보';


-- ============================================================
-- 2. 상담 답변 템플릿
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_consultation_templates (
  id              BIGINT        NOT NULL AUTO_INCREMENT,
  branch_id       BIGINT                 DEFAULT NULL COMMENT 'NULL = 공통 템플릿',
  title           VARCHAR(200)  NOT NULL COMMENT '템플릿 제목',
  category        VARCHAR(50)   NOT NULL COMMENT '카테고리 (회비/원데이/준비물/PT 등)',
  content         TEXT          NOT NULL COMMENT '답변 본문',
  variables       JSON                   COMMENT '변수 목록 (예: ["지점명","가격"])',
  favorite_count  INT           NOT NULL DEFAULT 0,
  copy_count      INT           NOT NULL DEFAULT 0,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hq_ct_branch   (branch_id),
  KEY idx_hq_ct_category (category),
  CONSTRAINT fk_hq_ct_branch FOREIGN KEY (branch_id) REFERENCES hq_branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 상담 답변 템플릿';


-- ============================================================
-- 3. 콘텐츠 프로젝트
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_content_projects (
  id            BIGINT        NOT NULL AUTO_INCREMENT,
  branch_id     BIGINT                 DEFAULT NULL,
  title         VARCHAR(300)  NOT NULL COMMENT '콘텐츠 제목',
  content_type  VARCHAR(50)   NOT NULL COMMENT '유형 (릴스/네이버클립/블로그/당근/카카오/인스타)',
  status        VARCHAR(50)   NOT NULL DEFAULT '아이디어'
                              COMMENT '아이디어/촬영완료/편집중/업로드대기/업로드완료',
  target        VARCHAR(100)           COMMENT '타겟 (학생/여성/직장인 등)',
  shoot_date    DATE                   COMMENT '촬영 예정일',
  manager       VARCHAR(50)            COMMENT '담당자',
  caption       TEXT                   COMMENT '게시글 본문',
  hashtags      TEXT                   COMMENT '해시태그',
  clip_title    VARCHAR(300)           COMMENT '클립/동영상 제목',
  blog_draft    LONGTEXT               COMMENT '블로그 초안',
  memo          TEXT                   COMMENT '내부 메모',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hq_cp_branch     (branch_id),
  KEY idx_hq_cp_status     (status),
  KEY idx_hq_cp_shoot_date (shoot_date),
  CONSTRAINT fk_hq_cp_branch FOREIGN KEY (branch_id) REFERENCES hq_branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 콘텐츠 프로젝트';


-- ============================================================
-- 4. 콘텐츠 첨부 파일
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_content_files (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  project_id  BIGINT        NOT NULL,
  file_type   VARCHAR(20)   NOT NULL COMMENT 'image / video',
  file_name   VARCHAR(300)  NOT NULL,
  file_url    TEXT          NOT NULL,
  file_size   BIGINT                 COMMENT '바이트 단위',
  mime_type   VARCHAR(100),
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hq_cf_project (project_id),
  CONSTRAINT fk_hq_cf_project FOREIGN KEY (project_id) REFERENCES hq_content_projects (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 콘텐츠 첨부 파일';


-- ============================================================
-- 5. 콘텐츠 업로드 채널 상태
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_content_channels (
  id           BIGINT        NOT NULL AUTO_INCREMENT,
  project_id   BIGINT        NOT NULL,
  channel_name VARCHAR(50)   NOT NULL COMMENT '인스타/네이버클립/블로그/당근/카카오',
  is_uploaded  TINYINT(1)   NOT NULL DEFAULT 0,
  uploaded_at  DATETIME               DEFAULT NULL,
  post_url     TEXT                   COMMENT '업로드된 게시물 URL',
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hq_cc_project_channel (project_id, channel_name),
  KEY idx_hq_cc_project (project_id),
  CONSTRAINT fk_hq_cc_project FOREIGN KEY (project_id) REFERENCES hq_content_projects (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 콘텐츠 채널별 업로드 상태';


-- ============================================================
-- 6. 직원 체크리스트 / 업무
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_staff_tasks (
  id           BIGINT        NOT NULL AUTO_INCREMENT,
  branch_id    BIGINT                 DEFAULT NULL,
  task_type    VARCHAR(50)   NOT NULL COMMENT '오픈/마감/청소/기타',
  title        VARCHAR(200)  NOT NULL,
  description  TEXT,
  assigned_to  VARCHAR(100)           COMMENT '담당자명',
  due_date     DATE                   COMMENT '기한',
  is_done      TINYINT(1)   NOT NULL DEFAULT 0,
  done_at      DATETIME               DEFAULT NULL,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hq_st_branch    (branch_id),
  KEY idx_hq_st_task_type (task_type),
  KEY idx_hq_st_due_date  (due_date),
  CONSTRAINT fk_hq_st_branch FOREIGN KEY (branch_id) REFERENCES hq_branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 직원 업무 체크리스트';


-- ============================================================
-- 7. 자료실
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_assets (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  branch_id   BIGINT                 DEFAULT NULL COMMENT 'NULL = 공통 자료',
  title       VARCHAR(300)  NOT NULL,
  category    VARCHAR(50)   NOT NULL COMMENT '입관원서/가격표/로고/전단지/배너/안내문/사진/영상/계약서',
  file_url    TEXT,
  file_name   VARCHAR(300),
  file_type   VARCHAR(20)            COMMENT 'doc / img / vid / design',
  memo        TEXT,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hq_assets_branch   (branch_id),
  KEY idx_hq_assets_category (category),
  CONSTRAINT fk_hq_assets_branch FOREIGN KEY (branch_id) REFERENCES hq_branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 자료실';


-- ============================================================
-- 8. 일정 관리
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_calendar_events (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  branch_id   BIGINT                 DEFAULT NULL,
  title       VARCHAR(300)  NOT NULL,
  event_type  VARCHAR(50)   NOT NULL COMMENT '촬영/업로드/이벤트/블로그',
  start_date  DATETIME      NOT NULL,
  end_date    DATETIME               DEFAULT NULL,
  manager     VARCHAR(100),
  status      VARCHAR(50)   NOT NULL DEFAULT '예정'
                            COMMENT '예정/진행중/촬영완료/업로드완료',
  memo        TEXT,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hq_ce_branch     (branch_id),
  KEY idx_hq_ce_start_date (start_date),
  KEY idx_hq_ce_event_type (event_type),
  CONSTRAINT fk_hq_ce_branch FOREIGN KEY (branch_id) REFERENCES hq_branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 일정 관리';


-- ============================================================
-- 9. 마케팅 성과
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_marketing_stats (
  id              BIGINT        NOT NULL AUTO_INCREMENT,
  branch_id       BIGINT                 DEFAULT NULL COMMENT 'NULL = 전체 합산',
  stat_date       DATE          NOT NULL,
  channel         VARCHAR(50)   NOT NULL COMMENT '네이버/당근/인스타/카카오/블로그/기타',
  inquiries       INT           NOT NULL DEFAULT 0 COMMENT '문의 수',
  registrations   INT           NOT NULL DEFAULT 0 COMMENT '등록 수',
  ad_cost         INT           NOT NULL DEFAULT 0 COMMENT '광고비 (원 단위)',
  impressions     INT           NOT NULL DEFAULT 0 COMMENT '노출 수',
  clicks          INT           NOT NULL DEFAULT 0 COMMENT '클릭 수',
  memo            TEXT,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hq_ms_branch    (branch_id),
  KEY idx_hq_ms_stat_date (stat_date),
  KEY idx_hq_ms_channel   (channel),
  CONSTRAINT fk_hq_ms_branch FOREIGN KEY (branch_id) REFERENCES hq_branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 마케팅 성과 지표';


-- ============================================================
-- 10. HQ 설정 (key-value)
-- ============================================================
CREATE TABLE IF NOT EXISTS hq_settings (
  id             BIGINT        NOT NULL AUTO_INCREMENT,
  setting_key    VARCHAR(100)  NOT NULL,
  setting_value  TEXT,
  memo           VARCHAR(300),
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at     DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hq_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='HQ 전역 설정';


-- ============================================================
-- 초기 데이터
-- ============================================================

-- 지점 5개
INSERT INTO hq_branches
  (name, slug, phone, address, instagram, business_hours, is_active)
VALUES
  ('개봉점', 'gaebong',      '02-2060-1279',
   '서울 구로구 개봉동 166-5 유원빌딩 B1',
   'strongboxing_gaebong',
   JSON_OBJECT('weekday','13:00~23:00','saturday','휴무','sunday','휴무'),
   1),
  ('신정점', 'sinjeong',     '02-2647-3373',
   '서울 양천구 신정동 1021-7 태화상가 2층',
   'strongboxing_sinjeong',
   JSON_OBJECT('weekday','10:00~23:00','saturday','11:00~16:00','sunday','휴무'),
   1),
  ('목동점', 'mokdong',      '02-2643-5971',
   '서울 양천구 목동 909-6 우방빌딩 4층',
   'strongboxing_mokdong',
   JSON_OBJECT('weekday','14:00~24:00','saturday','11:00~16:00','sunday','휴무'),
   1),
  ('철산점', 'cheolsan',     '02-2066-0406',
   '경기 광명시 광복로 60 3층',
   'strongboxing_cheolsan',
   JSON_OBJECT('weekday','13:00~23:00','saturday','14:00~17:00','sunday','14:00~17:00'),
   1),
  ('영등포점','yeongdeungpo','02-831-9312',
   '서울 영등포구 도림로 313 2층',
   'stron_gboxinggym',
   JSON_OBJECT('weekday','13:00~23:00','saturday','휴무','sunday','휴무'),
   1);


-- 상담 템플릿 (branch_id는 INSERT 후 SELECT로 참조)
INSERT INTO hq_consultation_templates
  (branch_id, title, category, content)
VALUES
  (
    (SELECT id FROM hq_branches WHERE slug = 'gaebong'),
    '개봉점 회비 안내',
    '회비',
    '안녕하세요😊 스트롱복싱 개봉점입니다!\n\n📌 회비 안내\n\n✅ 자유반\n1개월 20만원 / 3개월 55만원 / 6개월 100만원 / 1년 190만원\n\n✅ 주3회반\n1개월 18만원 / 3개월 50만원\n\n문의 사항 있으시면 편하게 연락 주세요 🥊'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'mokdong'),
    '목동점 회비 안내',
    '회비',
    '안녕하세요😊 스트롱복싱 목동점입니다!\n\n📌 회비 안내\n\n✅ 자유반\n1개월 21만원 / 3개월 57만원\n\n✅ 주3회반\n1개월 19만원 / 3개월 52만원\n\n✅ 주2회반\n1개월 17만원 / 3개월 48만원\n\n✅ 주1회반\n1개월 15만원 / 3개월 43만원\n\n문의 사항 있으시면 편하게 연락 주세요 🥊'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'cheolsan'),
    '철산점 회비 안내',
    '회비',
    '안녕하세요😊 스트롱복싱 철산점입니다!\n\n📌 회비 안내\n\n✅ 자유반\n1개월 22만원 / 3개월 59만원\n\n✅ 주3회반\n1개월 20만원 / 3개월 55만원\n\n문의 사항 있으시면 편하게 연락 주세요 🥊'
  ),
  (
    NULL,
    '원데이 체험 안내',
    '원데이',
    '안녕하세요😊 스트롱복싱입니다!\n\n원데이 체험 수업 안내드립니다 🥊\n\n✅ 체험 비용: 2만원\n✅ 소요 시간: 약 1시간\n✅ 준비물: 편한 운동복, 실내화\n\n체험 후 등록 시 체험비 차감해드립니다!\n원하시는 날짜와 시간 말씀해 주시면 일정 확인해드릴게요 😊'
  ),
  (
    NULL,
    '준비물 안내',
    '준비물',
    '안녕하세요😊 스트롱복싱입니다!\n\n수업 준비물 안내드립니다 🥊\n\n✅ 필수: 편한 운동복, 실내화\n✅ 선택: 개인 글러브, 핸드랩\n\n글러브·밴디지는 도장에도 준비되어 있으니 처음엔 따로 구매 안 하셔도 됩니다!\n궁금한 점 있으시면 편하게 질문해 주세요 😊'
  ),
  (
    NULL,
    'PT 안내',
    'PT',
    '안녕하세요😊 스트롱복싱입니다!\n\n1:1 개인 PT 안내드립니다 🥊\n\n✅ 10회: 35만원\n✅ 20회: 65만원\n\n개인 목표에 맞춰 트레이너가 1:1로 지도해드립니다.\n체험 수업 후 결정하셔도 됩니다!\n편한 시간에 방문해 주세요 😊'
  );


-- 콘텐츠 프로젝트 6개
INSERT INTO hq_content_projects
  (branch_id, title, content_type, status, target, manager, hashtags)
VALUES
  (
    (SELECT id FROM hq_branches WHERE slug = 'mokdong'),
    '목동 학생 샌드백 릴스',
    '릴스', '업로드완료', '학생', '김지수',
    '#목동복싱 #양천구복싱 #학생복싱 #스트롱복싱목동점'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'cheolsan'),
    '철산 여고생 복싱 연습',
    '릴스', '편집중', '여성', '이민준',
    '#철산복싱 #광명복싱 #여성복싱 #스트롱복싱철산점'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'gaebong'),
    '개봉 미트 훈련 영상',
    '네이버클립', '촬영완료', '직장인', '박수진',
    '#개봉복싱 #구로복싱 #스트롱복싱개봉점'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'mokdong'),
    '목동점 여름방학 특강 블로그',
    '블로그', '아이디어', '학생', '김지수',
    '#목동복싱 #여름방학특강 #학생복싱'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'cheolsan'),
    '철산 당근 홍보글',
    '당근', '업로드완료', '초보자', '이민준',
    '#철산동 #광명운동 #복싱'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'sinjeong'),
    '신정점 인스타 소개글',
    '인스타', '아이디어', '여성', '박수진',
    '#신정동복싱 #양천구운동 #스트롱복싱신정점'
  );


-- 직원 체크리스트 예시 (공통)
INSERT INTO hq_staff_tasks
  (branch_id, task_type, title)
VALUES
  (NULL, '오픈', '조명/에어컨 확인'),
  (NULL, '오픈', '음악 재생'),
  (NULL, '오픈', '바닥 상태 확인'),
  (NULL, '오픈', '상담 테이블 정리'),
  (NULL, '오픈', '수건/운동복 확인'),
  (NULL, '마감', '샌드백 정리'),
  (NULL, '마감', '링/매트 정리'),
  (NULL, '마감', '전등/에어컨 OFF'),
  (NULL, '마감', '문단속'),
  (NULL, '마감', '쓰레기 정리'),
  (NULL, '청소', '화장실'),
  (NULL, '청소', '샤워실'),
  (NULL, '청소', '링'),
  (NULL, '청소', '샌드백'),
  (NULL, '청소', '바닥'),
  (NULL, '청소', '상담실');


-- 자료실 예시
INSERT INTO hq_assets
  (branch_id, title, category, file_type)
VALUES
  (NULL,                                                        '입관원서',              '입관원서', 'doc'),
  ((SELECT id FROM hq_branches WHERE slug = 'mokdong'),         '목동 가격표',            '가격표',   'doc'),
  ((SELECT id FROM hq_branches WHERE slug = 'cheolsan'),        '철산 가격표',            '가격표',   'doc'),
  ((SELECT id FROM hq_branches WHERE slug = 'gaebong'),         '개봉 가격표',            '가격표',   'doc'),
  (NULL,                                                        'STRONG 로고 (흰색)',    '로고',     'design'),
  (NULL,                                                        'STRONG 로고 (빨간색)', '로고',     'design'),
  ((SELECT id FROM hq_branches WHERE slug = 'mokdong'),         '여름방학 특강 전단지',   '전단지',   'img'),
  ((SELECT id FROM hq_branches WHERE slug = 'cheolsan'),        '철산점 배너',            '배너',     'img'),
  (NULL,                                                        '운동복/수건 안내문',     '안내문',   'doc'),
  (NULL,                                                        '인바디 안내문',          '안내문',   'doc'),
  (NULL,                                                        '리뷰 환급 안내문',       '안내문',   'doc'),
  (NULL,                                                        '회원 계약서',            '계약서',   'doc');


-- 일정 예시
INSERT INTO hq_calendar_events
  (branch_id, title, event_type, start_date, manager, status)
VALUES
  (
    (SELECT id FROM hq_branches WHERE slug = 'mokdong'),
    '목동 학생 릴스 촬영',
    '촬영', '2026-07-02 15:00:00', '김지수', '진행중'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'cheolsan'),
    '철산 주말운영 소식 업로드',
    '업로드', '2026-07-03 10:00:00', '이민준', '예정'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'gaebong'),
    '개봉 네이버 클립 업로드',
    '업로드', '2026-07-04 09:00:00', '박수진', '예정'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'mokdong'),
    '목동 여름방학 특강 블로그',
    '블로그', '2026-07-05 14:00:00', '김지수', '예정'
  ),
  (
    (SELECT id FROM hq_branches WHERE slug = 'sinjeong'),
    '신정 여성 미트 릴스 촬영',
    '촬영', '2026-07-06 13:00:00', '이민준', '예정'
  );


-- 마케팅 성과 예시 (이번달, 채널별)
INSERT INTO hq_marketing_stats
  (branch_id, stat_date, channel, inquiries, registrations, ad_cost, impressions, clicks)
VALUES
  (NULL, '2026-07-01', '네이버',  48, 22, 400000, 15000, 820),
  (NULL, '2026-07-01', '당근',    32, 14, 150000,  9000, 430),
  (NULL, '2026-07-01', '인스타',  20,  9, 200000, 22000, 610),
  (NULL, '2026-07-01', '카카오',  18,  7, 250000,  8000, 290),
  (NULL, '2026-07-01', '블로그',  14,  6, 280000, 11000, 340);


-- HQ 기본 설정
INSERT INTO hq_settings
  (setting_key, setting_value, memo)
VALUES
  ('hq_version',          '1.0',                'HQ 버전'),
  ('default_branch',      'mokdong',             '기본 지점 슬러그'),
  ('contact_email',       '',                    '관리자 이메일'),
  ('kakao_notify',        '0',                   '카카오 알림 사용 여부'),
  ('review_reward_amount','5000',                '리뷰 환급 금액 (원)');
