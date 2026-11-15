"use client";

import { useEffect, useRef, useState } from "react";

const BRANCHES = [
  { name: "개봉점",    slug: "gaebong",      lat: 37.4982, lng: 126.8601, phone: "02-2060-1279", booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll" },
  { name: "신정점",    slug: "sinjeong",     lat: 37.5272, lng: 126.8695, phone: "02-2647-3373", booking: "https://booking.naver.com/booking/13/bizes/1367177" },
  { name: "목동점",    slug: "mokdong",      lat: 37.5258, lng: 126.8738, phone: "02-2643-5971", booking: "https://booking.naver.com/booking/13/bizes/1510638" },
  { name: "철산점",    slug: "cheolsan",     lat: 37.4785, lng: 126.8657, phone: "02-2066-0406", booking: "https://booking.naver.com/booking/12/bizes/1673598" },
  { name: "영등포점",  slug: "yeongdeungpo", lat: 37.5167, lng: 126.8982, phone: "02-831-9312",  booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll" },
];

/* OpenStreetMap 타일 — API 키 불필요, 완전 무료 */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

/* 브랜드 레드 커스텀 마커 SVG */
function markerSvg(active = false) {
  const size = active ? 36 : 28;
  const color = "#D01E2E";
  return `<svg width="${size}" height="${size}" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="10" fill="${color}" opacity="${active ? 1 : 0.85}"/>
    <circle cx="18" cy="18" r="5" fill="#fff"/>
    ${active ? `<circle cx="18" cy="18" r="16" fill="${color}" opacity="0.15"/>` : ""}
  </svg>`;
}

interface Props {
  activeBranch?: string | null;
  onBranchSelect?: (slug: string) => void;
  height?: number;
}

export default function BranchMapLight({ activeBranch, onBranchSelect, height = 360 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<Map<string, any>>(new Map());
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    /* Leaflet CSS 로드 */
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    /* Leaflet JS 로드 → 초기화 */
    const initMap = () => {
      const L = (window as any).L;
      if (!L || !containerRef.current) return;

      /* 중심: 5개 지점 무게중심 */
      const centerLat = BRANCHES.reduce((s, b) => s + b.lat, 0) / BRANCHES.length;
      const centerLng = BRANCHES.reduce((s, b) => s + b.lng, 0) / BRANCHES.length;

      const map = L.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      const tileLayer = L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 });
      tileLayer.on("tileerror", () => setTileError(true));
      tileLayer.addTo(map);

      BRANCHES.forEach((b) => {
        const icon = L.divIcon({
          html: markerSvg(false),
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -16],
        });

        const popup = L.popup({
          closeButton: false,
          className: "branch-popup",
          offset: [0, -8],
          maxWidth: 220,
        }).setContent(`
          <div style="font-family:inherit;padding:4px 0">
            <p style="font-weight:900;font-size:14px;color:#0E0E10;margin:0 0 2px">${b.name}</p>
            <p style="font-size:12px;color:#6B6B72;margin:0 0 10px">${b.phone}</p>
            <div style="display:flex;gap:6px">
              <a href="/branches/${b.slug}" style="flex:1;text-align:center;padding:6px 0;border-radius:8px;font-size:11px;font-weight:700;color:#0E0E10;border:1px solid #E8E6DF;text-decoration:none">지점 정보</a>
              <a href="${b.booking}" target="_blank" rel="noopener noreferrer" style="flex:1;text-align:center;padding:6px 0;border-radius:8px;font-size:11px;font-weight:700;color:#fff;background:#D01E2E;text-decoration:none">예약하기</a>
            </div>
          </div>
        `);

        const marker = L.marker([b.lat, b.lng], { icon }).addTo(map);
        marker.bindPopup(popup);
        markerRefs.current.set(b.slug, marker);

        marker.on("click", function () { onBranchSelect?.(b.slug); });
        marker.on("mouseover", function (this: any) {
          this.setIcon(L.divIcon({ html: markerSvg(true), className: "", iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20] }));
        });
        marker.on("mouseout", function (this: any) {
          if (!this.isPopupOpen()) {
            this.setIcon(L.divIcon({ html: markerSvg(false), className: "", iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16] }));
          }
        });
        marker.on("popupopen", function (this: any) {
          this.setIcon(L.divIcon({ html: markerSvg(true), className: "", iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20] }));
        });
        marker.on("popupclose", function (this: any) {
          this.setIcon(L.divIcon({ html: markerSvg(false), className: "", iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16] }));
        });
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  /* activeBranch 변경 시 해당 마커 팬·팝업 열기 */
  useEffect(() => {
    if (!activeBranch || !mapRef.current) return;
    const marker = markerRefs.current.get(activeBranch);
    if (marker) {
      mapRef.current.panTo(marker.getLatLng(), { animate: true });
      marker.openPopup();
    }
  }, [activeBranch]);

  return (
    <>
      <style>{`
        .branch-popup .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          border: 1px solid #E8E6DF !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
          padding: 14px 16px !important;
        }
        .branch-popup .leaflet-popup-tip-container { display: none !important; }
        .branch-popup .leaflet-popup-content { margin: 0 !important; }
        .leaflet-control-attribution { font-size: 9px !important; }
      `}</style>
      <div className="relative overflow-hidden rounded-[20px]" style={{ height, border: "1px solid #E8E6DF" }}>
        <div ref={containerRef} className="h-full w-full" />
        {tileError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[20px]" style={{ background: "#F9F8F5" }}>
            <p className="text-sm font-black" style={{ color: "#6B6B72" }}>지도를 불러오지 못했습니다</p>
            <div className="flex flex-wrap justify-center gap-3">
              {BRANCHES.map((b) => (
                <a key={b.slug} href={b.booking} target="_blank" rel="noopener noreferrer"
                  className="rounded-[10px] px-4 py-2 text-xs font-black text-white"
                  style={{ background: "#D01E2E" }}>
                  {b.name} 보기
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
