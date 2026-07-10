"use client";

import { useEffect, useRef, useState } from "react";

interface Rect { x: number; y: number; w: number; h: number }

interface Props {
  file: File;
  fileIndex: number;
  fileTotal: number;
  onDone: (blob: Blob) => void;
  onSkip: () => void;
  onCancel: () => void;
}

type Mode = "mosaic" | "crop";

export default function MosaicEditor({ file, fileIndex, fileTotal, onDone, onSkip, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<Mode>("mosaic");
  const modeRef = useRef<Mode>("mosaic");
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const [regions, setRegions] = useState<Rect[]>([]);
  const [cropRect, setCropRect] = useState<Rect | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false);
  useEffect(() => { isDrawingRef.current = isDrawing; }, [isDrawing]);

  const startPos = useRef({ x: 0, y: 0 });
  const [selectionRect, setSelectionRect] = useState<Rect | null>(null);

  const [blockSize, setBlockSize] = useState(15);
  const blockSizeRef = useRef(15);
  useEffect(() => { blockSizeRef.current = blockSize; }, [blockSize]);

  function updateDisplaySize(canvas: HTMLCanvasElement) {
    const isMobile = window.innerWidth < 640;
    const maxW = Math.min(isMobile ? window.innerWidth - 32 : 860, window.innerWidth - 32);
    const maxH = Math.min(isMobile ? window.innerHeight * 0.5 : 520, window.innerHeight - 240);
    const scale = Math.min(maxW / canvas.width, maxH / canvas.height, 1);
    canvas.style.width = `${Math.round(canvas.width * scale)}px`;
    canvas.style.height = `${Math.round(canvas.height * scale)}px`;
  }

  useEffect(() => {
    setLoaded(false);
    setRegions([]);
    setCropRect(null);
    setSelectionRect(null);

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const MAX_DIM = 2400;
      const ratio = Math.min(MAX_DIM / img.width, MAX_DIM / img.height, 1);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      updateDisplaySize(canvas);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      setLoaded(true);
    };

    img.onerror = () => { alert("이미지를 불러올 수 없습니다."); onCancel(); };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  function getCanvasPos(clientX: number, clientY: number) {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) * (canvas.width / r.width),
      y: (clientY - r.top) * (canvas.height / r.height),
    };
  }

  function startDraw(clientX: number, clientY: number) {
    if (!loaded) return;
    startPos.current = getCanvasPos(clientX, clientY);
    setIsDrawing(true);
    setSelectionRect(null);
    if (modeRef.current === "crop") setCropRect(null);
  }

  function moveDraw(clientX: number, clientY: number) {
    if (!isDrawingRef.current) return;
    const pos = getCanvasPos(clientX, clientY);
    setSelectionRect({
      x: Math.min(startPos.current.x, pos.x),
      y: Math.min(startPos.current.y, pos.y),
      w: Math.abs(pos.x - startPos.current.x),
      h: Math.abs(pos.y - startPos.current.y),
    });
  }

  function endDraw(clientX: number, clientY: number) {
    if (!isDrawingRef.current) return;
    setIsDrawing(false);
    setSelectionRect(null);
    const pos = getCanvasPos(clientX, clientY);
    const rect = {
      x: Math.min(startPos.current.x, pos.x),
      y: Math.min(startPos.current.y, pos.y),
      w: Math.abs(pos.x - startPos.current.x),
      h: Math.abs(pos.y - startPos.current.y),
    };
    if (rect.w < 5 || rect.h < 5) return;

    if (modeRef.current === "mosaic") {
      applyMosaic(rect, blockSizeRef.current);
      setRegions(prev => [...prev, rect]);
    } else {
      setCropRect(rect);
    }
  }

  // 마우스
  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) { startDraw(e.clientX, e.clientY); }
  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) { moveDraw(e.clientX, e.clientY); }
  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) { endDraw(e.clientX, e.clientY); }

  // 터치 — stale closure 방지용 함수 refs
  const startDrawRef = useRef<(x: number, y: number) => void>(() => {});
  const moveDrawRef = useRef<(x: number, y: number) => void>(() => {});
  const endDrawRef = useRef<(x: number, y: number) => void>(() => {});
  // 매 렌더마다 최신 함수로 갱신
  startDrawRef.current = startDraw;
  moveDrawRef.current = moveDraw;
  endDrawRef.current = endDraw;

  // passive: false 네이티브 터치 리스너 — React 합성 이벤트로는 preventDefault가 무시될 수 있음
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTS = (e: TouchEvent) => { e.preventDefault(); startDrawRef.current(e.touches[0].clientX, e.touches[0].clientY); };
    const onTM = (e: TouchEvent) => { e.preventDefault(); moveDrawRef.current(e.touches[0].clientX, e.touches[0].clientY); };
    const onTE = (e: TouchEvent) => { e.preventDefault(); endDrawRef.current(e.changedTouches[0].clientX, e.changedTouches[0].clientY); };
    canvas.addEventListener("touchstart", onTS, { passive: false });
    canvas.addEventListener("touchmove", onTM, { passive: false });
    canvas.addEventListener("touchend", onTE, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchmove", onTM);
      canvas.removeEventListener("touchend", onTE);
    };
  }, []); // 마운트 1회

  function applyMosaic(rect: Rect, size: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const x = Math.max(0, Math.round(rect.x));
    const y = Math.max(0, Math.round(rect.y));
    const w = Math.min(Math.round(rect.w), canvas.width - x);
    const h = Math.min(Math.round(rect.h), canvas.height - y);
    if (w <= 0 || h <= 0) return;
    const imageData = ctx.getImageData(x, y, w, h);
    const d = imageData.data;
    for (let by = 0; by < h; by += size) {
      for (let bx = 0; bx < w; bx += size) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        for (let py = by; py < Math.min(by + size, h); py++) {
          for (let px = bx; px < Math.min(bx + size, w); px++) {
            const i = (py * w + px) * 4;
            r += d[i]; g += d[i + 1]; b += d[i + 2]; a += d[i + 3]; count++;
          }
        }
        const ar = r / count, ag = g / count, ab = b / count, aa = a / count;
        for (let py = by; py < Math.min(by + size, h); py++) {
          for (let px = bx; px < Math.min(bx + size, w); px++) {
            const i = (py * w + px) * 4;
            d[i] = ar; d[i + 1] = ag; d[i + 2] = ab; d[i + 3] = aa;
          }
        }
      }
    }
    ctx.putImageData(imageData, x, y);
  }

  function applyCrop() {
    const canvas = canvasRef.current;
    if (!canvas || !cropRect) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x = Math.max(0, Math.round(cropRect.x));
    const y = Math.max(0, Math.round(cropRect.y));
    const w = Math.min(Math.round(cropRect.w), canvas.width - x);
    const h = Math.min(Math.round(cropRect.h), canvas.height - y);
    if (w <= 0 || h <= 0) return;

    const imageData = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(imageData, 0, 0);
    updateDisplaySize(canvas);

    // 자른 이미지를 새 기준 이미지로 저장 (undo/reset 기준점 갱신)
    canvas.toBlob(blob => {
      if (!blob) return;
      const newImg = new Image();
      const url = URL.createObjectURL(blob);
      newImg.onload = () => { imgRef.current = newImg; URL.revokeObjectURL(url); };
      newImg.src = url;
    });

    setRegions([]);
    setCropRect(null);
  }

  function redrawAll(rects: Rect[]) {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    rects.forEach(r => applyMosaic(r, blockSizeRef.current));
  }

  function handleUndo() {
    const next = regions.slice(0, -1);
    setRegions(next);
    redrawAll(next);
  }

  function handleReset() {
    setRegions([]);
    setCropRect(null);
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    canvas.getContext("2d")?.drawImage(img, 0, 0);
  }

  function handleDone() {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) { onSkip(); return; }
    canvas.toBlob(blob => {
      if (blob && blob.size > 0) onDone(blob);
      else onSkip();
    }, "image/jpeg", 0.88);
  }

  function toPercent(rect: Rect) {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return null;
    return {
      left: `${(rect.x / canvas.width) * 100}%`,
      top: `${(rect.y / canvas.height) * 100}%`,
      width: `${(rect.w / canvas.width) * 100}%`,
      height: `${(rect.h / canvas.height) * 100}%`,
    };
  }

  const activeSel = selectionRect ?? (mode === "crop" ? cropRect : null);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/85 sm:items-center p-0 sm:p-4">
      <div
        className="flex w-full max-w-4xl flex-col gap-3 overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white"
        style={{ maxHeight: "97vh", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
      >
        {/* 모바일 핸들 */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 sm:px-6 sm:pt-5">
          <div>
            <h2 className="text-lg font-black sm:text-xl">사진 편집</h2>
            <p className="text-xs text-zinc-500 sm:text-sm">
              {mode === "mosaic" ? "모자이크할 부분을 드래그하세요" : "자를 영역을 드래그하세요"}
              {fileTotal > 1 && (
                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-500">
                  {fileIndex + 1} / {fileTotal}
                </span>
              )}
            </p>
          </div>
          {mode === "mosaic" && regions.length > 0 && (
            <span className="rounded-full bg-[#FC5230]/10 px-3 py-1 text-xs font-black text-[#FC5230]">
              {regions.length}개 적용
            </span>
          )}
        </div>

        {/* 모드 선택 */}
        <div className="flex gap-2 px-5 sm:px-6">
          <button
            onClick={() => { setMode("mosaic"); setCropRect(null); }}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-black transition ${
              mode === "mosaic"
                ? "bg-[#FC5230] text-white"
                : "border border-zinc-200 text-zinc-500"
            }`}
          >
            모자이크
          </button>
          <button
            onClick={() => { setMode("crop"); setSelectionRect(null); }}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-black transition ${
              mode === "crop"
                ? "bg-zinc-800 text-white"
                : "border border-zinc-200 text-zinc-500"
            }`}
          >
            자르기
          </button>
        </div>

        {/* Canvas */}
        <div
          className="relative mx-4 overflow-hidden rounded-xl bg-[#F0F0F0] sm:mx-6"
          style={{ lineHeight: 0, minHeight: 100 }}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-bold text-zinc-400">불러오는 중...</p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { setIsDrawing(false); setSelectionRect(null); }}
            style={{
              cursor: loaded ? "crosshair" : "default",
              display: "block",
              maxWidth: "100%",
              opacity: loaded ? 1 : 0,
              touchAction: "none",
            }}
          />

          {/* 모자이크 드래그 미리보기 */}
          {mode === "mosaic" && selectionRect && (() => {
            const p = toPercent(selectionRect);
            if (!p) return null;
            return (
              <div style={{
                position: "absolute", ...p,
                border: "2px dashed #FC5230",
                background: "rgba(252,82,48,0.15)",
                pointerEvents: "none",
              }} />
            );
          })()}

          {/* 자르기 오버레이 */}
          {mode === "crop" && activeSel && (() => {
            const p = toPercent(activeSel);
            if (!p) return null;
            const darken = "rgba(0,0,0,0.55)";
            return (
              <>
                <div style={{ position: "absolute", inset: 0, background: darken, pointerEvents: "none" }} />
                {/* 선택 영역 구멍 — clip으로 뚫기 어려우니 4면 덮개로 */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: p.top, background: darken, pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: `calc(${p.top} + ${p.height})`, background: darken, pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: p.top, left: 0, width: p.left, height: p.height, background: darken, pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: p.top, left: `calc(${p.left} + ${p.width})`, right: 0, height: p.height, background: darken, pointerEvents: "none" }} />
                {/* 선택 테두리 */}
                <div style={{
                  position: "absolute", top: p.top, left: p.left, width: p.width, height: p.height,
                  border: "2px solid white",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
                  pointerEvents: "none",
                }} />
                {/* 모서리 핸들 (시각적) */}
                {[
                  { top: p.top, left: p.left, transform: "translate(-50%,-50%)" },
                  { top: p.top, left: `calc(${p.left} + ${p.width})`, transform: "translate(-50%,-50%)" },
                  { top: `calc(${p.top} + ${p.height})`, left: p.left, transform: "translate(-50%,-50%)" },
                  { top: `calc(${p.top} + ${p.height})`, left: `calc(${p.left} + ${p.width})`, transform: "translate(-50%,-50%)" },
                ].map((s, i) => (
                  <div key={i} style={{
                    position: "absolute", ...s,
                    width: 12, height: 12,
                    borderRadius: 3,
                    background: "white",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                  }} />
                ))}
              </>
            );
          })()}
        </div>

        {/* 모자이크 강도 (모자이크 모드일 때만) */}
        {mode === "mosaic" && (
          <div className="flex items-center gap-3 px-5 sm:px-6">
            <span className="shrink-0 text-sm font-bold text-zinc-600">강도</span>
            <input
              type="range" min={6} max={40} value={blockSize}
              onChange={e => setBlockSize(Number(e.target.value))}
              className="flex-1"
              style={{ height: 28 }}
            />
            <span className="w-8 text-right text-sm text-zinc-400">{blockSize}</span>
          </div>
        )}

        {/* 자르기 적용 버튼 (자르기 모드 + 영역 선택됐을 때) */}
        {mode === "crop" && cropRect && (
          <div className="px-4 sm:px-6">
            <button
              onClick={applyCrop}
              className="w-full rounded-2xl bg-zinc-800 py-3.5 text-sm font-black text-white"
            >
              이 영역으로 자르기 적용
            </button>
          </div>
        )}

        {/* 버튼들 */}
        <div className="flex flex-col gap-2 px-4 pb-6 sm:px-6 sm:pb-5">
          {/* 실행취소 / 초기화 */}
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={mode === "crop" || regions.length === 0}
              className="flex-1 rounded-2xl border border-zinc-200 py-3 text-sm font-bold disabled:opacity-30"
            >
              ↩ 실행취소
            </button>
            <button
              onClick={handleReset}
              disabled={regions.length === 0 && !cropRect}
              className="flex-1 rounded-2xl border border-zinc-200 py-3 text-sm font-bold disabled:opacity-30"
            >
              전체 초기화
            </button>
          </div>

          {/* 주요 액션 */}
          <div className="flex gap-2">
            <button
              onClick={onSkip}
              className="flex-1 rounded-2xl border border-zinc-200 py-3.5 text-sm font-bold text-zinc-500"
            >
              그냥 업로드
            </button>
            <button
              onClick={handleDone}
              disabled={!loaded}
              className="flex-1 rounded-2xl bg-[#FC5230] py-3.5 text-sm font-black text-white disabled:opacity-40"
            >
              완료 & 업로드
            </button>
          </div>

          <button
            onClick={onCancel}
            className="w-full rounded-2xl py-3 text-sm font-bold text-zinc-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
