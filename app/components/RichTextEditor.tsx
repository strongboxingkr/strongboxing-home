"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export interface RichTextEditorHandle {
  insertHtml: (html: string) => void;
}

const FONT_SIZES = [
  { label: "소", size: "14px" },
  { label: "중", size: "18px" },
  { label: "대", size: "24px" },
  { label: "특대", size: "32px" },
];

const COLORS = [
  { label: "기본", color: "#171717" },
  { label: "빨강", color: "#FC5230" },
  { label: "파랑", color: "#3B82F6" },
  { label: "초록", color: "#22C55E" },
  { label: "노랑", color: "#FACC15" },
  { label: "회색", color: "#71717A" },
];

const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(function RichTextEditor(
  { value, onChange },
  ref
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // 커서 위치 저장
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }

  // 저장된 커서 위치에 HTML 삽입
  useImperativeHandle(ref, () => ({
    insertHtml(html: string) {
      editorRef.current?.focus();
      const sel = window.getSelection();
      let range = savedRangeRef.current;

      if (!range && sel && sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
      }

      if (range) {
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
        document.execCommand("insertHTML", false, html);
      } else {
        // 커서 없으면 맨 끝에 추가
        if (editorRef.current) {
          editorRef.current.innerHTML += html;
        }
      }

      onChange(editorRef.current?.innerHTML || "");
    },
  }));

  function exec(command: string, val?: string) {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || "");
  }

  function handleInput() {
    onChange(editorRef.current?.innerHTML || "");
  }

  const btnClass =
    "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-bold hover:bg-zinc-100 active:bg-zinc-200";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 bg-zinc-50 p-3">
        <button type="button" onClick={() => exec("bold")} className={btnClass + " font-black"}>B</button>
        <button type="button" onClick={() => exec("italic")} className={btnClass + " italic"}>I</button>
        <button type="button" onClick={() => exec("underline")} className={btnClass + " underline"}>U</button>
        <div className="mx-1 w-px bg-zinc-300" />
        {FONT_SIZES.map(({ label, size }) => (
          <button
            key={size}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const sel = window.getSelection();
              if (!sel || sel.rangeCount === 0) return;
              const range = sel.getRangeAt(0);
              const span = document.createElement("span");
              span.style.fontSize = size;
              try {
                range.surroundContents(span);
              } catch {
                span.appendChild(range.extractContents());
                range.insertNode(span);
              }
              onChange(editorRef.current?.innerHTML || "");
            }}
            className={btnClass}
          >
            {label}
          </button>
        ))}
        <div className="mx-1 w-px bg-zinc-300" />
        <button type="button" onClick={() => exec("justifyLeft")} className={btnClass}>좌</button>
        <button type="button" onClick={() => exec("justifyCenter")} className={btnClass}>중앙</button>
        <button type="button" onClick={() => exec("justifyRight")} className={btnClass}>우</button>
        <div className="mx-1 w-px bg-zinc-300" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) return;
            const range = sel.getRangeAt(0);
            const h2 = document.createElement("h2");
            h2.style.cssText = "font-size:22px;font-weight:900;margin:16px 0 8px";
            h2.appendChild(range.extractContents());
            range.insertNode(h2);
            onChange(editorRef.current?.innerHTML || "");
          }}
          className={btnClass}
        >
          소제목
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("링크 URL");
            if (url) exec("createLink", url);
          }}
          className={btnClass}
        >
          링크
        </button>
        <div className="mx-1 w-px bg-zinc-300" />
        {COLORS.map(({ label, color }) => (
          <button
            key={color}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("foreColor", color);
            }}
            className={btnClass}
            style={{ color }}
            title={label}
          >
            ■
          </button>
        ))}
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          className={btnClass + " text-red-400"}
        >
          초기화
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        className="min-h-[320px] p-5 text-[16px] leading-8 outline-none"
        style={{ wordBreak: "break-word" }}
      />
    </div>
  );
});

export default RichTextEditor;
