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

export default function MosaicEditor({ file, fileIndex, fileTotal, onDone, onSkip, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [regions, setRegions] = useState<Rect[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const [selectionRect, setSelectionRect] = useState<Rect | null>(null);
  const [blockSize, setBlockSize] = useState(15);
  const blockSizeRef = useRef(15);

  useEffect(() => { blockSizeRef.current = blockSize; }, [blockSize]);

  // Load image into canvas on mount
  useEffect(() => {
    setRegions([]);
    setSelectionRect(null);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const maxW = Math.min(860, window.innerWidth - 80);
      const maxH = Math.min(560, window.innerHeight - 260);
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      canvas.style.width = `${Math.round(img.width * scale)}px`;
      canvas.style.height = `${Math.round(img.height * scale)}px`;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function getPos(e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height),
    };
  }

  function applyMosaic(rect: Rect, size: number) {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
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
            r += d[i]; g += d[i + 1]; b += d[i + 2]; a += d[i + 3];
            count++;
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

  function redrawAll(rects: Rect[]) {
    const canvas = canvasRef.current!;
    const img = imgRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    rects.forEach(r => applyMosaic(r, blockSizeRef.current));
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const pos = getPos(e);
    startPos.current = pos;
    setIsDrawing(true);
    setSelectionRect(null);
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const pos = getPos(e);
    setSelectionRect({
      x: Math.min(startPos.current.x, pos.x),
      y: Math.min(startPos.current.y, pos.y),
      w: Math.abs(pos.x - startPos.current.x),
      h: Math.abs(pos.y - startPos.current.y),
    });
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSelectionRect(null);
    const pos = getPos(e);
    const rect = {
      x: Math.min(startPos.current.x, pos.x),
      y: Math.min(startPos.current.y, pos.y),
      w: Math.abs(pos.x - startPos.current.x),
      h: Math.abs(pos.y - startPos.current.y),
    };
    if (rect.w < 5 || rect.h < 5) return;
    applyMosaic(rect, blockSizeRef.current);
    setRegions(prev => [...prev, rect]);
  }

  function handleUndo() {
    const newRegions = regions.slice(0, -1);
    setRegions(newRegions);
    redrawAll(newRegions);
  }

  function handleReset() {
    setRegions([]);
    const canvas = canvasRef.current!;
    const img = imgRef.current!;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
  }

  function handleDone() {
    canvasRef.current!.toBlob(blob => { if (blob) onDone(blob); }, "image/jpeg", 0.92);
  }

  // Convert image-space rect to % for overlay
  function toPercent(rect: Rect) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return {
      left: `${(rect.x / canvas.width) * 100}%`,
      top: `${(rect.y / canvas.height) * 100}%`,
      width: `${(rect.w / canvas.width) * 100}%`,
      height: `${(rect.h / canvas.height) * 100}%`,
    };
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
      <div
        className="flex max-h-[97vh] w-full max-w-4xl flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-6"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black">모자이크 편집</h2>
            <p className="text-sm text-zinc-500">
              원하는 영역을 드래그해 모자이크 적용 · 필요 없으면 &apos;그냥 업로드&apos;
              {fileTotal > 1 && (
                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-500">
                  {fileIndex + 1} / {fileTotal}
                </span>
              )}
            </p>
          </div>
          {regions.length > 0 && (
            <span className="rounded-full bg-[#FC5230]/10 px-3 py-1 text-xs font-black text-[#FC5230]">
              {regions.length}개 적용됨
            </span>
          )}
        </div>

        {/* Canvas area */}
        <div className="relative overflow-hidden rounded-xl bg-[#F0F0F0]" style={{ lineHeight: 0 }}>
          <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { setIsDrawing(false); setSelectionRect(null); }}
            style={{ cursor: "crosshair", display: "block", maxWidth: "100%" }}
          />
          {/* Live selection overlay */}
          {selectionRect && (() => {
            const p = toPercent(selectionRect);
            if (!p) return null;
            return (
              <div
                style={{
                  position: "absolute",
                  ...p,
                  border: "2px dashed #FC5230",
                  background: "rgba(252,82,48,0.15)",
                  pointerEvents: "none",
                }}
              />
            );
          })()}
        </div>

        {/* Block size slider */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-sm font-bold text-zinc-700">모자이크 강도</span>
          <input
            type="range"
            min={6}
            max={40}
            value={blockSize}
            onChange={e => setBlockSize(Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-10 text-right text-sm text-zinc-500">{blockSize}px</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={regions.length === 0}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold disabled:opacity-30"
          >
            실행취소
          </button>
          <button
            onClick={handleReset}
            disabled={regions.length === 0}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold disabled:opacity-30"
          >
            전체 초기화
          </button>

          <div className="flex-1" />

          <button
            onClick={onCancel}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-500"
          >
            취소
          </button>
          <button
            onClick={onSkip}
            className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-bold"
          >
            그냥 업로드
          </button>
          <button
            onClick={handleDone}
            className="rounded-full bg-[#FC5230] px-6 py-2 text-sm font-black text-white"
          >
            완료 & 업로드
          </button>
        </div>
      </div>
    </div>
  );
}
