-- ============================================================
--  복싱 정보 글 자동화 — 주제 / 초안 / 실행 기록 / 설정
--  MySQL 8 / InnoDB / utf8mb4
--
--  - 기존 테이블(homepage_posts 등)은 변경하지 않습니다.
--  - 초안은 blog_auto_drafts 에만 저장되고, 관리자가 [발행]을 눌러야
--    homepage_posts 에 INSERT 됩니다. (= 초안은 사이트맵·공개 목록에 노출되지 않음)
--  - 앱이 처음 /api/blog-auto/* 를 호출할 때 lib/blog-auto/schema.ts 가
--    동일한 CREATE TABLE IF NOT EXISTS 를 실행하므로 수동 실행은 선택입니다.
-- ============================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS blog_topics (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  title       VARCHAR(200)  NOT NULL COMMENT '글 제목(주제)',
  norm_key    VARCHAR(200)  NOT NULL COMMENT '지역명 제거 비교 키 — 지역명만 바꾼 주제 중복 방지',
  keyword     VARCHAR(100)  NOT NULL COMMENT '핵심 키워드',
  audience    VARCHAR(200)  NOT NULL DEFAULT '' COMMENT '독자',
  status      VARCHAR(20)   NOT NULL DEFAULT '미작성' COMMENT '미작성/작성중/초안/발행/보류/실패',
  priority    INT           NOT NULL DEFAULT 100 COMMENT '낮을수록 먼저 작성',
  memo        TEXT                   COMMENT '관리자 메모 / 보류 사유',
  draft_id    BIGINT                 DEFAULT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_topics_norm (norm_key),
  KEY idx_blog_topics_status (status, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_auto_drafts (
  id                 BIGINT        NOT NULL AUTO_INCREMENT,
  topic_id           BIGINT        NOT NULL COMMENT '주제당 초안 1개 — 재생성 시 같은 행을 갱신',
  title              VARCHAR(200)  NOT NULL,
  slug               VARCHAR(200)  NOT NULL,
  description        VARCHAR(300)  NOT NULL DEFAULT '',
  keyword            VARCHAR(100)  NOT NULL DEFAULT '',
  body_json          LONGTEXT      NOT NULL COMMENT '요약·섹션·FAQ·CTA 원본',
  content_html       LONGTEXT      NOT NULL COMMENT '편집 가능한 본문 HTML (발행 시 homepage_posts.content)',
  images_json        LONGTEXT      NOT NULL,
  checks_json        LONGTEXT      NOT NULL COMMENT '관리자 확인 사항',
  related_json       LONGTEXT      NOT NULL,
  link_report_json   LONGTEXT      NOT NULL,
  dup_report_json    LONGTEXT      NOT NULL,
  status             VARCHAR(20)   NOT NULL DEFAULT 'draft' COMMENT 'draft/published/discarded',
  published_post_id  BIGINT                 DEFAULT NULL COMMENT 'homepage_posts.id',
  model              VARCHAR(100)           DEFAULT NULL,
  created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_auto_drafts_topic (topic_id),
  UNIQUE KEY uq_blog_auto_drafts_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_auto_runs (
  id           BIGINT        NOT NULL AUTO_INCREMENT,
  trigger_type VARCHAR(20)   NOT NULL COMMENT 'manual/schedule/regenerate/image',
  topic_id     BIGINT                 DEFAULT NULL,
  draft_id     BIGINT                 DEFAULT NULL,
  status       VARCHAR(20)   NOT NULL DEFAULT 'running' COMMENT 'running/success/failed/skipped',
  attempts     INT           NOT NULL DEFAULT 0,
  error        TEXT                   DEFAULT NULL,
  log_json     LONGTEXT               DEFAULT NULL,
  usage_json   TEXT                   DEFAULT NULL COMMENT '토큰 사용량/이미지 수',
  started_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at  DATETIME               DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_blog_auto_runs_started (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_auto_settings (
  k           VARCHAR(64)   NOT NULL,
  v           LONGTEXT      NOT NULL,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (k)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
