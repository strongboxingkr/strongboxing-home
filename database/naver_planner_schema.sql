-- ============================================================
--  네이버 블로그 작성 도우미 (/admin/naver-planner)
--  MySQL 8 / InnoDB / utf8mb4
--
--  - 기존 테이블은 변경하지 않습니다.
--  - 앱이 처음 /api/naver-planner/* 를 호출할 때 lib/naver-planner/schema.ts 가
--    동일한 CREATE TABLE IF NOT EXISTS 를 실행하므로 수동 실행은 선택입니다.
--  - 자동 발행 기능은 없습니다. 초안은 이 테이블에만 저장됩니다.
-- ============================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS nbp_branches (
  slug          VARCHAR(30)   NOT NULL COMMENT 'gaebong/sinjeong/mokdong/cheolsan',
  name          VARCHAR(50)   NOT NULL,
  address       VARCHAR(300)  NOT NULL DEFAULT '',
  hours         VARCHAR(300)  NOT NULL DEFAULT '',
  price         VARCHAR(500)  NOT NULL DEFAULT '',
  booking_url   VARCHAR(500)  NOT NULL DEFAULT '',
  phone         VARCHAR(50)   NOT NULL DEFAULT '',
  region_terms  VARCHAR(300)  NOT NULL DEFAULT '' COMMENT '키워드 조회에 쓸 지역어 (쉼표 구분)',
  local_notes   TEXT                   COMMENT '운영자가 확인한 지점 특징·주변 정보',
  angle_notes   TEXT                   COMMENT '이 지점 글에서 주로 다룰 주제 방향',
  verified_json VARCHAR(500)  NOT NULL DEFAULT '{}' COMMENT '항목별 확인 여부 {address:true,...}',
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nbp_keyword_lookups (
  id            BIGINT        NOT NULL AUTO_INCREMENT,
  branch_slug   VARCHAR(30)   NOT NULL,
  hints         VARCHAR(500)  NOT NULL COMMENT '조회에 사용한 힌트 키워드',
  result_json   LONGTEXT      NOT NULL COMMENT '검색광고 API 응답(정리본) + 조회 오류',
  fetched_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'API 조회 시각',
  PRIMARY KEY (id),
  KEY idx_nbp_lookups_branch (branch_slug, fetched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nbp_drafts (
  id              BIGINT        NOT NULL AUTO_INCREMENT,
  branch_slug     VARCHAR(30)   NOT NULL,
  keyword         VARCHAR(100)  NOT NULL,
  sub_keywords    VARCHAR(500)  NOT NULL DEFAULT '',
  angle           VARCHAR(200)  NOT NULL DEFAULT '',
  first_title     VARCHAR(200)  NOT NULL DEFAULT '',
  result_json     LONGTEXT      NOT NULL COMMENT '제목3·본문·사진·안내문구·해시태그',
  references_json LONGTEXT      NOT NULL COMMENT '참고한 블로그 검색 결과(제목·요약·링크)',
  keyword_json    LONGTEXT      NOT NULL COMMENT '사용한 키워드의 검색량·조회일',
  warnings_json   LONGTEXT      NOT NULL,
  model           VARCHAR(60)   NOT NULL DEFAULT '',
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_nbp_drafts_branch (branch_slug, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
