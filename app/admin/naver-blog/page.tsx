"use client";

import { useEffect, useRef, useState } from "react";

type MediaItem = {
  type: "image" | "video";
  url: string;
  name: string;
};

const BRANCH_SEO_KEYWORDS: Record<string, string[]> = {
  목동점: [
    "목동복싱", "목동복싱장", "양천구복싱", "오목교복싱", "오목교역복싱",
    "목동운동", "양천구운동", "오목교운동", "목동헬스", "양천구헬스",
    "다이어트", "체력관리", "체력증진", "운동", "복싱", "복싱운동",
    "복싱다이어트", "복싱체육관", "복싱클럽", "킥복싱", "복싱PT", "PT",
    "개인운동", "개인레슨", "운동추천", "취미운동", "직장인운동", "학생운동",
    "여성운동", "남성운동", "유산소운동", "전신운동", "스트레스해소",
    "체력키우기", "다이어트운동", "다이어트추천", "운동습관", "건강관리",
    "초보복싱", "초보운동", "복싱입문", "방학운동", "학생다이어트",
    "여름다이어트", "오목교헬스", "양천구PT", "목동PT", "목동체육관",
    "목동다이어트", "스트롱복싱", "스트롱복싱목동",
  ],
  철산점: [
    "철산복싱", "철산복싱장", "광명복싱", "철산동복싱", "광명운동",
    "철산운동", "광명헬스", "철산헬스", "다이어트", "체력관리", "운동",
    "복싱", "복싱운동", "복싱다이어트", "복싱체육관", "복싱클럽", "킥복싱",
    "복싱PT", "PT", "개인레슨", "개인운동", "운동추천", "취미운동",
    "직장인운동", "여성운동", "남성운동", "유산소운동", "전신운동",
    "스트레스해소", "체력증진", "체력키우기", "건강관리", "다이어트운동",
    "여름다이어트", "초보복싱", "초보운동", "복싱입문", "학생운동",
    "방학운동", "광명PT", "철산PT", "광명체육관", "철산체육관",
    "광명다이어트", "철산다이어트", "광명피트니스", "철산피트니스",
    "광명복싱장", "철산역복싱", "스트롱복싱", "스트롱복싱철산",
  ],
  개봉점: [
    "개봉복싱", "개봉복싱장", "개봉동복싱", "구로복싱", "고척복싱",
    "오류동복싱", "개봉운동", "구로운동", "고척운동", "구로헬스", "개봉헬스",
    "다이어트", "운동", "복싱", "복싱운동", "복싱다이어트", "복싱체육관",
    "복싱클럽", "킥복싱", "복싱PT", "PT", "개인레슨", "개인운동",
    "운동추천", "취미운동", "직장인운동", "여성운동", "남성운동", "학생운동",
    "유산소운동", "전신운동", "스트레스해소", "체력관리", "체력증진",
    "체력키우기", "건강관리", "초보복싱", "초보운동", "복싱입문",
    "방학운동", "여름다이어트", "개봉PT", "구로PT", "개봉체육관",
    "구로체육관", "개봉다이어트", "고척다이어트", "오류동운동",
    "구로피트니스", "스트롱복싱", "스트롱복싱개봉",
  ],
  신정점: [
    "신정복싱", "신정동복싱", "신정복싱장", "신정동복싱장", "양천구복싱",
    "신정네거리복싱", "신정운동", "신정동운동", "양천구운동", "신정헬스",
    "신정동헬스", "양천구헬스", "다이어트", "체력관리", "체력증진",
    "운동", "복싱", "복싱운동", "복싱다이어트", "복싱체육관", "복싱클럽",
    "킥복싱", "복싱PT", "PT", "개인레슨", "개인운동", "운동추천",
    "취미운동", "직장인운동", "학생운동", "여성운동", "남성운동",
    "유산소운동", "전신운동", "스트레스해소", "체력키우기", "건강관리",
    "다이어트운동", "여름다이어트", "초보복싱", "초보운동", "복싱입문",
    "방학운동", "학생다이어트", "신정PT", "양천구PT", "신정체육관",
    "신정다이어트", "신정피트니스", "양천구체육관", "스트롱복싱", "스트롱복싱신정",
  ],
  영등포점: [
    "영등포복싱", "영등포복싱장", "신길복싱", "대림복싱", "도림복싱",
    "문래복싱", "영등포운동", "신길운동", "대림운동", "영등포헬스",
    "신길헬스", "문래헬스", "다이어트", "체력관리", "체력증진",
    "운동", "복싱", "복싱운동", "복싱다이어트", "복싱체육관", "복싱클럽",
    "킥복싱", "복싱PT", "PT", "개인레슨", "개인운동", "운동추천",
    "취미운동", "직장인운동", "학생운동", "여성운동", "남성운동",
    "유산소운동", "전신운동", "스트레스해소", "체력키우기", "건강관리",
    "다이어트운동", "여름다이어트", "초보복싱", "초보운동", "복싱입문",
    "방학운동", "영등포PT", "신길PT", "영등포체육관", "영등포다이어트",
    "영등포피트니스", "신길체육관", "대림체육관", "스트롱복싱", "스트롱복싱영등포",
  ],
};

