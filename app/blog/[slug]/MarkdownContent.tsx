"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

const PROSE =
  "prose prose-invert prose-lg max-w-none " +
  "prose-headings:font-black prose-headings:tracking-tight " +
  /* H2/H3 크기·여백은 globals.css .prose 규칙이 담당 (specificity 보장) */
  /* mt/mb는 prose 모디파이어로도 지원 — 이중 보호 */
  "prose-h2:mt-10 prose-h2:mb-4 " +
  "prose-h3:mt-7 prose-h3:mb-3 " +
  /* 본문: leading-9(2.0) → 1.8, my-6(24px) → 20px */
  "prose-p:leading-[1.8] prose-p:text-zinc-200 prose-p:my-[20px] " +
  "[&>div:not([class])]:my-[20px] [&>div:not([class])]:leading-[1.8] [&>div:not([class])]:text-zinc-200 " +
  /* 리스트 */
  "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 " +
  "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_li]:text-zinc-200 [&_li]:my-2 [&_li]:leading-[1.7] " +
  "[&_li::marker]:text-[#D01E2E] " +
  /* 이미지: 원본 비율 유지, 잘리지 않게 / my-10(40px) → my-7(28px) */
  "[&_img]:w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 " +
  "[&_img]:my-7 " +
  /* 그리드 안 이미지는 마진 제거 (콜라주 레이아웃 보호) */
  "[&_div_img]:my-0 [&_div_img]:rounded-2xl [&_div_img]:border-0 " +
  /* video: my-10 → my-7 */
  "[&_video]:w-full [&_video]:rounded-2xl [&_video]:my-7";

export default function MarkdownContent({ content }: { content: string }) {
  const isHtml = content.trimStart().startsWith("<");

  if (isHtml) {
    return (
      <div
        className={PROSE}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={PROSE}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? encodeURI(src) : undefined}
              alt={alt || ""}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
