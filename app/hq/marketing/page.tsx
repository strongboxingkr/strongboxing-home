"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, X, Save, Trash2, Upload, FileSpreadsheet } from "lucide-react";
import { Toast, useToast } from "@/app/components/hq/Toast";
import * as XLSX from "xlsx";

interface StatRow {
  id: number; branch_id: number | null; branch_name: string | null;
  channel: string; stat_date: string;
  impressions: number; clicks: number;
  inquiries: number; registrations: number; ad_cost: number;
  memo: string | null;
}

const CHANNELS = ["인스타그램","네이버클립","블로그","당근마켓","카카오","유튜브","기타"];
const BC: Record<string,string> = { 목동점:"#8B5CF6",신정점:"#10B981",개봉점:"#3B82F6",철산점:"#EF3B2D",영등포점:"#F59E0B" };
const CS = { background:"#FFFFFF", border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" } as const;

function fmtN(n:number){return n>=10000?`${(n/10000).toFixed(1)}만`:n.toLocaleString();}
function fmtW(n:number){return n>=10000?`${(n/10000).toFixed(0)}만원`:`${n.toLocaleString()}원`;}

function StatModal({ item, onClose, onSave }: {
  item:Partial<StatRow>|null; onClose:()=>void; onSave:()=>void;
}) {
  const isEdit=!!item?.id;
  const [f,setF]=useState({
    branch_id:String(item?.branch_id??""), channel:item?.channel??"인스타그램",
    stat_date:item?.stat_date?.slice(0,10)??"",
    impressions:String(item?.impressions??"0"),
    clicks:String(item?.clicks??"0"),
    inquiries:String(item?.inquiries??"0"),
    registrations:String(item?.registrations??"0"),
    ad_cost:String(item?.ad_cost??"0"),
    memo:item?.memo??"",
  });
  const [branches,setBranches]=useState<{id:number;name:string}[]>([]);
  const [saving,setSaving]=useState(false);
  useEffect(()=>{fetch("/api/hq/branches").then(r=>r.json()).then(j=>setBranches(j.data??[]));},[]);
  const upd=(k:keyof typeof f)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setF(p=>({...p,[k]:e.target.value}));
  const inp="w-full rounded-xl border px-3 py-2 text-[13px] outline-none focus:border-red-400 transition-colors";
  const ist={borderColor:"#E5E7EB",color:"#111827",background:"#FAFAFA"};
  const lbl="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.3)"}}>
      <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={CS}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[16px] font-black" style={{color:"#111827"}}>{isEdit?"통계 수정":"통계 입력"}</p>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} color="#6B7280"/></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={lbl} style={{color:"#9CA3AF"}}>지점</label>
            <select className={inp} style={ist} value={f.branch_id} onChange={upd("branch_id")}>
              <option value="">공통</option>{branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select></div>
          <div><label className={lbl} style={{color:"#9CA3AF"}}>채널</label>
            <select className={inp} style={ist} value={f.channel} onChange={upd("channel")}>
              {CHANNELS.map(c=><option key={c}>{c}</option>)}
            </select></div>
          <div className="sm:col-span-2"><label className={lbl} style={{color:"#9CA3AF"}}>날짜 *</label>
            <input type="date" className={inp} style={ist} value={f.stat_date} onChange={upd("stat_date")}/></div>
          <div><label className={lbl} style={{color:"#9CA3AF"}}>노출수</label>
            <input type="number" className={inp} style={ist} value={f.impressions} onChange={upd("impressions")}/></div>
          <div><label className={lbl} style={{color:"#9CA3AF"}}>클릭수</label>
            <input type="number" className={inp} style={ist} value={f.clicks} onChange={upd("clicks")}/></div>
          <div><label className={lbl} style={{color:"#9CA3AF"}}>문의수</label>
            <input type="number" className={inp} style={ist} value={f.inquiries} onChange={upd("inquiries")}/></div>
          <div><label className={lbl} style={{color:"#9CA3AF"}}>등록수</label>
            <input type="number" className={inp} style={ist} value={f.registrations} onChange={upd("registrations")}/></div>
          <div className="sm:col-span-2"><label className={lbl} style={{color:"#9CA3AF"}}>광고비 (원)</label>
            <input type="number" className={inp} style={ist} value={f.ad_cost} onChange={upd("ad_cost")}/></div>
          <div className="sm:col-span-2"><label className={lbl} style={{color:"#9CA3AF"}}>메모</label>
            <textarea className={inp} style={ist} rows={2} value={f.memo} onChange={upd("memo")}/></div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold" style={{background:"#F3F4F6",color:"#6B7280"}}>취소</button>
          <button disabled={saving} onClick={async()=>{
            if(!f.stat_date){alert("날짜는 필수입니다.");return;}
            setSaving(true);
            const body={...f,branch_id:f.branch_id?Number(f.branch_id):null,
              impressions:Number(f.impressions),clicks:Number(f.clicks),
              inquiries:Number(f.inquiries),registrations:Number(f.registrations),ad_cost:Number(f.ad_cost)};
            try{
              if(isEdit) await fetch(`/api/hq/marketing-stats/${item!.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
              else await fetch("/api/hq/marketing-stats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
              onSave();onClose();
            }finally{setSaving(false);}
          }} className="flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold disabled:opacity-50"
            style={{background:"#EF3B2D",color:"#FFF"}}>
            <Save size={14}/>{saving?"저장 중...":"저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 엑셀 업로드 모달 ───────────────────────────────────────────────────────
interface ExcelRow { stat_date:string; channel:string; impressions:number; clicks:number; inquiries:number; registrations:number; ad_cost:number; memo:string }

const AD_SOURCES = ["메타광고","네이버광고","카카오광고","구글광고","기타"];

function ExcelModal({ onClose, onSave }: { onClose:()=>void; onSave:()=>void }) {
  const [rows,setRows]=useState<ExcelRow[]>([]);
  const [saving,setSaving]=useState(false);
  const [adSource,setAdSource]=useState("메타광고");
  const fileRef=useRef<HTMLInputElement>(null);

  function parseFile(file:File){
    const reader=new FileReader();
    reader.onload=e=>{
      const wb=XLSX.read(e.target?.result,{type:"array"});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const raw: any[]=XLSX.utils.sheet_to_json(ws,{defval:""});

      const mapped=raw.map(r=>{
        // 키 검색 헬퍼 (공백/괄호 무시, 부분 매칭)
        const findKey=(...names:string[])=>Object.keys(r).find(k=>{
          const norm=k.replace(/[\s()（）]/g,"").toLowerCase();
          return names.some(n=>norm.includes(n.toLowerCase()));
        })??"";
        const num=(...names:string[])=>{
          const key=findKey(...names);
          return key?Number(String(r[key]).replace(/[^0-9.]/g,""))||0:0;
        };

        // 날짜
        const dateKey=findKey("날짜","date","일자","기간");
        const dateRaw=dateKey?r[dateKey]:"";
        let stat_date="";
        if(dateRaw){
          if(typeof dateRaw==="number"){
            const d=XLSX.SSF.parse_date_code(dateRaw);
            stat_date=`${d.y}-${String(d.m).padStart(2,"0")}-${String(d.d).padStart(2,"0")}`;
          } else {
            stat_date=String(dateRaw).slice(0,10).replace(/\./g,"-").replace(/\//g,"-");
          }
        }

        // 채널: 파일 내 채널 컬럼 있으면 쓰고, 없으면 선택한 adSource
        const chKey=findKey("채널","channel","캠페인","광고유형");
        const channel=chKey&&r[chKey]?String(r[chKey]):adSource;

        return {
          stat_date,
          channel,
          // 메타: 노출, 클릭(전체), 결과, 지출금액
          // 네이버: 노출수, 클릭수, 전환수, 총비용
          impressions: num("노출수","노출","impression","impressions"),
          clicks:      num("클릭수","클릭","click","clicks","링크클릭"),
          inquiries:   num("문의","inquiry","전환수","전환","result","결과"),
          registrations: num("등록수","등록","registration","구매","가입"),
          ad_cost:     num("광고비","지출금액","총비용","비용","cost","spent","amount","금액"),
          memo:        String(r[findKey("메모","memo","캠페인명","광고명")]||""),
        } as ExcelRow;
      }).filter(r=>r.stat_date);
      setRows(mapped);
    };
    reader.readAsArrayBuffer(file);
  }

  const save=async()=>{
    if(rows.length===0)return;
    setSaving(true);
    try{
      const j=await fetch("/api/hq/marketing-stats/bulk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rows})}).then(r=>r.json());
      if(j.success){onSave();onClose();}else alert(j.message??"저장 실패");
    }finally{setSaving(false);}
  };

  const CS2={background:"#FFFFFF",border:"1px solid #E5E7EB",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"} as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.35)"}}>
      <div className="w-full max-w-4xl rounded-2xl p-6 max-h-[90vh] flex flex-col" style={CS2}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[16px] font-black" style={{color:"#111827"}}>엑셀 업로드</p>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} color="#6B7280"/></button>
        </div>

        {rows.length===0 ? (
          <div className="space-y-4">
            {/* 광고 플랫폼 선택 */}
            <div>
              <p className="text-[11px] font-semibold mb-2 uppercase tracking-widest" style={{color:"#9CA3AF"}}>광고 플랫폼</p>
              <div className="flex flex-wrap gap-2">
                {AD_SOURCES.map(s=>(
                  <button key={s} onClick={()=>setAdSource(s)}
                    className="rounded-xl px-4 py-1.5 text-[12px] font-semibold transition-all"
                    style={{background:adSource===s?"#EF3B2D":"#F3F4F6",color:adSource===s?"#FFF":"#6B7280"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* 드롭존 */}
            <div className="flex flex-col items-center justify-center gap-4 py-14"
              style={{border:"2px dashed #E5E7EB",borderRadius:16,cursor:"pointer"}}
              onClick={()=>fileRef.current?.click()}>
              <FileSpreadsheet size={40} color="#9CA3AF"/>
              <p className="text-[14px] font-bold" style={{color:"#374151"}}>{adSource} 엑셀 파일을 선택하세요</p>
              <p className="text-[12px] text-center" style={{color:"#9CA3AF"}}>
                메타·네이버 광고 내보내기 파일 (.xlsx, .csv) 지원<br/>
                컬럼명이 달라도 자동 매핑됩니다
              </p>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                onChange={e=>{ const f=e.target.files?.[0]; if(f) parseFile(f); }}/>
              <button className="rounded-xl px-5 py-2 text-[13px] font-bold" style={{background:"#EF3B2D",color:"#FFF"}}>
                파일 선택
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-3 text-[13px]" style={{color:"#6B7280"}}>총 <b style={{color:"#111827"}}>{rows.length}행</b> 인식됨. 확인 후 저장하세요.</p>
            <div className="overflow-auto flex-1 rounded-xl" style={{border:"1px solid #E5E7EB"}}>
              <table className="w-full text-[11px]">
                <thead><tr style={{background:"#F9FAFB"}}>
                  {["날짜","채널","노출","클릭","문의","등록","광고비","메모"].map(h=>(
                    <th key={h} className="px-3 py-2 text-left font-semibold" style={{color:"#6B7280"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {rows.map((r,i)=>(
                    <tr key={i} style={{borderTop:"1px solid #F3F4F6",background:i%2===0?"#FFF":"#FAFAFA"}}>
                      <td className="px-3 py-2" style={{color:"#111827"}}>{r.stat_date}</td>
                      <td className="px-3 py-2" style={{color:"#374151"}}>{r.channel}</td>
                      <td className="px-3 py-2" style={{color:"#374151"}}>{r.impressions.toLocaleString()}</td>
                      <td className="px-3 py-2" style={{color:"#374151"}}>{r.clicks.toLocaleString()}</td>
                      <td className="px-3 py-2" style={{color:"#374151"}}>{r.inquiries}</td>
                      <td className="px-3 py-2" style={{color:"#059669",fontWeight:600}}>{r.registrations}</td>
                      <td className="px-3 py-2" style={{color:"#EF3B2D"}}>{r.ad_cost.toLocaleString()}원</td>
                      <td className="px-3 py-2" style={{color:"#9CA3AF"}}>{r.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button onClick={()=>setRows([])} className="text-[12px]" style={{color:"#9CA3AF"}}>다시 선택</button>
              <div className="flex gap-2">
                <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold" style={{background:"#F3F4F6",color:"#6B7280"}}>취소</button>
                <button disabled={saving} onClick={save}
                  className="flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold disabled:opacity-50"
                  style={{background:"#EF3B2D",color:"#FFF"}}>
                  <Upload size={14}/>{saving?"저장 중...":"DB에 저장"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MarketingPage() {
  const [stats,setStats]=useState<StatRow[]>([]);
  const [loading,setLoading]=useState(true);
  const [channelFilter,setChannelFilter]=useState("전체");
  const [modal,setModal]=useState<{open:boolean;item:Partial<StatRow>|null}>({open:false,item:null});
  const [excelModal,setExcelModal]=useState(false);
  const {toast,notify}=useToast();

  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const j=await fetch("/api/hq/marketing-stats").then(r=>r.json());
      setStats(j.data??[]);
    }catch(e){console.error(e);notify("불러오기 실패",false);}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const del=async(s:StatRow)=>{
    if(!confirm("삭제하시겠습니까?"))return;
    const j=await fetch(`/api/hq/marketing-stats/${s.id}`,{method:"DELETE"}).then(r=>r.json());
    if(j.success){notify("삭제됐습니다.");load();}else notify("삭제 실패",false);
  };

  const totalImpr=stats.reduce((s,r)=>s+r.impressions,0);
  const totalClicks=stats.reduce((s,r)=>s+r.clicks,0);
  const totalInq=stats.reduce((s,r)=>s+r.inquiries,0);
  const totalReg=stats.reduce((s,r)=>s+r.registrations,0);
  const totalCost=stats.reduce((s,r)=>s+r.ad_cost,0);
  const ctr=totalImpr>0?((totalClicks/totalImpr)*100).toFixed(2):"-";

  const filtered=stats.filter(s=>channelFilter==="전체"||s.channel===channelFilter);

  return (
    <div className="max-w-[1360px] mx-auto space-y-6">
      <Toast toast={toast}/>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black tracking-tight" style={{color:"#111827"}}>마케팅 관리</h1>
          <p className="mt-0.5 text-[13px]" style={{color:"#6B7280"}}>채널별 마케팅 성과 데이터를 입력하고 분석합니다.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={()=>setExcelModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold"
            style={{background:"#F3F4F6",color:"#374151"}}><FileSpreadsheet size={15}/> 엑셀 업로드</button>
          <button onClick={()=>setModal({open:true,item:null})}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold"
            style={{background:"#EF3B2D",color:"#FFF"}}><Plus size={15}/> 직접 입력</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {[
          {label:"총 노출수",value:fmtN(totalImpr)},
          {label:"총 클릭수",value:fmtN(totalClicks)},
          {label:"CTR",value:`${ctr}%`},
          {label:"문의수",value:String(totalInq)},
          {label:"등록수",value:String(totalReg)},
        ].map(s=>(
          <div key={s.label} className="rounded-2xl border px-5 py-4 hover:shadow-md transition-all" style={CS}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{color:"#9CA3AF"}}>{s.label}</p>
            <p className="text-[24px] font-black leading-none" style={{color:"#111827"}}>{s.value}</p>
            <div className="mt-3 h-[2px] w-6 rounded-full" style={{background:"#EF3B2D"}}/>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border px-5 py-4" style={CS}>
        <p className="text-[12px] font-bold mb-3" style={{color:"#111827"}}>광고비 / 등록 비용</p>
        <div className="flex gap-6 flex-wrap">
          <div><p className="text-[10px]" style={{color:"#9CA3AF"}}>총 광고비</p>
            <p className="text-[18px] font-black" style={{color:"#EF3B2D"}}>{fmtW(totalCost)}</p></div>
          <div><p className="text-[10px]" style={{color:"#9CA3AF"}}>등록당 비용</p>
            <p className="text-[18px] font-black" style={{color:"#111827"}}>
              {totalReg>0?fmtW(Math.round(totalCost/totalReg)):"-"}
            </p></div>
          <div><p className="text-[10px]" style={{color:"#9CA3AF"}}>문의당 비용</p>
            <p className="text-[18px] font-black" style={{color:"#111827"}}>
              {totalInq>0?fmtW(Math.round(totalCost/totalInq)):"-"}
            </p></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["전체",...CHANNELS].map(c=>(
          <button key={c} onClick={()=>setChannelFilter(c)}
            className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all"
            style={{background:channelFilter===c?"#EF3B2D":"#F3F4F6",color:channelFilter===c?"#FFF":"#6B7280"}}>{c}</button>
        ))}
      </div>

      {loading?(
        <div className="flex items-center justify-center py-20"><p className="text-[13px]" style={{color:"#9CA3AF"}}>불러오는 중…</p></div>
      ):filtered.length===0?(
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-3xl">📊</p><p className="text-[13px]" style={{color:"#9CA3AF"}}>통계 데이터가 없습니다.</p>
        </div>
      ):(
        <div className="rounded-2xl overflow-hidden" style={{border:"1px solid #E5E7EB"}}>
          <table className="w-full text-[12px]">
            <thead><tr style={{background:"#F9FAFB"}}>
              {["날짜","채널","지점","노출","클릭","문의","등록","광고비","메모",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-semibold" style={{color:"#6B7280"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((s,i)=>{
                const bc=s.branch_name?(BC[s.branch_name]??"#6B7280"):"#9CA3AF";
                return (
                  <tr key={s.id} style={{borderTop:"1px solid #F3F4F6",background:i%2===0?"#FFF":"#FAFAFA"}}>
                    <td className="px-4 py-3 font-medium" style={{color:"#111827"}}>{s.stat_date?.slice(0,10)}</td>
                    <td className="px-4 py-3" style={{color:"#374151"}}>{s.channel}</td>
                    <td className="px-4 py-3">
                      {s.branch_name
                        ?<span className="text-[10px] font-semibold rounded-md px-2 py-0.5" style={{background:`${bc}14`,color:bc}}>{s.branch_name}</span>
                        :<span className="text-[10px]" style={{color:"#9CA3AF"}}>공통</span>}
                    </td>
                    <td className="px-4 py-3" style={{color:"#374151"}}>{fmtN(s.impressions)}</td>
                    <td className="px-4 py-3" style={{color:"#374151"}}>{fmtN(s.clicks)}</td>
                    <td className="px-4 py-3" style={{color:"#374151"}}>{s.inquiries}</td>
                    <td className="px-4 py-3" style={{color:"#059669",fontWeight:600}}>{s.registrations}</td>
                    <td className="px-4 py-3" style={{color:"#EF3B2D"}}>{fmtW(s.ad_cost)}</td>
                    <td className="px-4 py-3" style={{color:"#9CA3AF"}}>{s.memo??""}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={()=>setModal({open:true,item:s})} className="p-1 rounded hover:bg-gray-100" style={{color:"#9CA3AF"}}><Save size={12}/></button>
                        <button onClick={()=>del(s)} className="p-1 rounded" style={{color:"#EF3B2D"}}><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {modal.open&&<StatModal item={modal.item} onClose={()=>setModal({open:false,item:null})} onSave={()=>{load();notify("저장됐습니다.");}}/>}
      {excelModal&&<ExcelModal onClose={()=>setExcelModal(false)} onSave={()=>{load();notify(`엑셀 데이터 저장 완료!`);}}/>}
    </div>
  );
}
