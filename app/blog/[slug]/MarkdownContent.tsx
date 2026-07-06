"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

const PROSE =
  "prose prose-invert prose-lg max-w-none " +
  "prose-headings:font-black prose-headings:tracking-tight " +
  "prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-5 " +
  "prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 " +
  "prose-p:leading-9 prose-p:text-zinc-200 prose-p:my-6 " +
  /* 리스트 */
  "[&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6 " +
  "[&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_li]:text-zinc-200 [&_li]:my-2 [&_li]:leading-8 " +
  "[&_li::marker]:text-[#D01E2E] " +
  /* 이미지: 원본 비율 유지, 잘리지 않게 */
  "[&_img]:w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 " +
  "[&_img]:my-10 " +
  /* video도 동일하게 */
  "[&_video]:w-full [&_video]:rounded-2xl [&_video]:my-10";

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
