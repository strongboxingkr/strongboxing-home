-- SEO 키워드 컬럼 추가 (이미 존재하면 에러 무시)
ALTER TABLE naver_blog_posts
  ADD COLUMN seo_keywords TEXT NULL DEFAULT NULL;
