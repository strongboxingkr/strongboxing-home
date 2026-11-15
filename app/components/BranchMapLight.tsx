"use client";

import { useEffect, useRef, useState } from "react";

const BRANCHES = [
  {
    name: "개봉점", slug: "gaebong", lat: 37.4982, lng: 126.8601,
    phone: "02-2060-1279", address: "서울 구로구 개봉동 166-5 유원빌딩 지하 1층",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
    tooltipDir: "top" as const, tooltipOffset: [0, 0] as [number, number],
  },
  {
    name: "신정점", slug: "sinjeong", lat: 37.5272, lng: 126.8695,
    phone: "02-2647-3373", address: "서울 양천구 신정동 1021-7 태화상가 2층",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
    tooltipDir: "left" as const, tooltipOffset: [-2, 0] as [number, number],
  },
  {
    name: "목동점", slug: "mokdong", lat: 37.5258, lng: 126.8738,
    phone: "02-2643-5971", address: "서울 양천구 목동 909-6 우방빌딩 4층",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv",
    tooltipDir: "right" as const, tooltipOffset: [2, 0] as [number, number],
  },
  {
    name: "철산점", slug: "cheolsan", lat: 37.4785, lng: 126.8657,
    phone: "02-2066-0406", address: "경기 광명시 철산동 56-14 3층",
    booking: "https://booking.naver.com/booking/12/bizes/1673598",
    naverMap: "https://naver.me/F8lwn3Te",
    tooltipDir: "bottom" as const, tooltipOffset: [0, 2] as [number, number],
  },
  {
    name: "영등포점", slug: "yeongdeungpo", lat: 37.5167, lng: 126.8982,
    phone: "02-831-9312", address: "서울 영등포구 도림로 313 건영상가 2층",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
    tooltipDir: "right" as const, tooltipOffset: [2, 0] as [number, number],
  },
];

/* OpenStreetMap — 무료, API 키 불필요 / CSS 필터로 Positron 스타일 */
const OSM_TILE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

interface Props {
  activeBranch?: string | null;
  onBranchSelect?: (slug: string) => void;
  height?: number;
}