export default function NaverBlogPage() {
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const [posts, setPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [branchName, setBranchName] = useState("철산점");
  const [postNo, setPostNo] = useState("");
  const [keyword, setKeyword] = useState("");
  const [topic, setTopic] = useState("");
  const [memo, setMemo] = useState("");
  const [seoKeywords, setSeoKeywords] = useState(
    BRANCH_SEO_KEYWORDS["철산점"].join(", ")
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  // 지점 변경 시 — 편집 중이 아닐 때만 기본 키워드 자동 채우기
  useEffect(() => {
    if (!editingId) {
      setSeoKeywords(BRANCH_SEO_KEYWORDS[branchName]?.join(", ") ?? "");
    }
  }, [branchName]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadPosts() {
    const res = await fetch("/api/naver-blog-posts");
    const data = await res.json();

    if (data.ok) {
      setPosts(data.posts);
    }
  }

  function insertText(text: string) {
    const textarea = contentRef.current;

    if (!textarea) {
      setContent((prev) => prev + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setContent((prev) => prev.slice(0, start) + text + prev.slice(end));

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
    }, 0);
  }

  async function handleUpload(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "naver-blog");
    formData.append("branch", branchName);
    formData.append("postNo", postNo);

    try {
        const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
        console.error("업로드 실패 응답:", data);
        alert(data.message || "업로드 실패");
        return;
        }

        const type = file.type.startsWith("video") ? "video" : "image";

        const item: MediaItem = {
        type,
        url: data.url,
        name: file.name,
        };

        setMedia((prev) => [...prev, item]);

        if (type === "image") {
        insertText(`\n\n[사진] ${data.url}\n\n`);
        } else {
        insertText(`\n\n[영상] ${data.url}\n\n`);
        }
        } catch (error) {
            console.error("업로드 요청 오류:", error);
            alert("업로드 실패");
        } finally {
            setUploading(false);
        }
    }

  async function handleAI() {
    if (!keyword) {
      alert("키워드를 입력해줘.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("branch", branchName);
    formData.append("keyword", keyword);
    formData.append("topic", topic);
    formData.append("memo", memo);

    const res = await fetch("/api/naver-blog-ai", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      alert(data.message || "AI 생성 실패");
      return;
    }

    setTitle(data.draft.title || "");
    setContent(data.draft.body || "");
    setHashtags(
      Array.isArray(data.draft.hashtags)
        ? data.draft.hashtags.map((tag: string) => `#${tag}`).join(" ")
        : data.draft.hashtags || ""
    );
  }

  async function handleSave() {
    if (!title || !content) {
      alert("제목과 본문은 꼭 입력해야 해.");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/naver-blog-posts", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        title,
        branch_name: branchName,
        keyword,
        content,
        hashtags,
        media,
        seo_keywords: seoKeywords,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!data.ok) {
      alert(data.message || "저장 실패");
      return;
    }

    alert(editingId ? "수정 완료!" : "저장 완료!");

    resetForm();
    loadPosts();
  }

  function handleEdit(post: any) {
    setEditingId(post.id);
    setTitle(post.title || "");
    setBranchName(post.branch_name || "철산점");
    setKeyword(post.keyword || "");
    setContent(post.content || "");
    setHashtags(post.hashtags || "");
    setSeoKeywords(post.seo_keywords || "");

    try {
      setMedia(typeof post.media === "string" ? JSON.parse(post.media) : post.media || []);
    } catch {
      setMedia([]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제할까요?")) return;

    const res = await fetch("/api/naver-blog-posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.message || "삭제 실패");
      return;
    }

    alert("삭제 완료");
    loadPosts();

    if (editingId === id) {
      resetForm();
    }
  }

  function resetForm() {
    setEditingId(null);
    setBranchName("철산점");
    setPostNo("");
    setKeyword("");
    setTopic("");
    setMemo("");
    setTitle("");
    setContent("");
    setHashtags("");
    setMedia([]);
    setSeoKeywords(BRANCH_SEO_KEYWORDS["철산점"].join(", "));
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    alert("복사 완료!");
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-500">
        ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">
        NAVER BLOG
        </p>

        <h1 className="mb-3 text-6xl font-black text-zinc-900 tracking-[-0.06em]">
        네이버 블로그 작성
        </h1>

        <p className="mb-10 text-zinc-500">
        AI 생성 · 직접 작성 · 사진 · 영상 첨부
        </p>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-5 rounded-[30px] border border-zinc-200 bg-white p-6">
            <div>
              <label className="mb-2 block font-bold">지점</label>
              <select
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <option>철산점</option>
                <option>목동점</option>
                <option>신정점</option>
                <option>개봉점</option>
                <option>영등포점</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">글 번호</label>
              <input
                value={postNo}
                onChange={(e) => setPostNo(e.target.value)}
                placeholder="예: 001"
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
              />
              <p className="mt-1 text-xs text-zinc-400">사진이 naver-blog/지점/글번호/ 폴더에 저장됩니다</p>
            </div>

            <div>
              <label className="mb-2 block font-bold">ai 키워드</label>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: 철산 복싱"
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">글 주제</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 초보자 복싱 입문"
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">AI 참고 메모</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예: 목동점 블로그 말투처럼 자연스럽게"
                className="h-28 w-full rounded-2xl border border-zinc-200 bg-white p-4"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-bold">SEO 키워드</label>
                <button
                  type="button"
                  onClick={() =>
                    setSeoKeywords(BRANCH_SEO_KEYWORDS[branchName]?.join(", ") ?? "")
                  }
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold text-zinc-500"
                >
                  기본값 불러오기
                </button>
              </div>
              <textarea
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="목동복싱, 목동복싱장, 양천구복싱 ..."
                className="h-28 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm"
              />
              <p className="mt-1 text-xs text-zinc-400">쉼표(,)로 구분하여 입력합니다</p>
              {seoKeywords && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {seoKeywords
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean)
                    .map((k, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600"
                      >
                        #{k}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <button
              onClick={handleAI}
              disabled={loading}
              className="w-full rounded-full bg-[#FC5230] px-6 py-4 font-black text-white disabled:opacity-50"
            >
              {loading ? "AI 작성 중..." : "AI로 글 생성"}
            </button>

            <div className="border-t border-zinc-200 pt-5">
              <label className="mb-2 block font-bold">사진/영상 삽입</label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                disabled={uploading}
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  selected.forEach(handleUpload);
                  e.target.value = "";
                }}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
              />

              {uploading && (
                <p className="mt-2 text-sm font-bold text-[#FC5230]">
                  업로드 중...
                </p>
              )}
            </div>

            <button
              onClick={() => insertText("\n\n[사진]\n\n")}
              className="w-full rounded-full border border-zinc-200 px-6 py-3 font-bold"
            >
              [사진] 자리 넣기
            </button>

            <button
              onClick={() => insertText("\n\n[영상]\n\n")}
              className="w-full rounded-full border border-zinc-200 px-6 py-3 font-bold"
            >
              [영상] 자리 넣기
            </button>
          </aside>

          <section className="space-y-5">
            <div className="rounded-[30px] border border-zinc-200 bg-white p-6">
              <label className="mb-2 block font-bold">제목</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="네이버 블로그 제목"
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
              />
            </div>

            <div className="rounded-[30px] border border-zinc-200 bg-white p-6">
              <div className="mb-3 flex justify-between">
                <label className="font-bold">본문</label>
                <button
                  onClick={() => copy(content)}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-black text-white"
                >
                  본문 복사
                </button>
              </div>

              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 네이버 블로그 글을 직접 작성하거나 AI 생성 결과를 수정해."
                className="h-[560px] w-full rounded-2xl border border-zinc-200 bg-white p-5 leading-8"
              />
            </div>

            <div className="rounded-[30px] border border-zinc-200 bg-white p-6">
              <div className="mb-3 flex justify-between">
                <label className="font-bold">해시태그</label>
                <button
                  onClick={() => copy(hashtags)}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-black text-white"
                >
                  태그 복사
                </button>
              </div>

              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#철산복싱 #광명복싱 #스트롱복싱"
                className="h-24 w-full rounded-2xl border border-zinc-200 bg-white p-4"
              />
            </div>

            {media.length > 0 && (
              <div className="rounded-[30px] border border-zinc-200 bg-white p-6">
                <h2 className="mb-4 text-2xl font-black text-white">첨부 미디어</h2>

                <div className="grid gap-3 md:grid-cols-2">
                  {media.map((item, i) => (
                    <div
                      key={`${item.url}-${i}`}
                      className="rounded-2xl border border-zinc-200 bg-white p-4"
                    >
                      <p className="mb-2 text-sm text-zinc-500">
                        {item.type === "image" ? "사진" : "영상"} {i + 1}
                      </p>

                      <p className="break-all text-sm text-zinc-600">
                        {item.url}
                      </p>

                      <button
                        onClick={() => copy(item.url)}
                        className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-black text-white text-black"
                      >
                        URL 복사
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black text-white disabled:opacity-50"
              >
                {saving ? "저장 중..." : editingId ? "수정 저장" : "저장"}
              </button>

              <button
                onClick={resetForm}
                className="rounded-full border border-zinc-200 px-8 py-5 text-lg font-black text-white"
              >
                새 글
              </button>
            </div>
          </section>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 text-3xl font-black text-white">저장된 네이버 블로그 글</h2>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-[24px] border border-zinc-200 bg-white p-5"
              >
                <p className="text-sm text-zinc-500">
                  {post.branch_name} · {post.keyword}
                </p>

                <h3 className="mt-1 text-2xl font-black text-white">{post.title}</h3>

                {post.seo_keywords && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.seo_keywords
                      .split(",")
                      .map((k: string) => k.trim())
                      .filter(Boolean)
                      .map((k: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600"
                        >
                          #{k}
                        </span>
                      ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleEdit(post)}
                    className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black text-white"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => copy(post.content)}
                    className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-black text-white"
                  >
                    본문 복사
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-full border border-red-500 px-5 py-3 text-sm font-black text-white text-red-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}