"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-p:leading-9 prose-p:text-zinc-200 prose-img:rounded-[28px] prose-img:border prose-img:border-white/10 prose-img:w-full">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? encodeURI(src) : undefined} alt={alt || ""} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