export default function BranchMapLight({ activeBranch, onBranchSelect, height = 360 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef      = useRef<any>(null);
  const markerRefs  = useRef<Map<string, { cm: any; tooltip: any }>>(new Map());
  const [tileError, setTileError] = useState(false);

  /* ── 지도 초기화 ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !containerRef.current) return;

      /* 5개 지점이 여백과 함께 한눈에 들어오는 bounds */
      const lats = BRANCHES.map(b => b.lat);
      const lngs = BRANCHES.map(b => b.lng);
      const bounds = L.latLngBounds(
        [Math.min(...lats) - 0.015, Math.min(...lngs) - 0.015],
        [Math.max(...lats) + 0.015, Math.max(...lngs) + 0.015],
      );

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      }).fitBounds(bounds);

      /* OSM 타일 — CSS 필터로 Positron 스타일 (밝고 단순) */
      const osmLayer = L.tileLayer(OSM_TILE, { attribution: OSM_ATTR, maxZoom: 19 });
      osmLayer.on("tileerror", () => setTileError(true));
      osmLayer.addTo(map);
      /* 타일 로드 후 필터 적용 */
      osmLayer.on("load", () => {
        const pane = map.getPanes().tilePane as HTMLElement;
        if (pane) pane.style.filter = "grayscale(0.9) brightness(1.15) saturate(0.1) contrast(0.9)";
      });

      BRANCHES.forEach((b) => {
        /* CircleMarker */
        const cm = L.circleMarker([b.lat, b.lng], {
          radius: 7,
          fillColor: "#D01E2E",
          color: "#fff",
          weight: 2.5,
          fillOpacity: 1,
        }).addTo(map);

        /* 항상 보이는 이름표 */
        const tooltip = cm.bindTooltip(b.name, {
          permanent: true,
          direction: b.tooltipDir,
          offset: b.tooltipOffset,
          className: "branch-label",
        }).getTooltip();

        /* 팝업 (260px 고정 너비) — zoom:1.25 로 page zoom:0.8 상쇄 */
        const popupContent = `
          <div style="font-family:inherit;padding:4px 0;width:240px;box-sizing:border-box">
            <p style="font-weight:900;font-size:15px;color:#0E0E10;margin:0 0 3px;white-space:nowrap">${b.name}</p>
            <p style="font-size:11px;color:#888;margin:0 0 2px;line-height:1.4">${b.address}</p>
            <a href="tel:${b.phone}" style="font-size:13px;color:#D01E2E;font-weight:700;text-decoration:none;display:inline-block;margin-bottom:12px">${b.phone}</a>
            <div style="display:flex;gap:7px;margin-bottom:7px">
              <a href="/branches/${b.slug}"
                 style="flex:1;display:flex;align-items:center;justify-content:center;height:38px;border-radius:9px;font-size:12px;font-weight:700;color:#0E0E10;border:1.5px solid #D9D7CF;text-decoration:none;white-space:nowrap;background:#fff">
                지점 정보
              </a>
              <a href="${b.booking}" target="_blank" rel="noopener noreferrer"
                 style="flex:1;display:flex;align-items:center;justify-content:center;height:38px;border-radius:9px;font-size:12px;font-weight:700;color:#fff;background:#D01E2E;text-decoration:none;white-space:nowrap">
                예약하기
              </a>
            </div>
            <a href="${b.naverMap}" target="_blank" rel="noopener noreferrer"
               style="display:flex;align-items:center;justify-content:center;height:36px;border-radius:9px;font-size:12px;font-weight:700;color:#0E0E10;border:1.5px solid #D9D7CF;text-decoration:none;white-space:nowrap;background:#fff">
              길찾기 (네이버)
            </a>
          </div>`;

        cm.bindPopup(popupContent, {
          closeButton: true,
          className: "branch-popup",
          autoPanPadding: [30, 30],
          maxWidth: 280,
        });

        cm.on("click", () => { onBranchSelect?.(b.slug); });
        cm.on("popupopen", () => {
          onBranchSelect?.(b.slug);
          tooltip?.getElement()?.classList.add("branch-label-active");
          cm.setRadius(10);
          cm.setStyle({ weight: 3 });
        });
        cm.on("popupclose", () => {
          if (activeBranch !== b.slug) {
            tooltip?.getElement()?.classList.remove("branch-label-active");
            cm.setRadius(7);
            cm.setStyle({ weight: 2.5 });
          }
        });

        markerRefs.current.set(b.slug, { cm, tooltip });
      });

      mapRef.current = map;
    };

    if ((window as any).L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  /* ── activeBranch 변경 → 하이라이트 + 팬 + 팝업 ── */
  useEffect(() => {
    if (!mapRef.current) return;

    /* 모든 마커 초기화 */
    markerRefs.current.forEach(({ cm, tooltip }) => {
      cm.setRadius(7);
      cm.setStyle({ weight: 2.5 });
      tooltip?.getElement()?.classList.remove("branch-label-active");
    });

    if (!activeBranch) return;
    const ref = markerRefs.current.get(activeBranch);
    if (!ref) return;
    const { cm, tooltip } = ref;
    cm.setRadius(10);
    cm.setStyle({ weight: 3 });
    tooltip?.getElement()?.classList.add("branch-label-active");
    mapRef.current.panTo(cm.getLatLng(), { animate: true });
    cm.openPopup();
  }, [activeBranch]);

  return (
    <>
      <style>{`
        /* 이름표 */
        .branch-label {
          background: #fff !important;
          border: 1.5px solid #D9D7CF !important;
          border-radius: 6px !important;
          padding: 3px 8px !important;
          font-size: 11.5px !important;
          font-weight: 800 !important;
          color: #0E0E10 !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1) !important;
          white-space: nowrap !important;
        }
        .branch-label::before { display: none !important; }
        .branch-label-active {
          background: #D01E2E !important;
          border-color: #D01E2E !important;
          color: #fff !important;
        }

        /* 팝업 — zoom:1.25 으로 page zoom:0.8 상쇄 */
        .branch-popup .leaflet-popup-content-wrapper {
          zoom: 1.25 !important;
          border-radius: 14px !important;
          border: 1px solid #E8E6DF !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14) !important;
          padding: 16px 18px !important;
        }
        .branch-popup .leaflet-popup-tip-container { display: none !important; }
        .branch-popup .leaflet-popup-content { margin: 0 !important; }
        .branch-popup .leaflet-popup-close-button {
          font-size: 18px !important;
          color: #aaa !important;
          right: 10px !important;
          top: 8px !important;
        }

        /* attribution */
        .leaflet-control-attribution { font-size: 9px !important; }
      `}</style>

      <div className="relative overflow-hidden rounded-[20px]" style={{ height, border: "1px solid #E8E6DF" }}>
        <div ref={containerRef} className="h-full w-full" />
        {tileError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[20px]" style={{ background: "#F9F8F5" }}>
            <p className="text-sm font-black" style={{ color: "#6B6B72" }}>지도를 불러오지 못했습니다</p>
            <div className="flex flex-wrap justify-center gap-3">
              {BRANCHES.map((b) => (
                <a key={b.slug} href={`/branches/${b.slug}`}
                  className="rounded-[10px] px-4 py-2 text-xs font-black text-white"
                  style={{ background: "#D01E2E" }}>
                  {b.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
