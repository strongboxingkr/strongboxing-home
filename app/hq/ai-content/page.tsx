"use client";
import { useEffect, useState, useCallback } from "react";
import { Sparkles, RefreshCw, Copy, Check, ChevronDown } from "lucide-react";
import { Toast, useToast } from "@/app/components/hq/Toast";

interface Branch { id: number; name: string }

const TYPES   = ["릴스","네이버클립","블로그","당근","카카오","인스타"];
const TARGETS = ["학생","여성","직장인","다이어트","키즈","초보자","일반"];
const MOODS   = ["자연스럽게","짧게","홍보스럽지 않게","학부모용","개인계정 느낌","활기차게"];
const CS = { background:"#FFFFFF", border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" } as const;

function CopyBtn({ text, label="복사" }: { text:string; label?:string }) {
  const [c,setC]=useState(false);
  return (
    <button onClick={async()=>{ await navigator.clipboard.writeText(text); setC(true); setTimeout(()=>setC(false),1200); }}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
      style={{background:c?"rgba(16,185,129,0.1)":"#F3F4F6",color:c?"#059669":"#6B7280"}}>
      {c?<Check size={12}/>:<Copy size={12}/>} {c?"복사됨":label}
    </button>
  );
}

function ResultBox({ label, value }: { label:string; value:string }) {
  const [open,setOpen]=useState(true);
  if(!value) return null;
  return (
    <div className="rounded-2xl overflow-hidden" style={CS}>
      <div className="flex items-center justify-between px-5 py-3 cursor-pointer" style={{borderBottom:open?"1px solid #F3F4F6":"none"}}
        onClick={()=>setOpen(p=>!p)}>
        <p className="text-[12px] font-bold" style={{color:"#111827"}}>{label}</p>
        <div className="flex items-center gap-2">
          <CopyBtn text={value}/>
          <ChevronDown size={14} color="#9CA3AF" style={{transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
        </div>
      </div>
      {open&&<p className="px-5 py-4 text-[13px] leading-relaxed whitespace-pre-wrap" style={{color:"#374151"}}>{value}</p>}
    </div>
  );
}

export default function AiContentPage() {
  const [branches,setBranches]=useState<Branch[]>([]);
  const [f,setF]=useState({branch_id:"",type:"릴스",target:"일반",mood:"자연스럽게",prompt:""});
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<{insta?:string;clip_title?:string;blog?:string;hashtags?:string}|null>(null);
  const {toast,notify}=useToast();

  const loadBranches=useCallback(async()=>{
    const j=await fetch("/api/hq/branches").then(r=>r.json());
    setBranches(j.data??[]);
  },[]);
  useEffect(()=>{loadBranches();},[loadBranches]);

  const upd=(k:keyof typeof f)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setF(p=>({...p,[k]:e.target.value}));
  const inp="w-full rounded-xl border px-3 py-2 text-[13px] outline-none focus:border-red-400 transition-colors";
  const ist={borderColor:"#E5E7EB",color:"#111827",background:"#FAFAFA"};
  const lbl="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest";

  const generate=async()=>{
    if(!f.prompt.trim()){notify("내용을 입력해주세요.",false);return;}
    setLoading(true);
    setResult(null);
    try{
      const branch=branches.find(b=>String(b.id)===f.branch_id);
      const r=await fetch("/api/hq/ai-content",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({branch:branch?.name??"스트롱복싱",type:f.type,target:f.target,mood:f.mood,prompt:f.prompt})});
      const j=await r.json();
      if(j.success&&j.data){setResult(j.data);notify("AI 생성 완료!");}
      else notify("생성 실패: "+(j.message??""),false);
    }catch(e){notify("네트워크 오류",false);}
    finally{setLoading(false);}
  };

  const examples=[
    "목동점 학생 복싱 체험반 모집, 방학 특강 홍보용",
    "신정점 여성 전용 반 오픈, 초보자 환영 분위기",
    "영등포점 샌드백 트레이닝 영상, 다이어트 효과 강조",
    "5개 지점 통합 여름 이벤트, 첫 달 50% 할인",
  ];

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <Toast toast={toast}/>
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{color:"#111827"}}>AI 콘텐츠 생성</h1>
        <p className="mt-0.5 text-[13px]" style={{color:"#6B7280"}}>GPT-4o-mini가 인스타, 클립, 블로그, 해시태그를 한 번에 생성합니다.</p>
      </div>

      {/* 입력 폼 */}
      <div className="rounded-2xl p-6 space-y-4" style={CS}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className={lbl} style={{color:"#9CA3AF"}}>지점</label>
            <select className={inp} style={ist} value={f.branch_id} onChange={upd("branch_id")}>
              <option value="">스트롱복싱 (공통)</option>
              {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select></div>
          <div><label className={lbl} style={{color:"#9CA3AF"}}>플랫폼</label>
            <select className={inp} style={ist} value={f.type} onChange={upd("type")}>
              {TYPES.map(t=><option key={t}>{t}</option>)}
            </select></div>
          <div><label className={lbl} style={{color:"#9CA3AF"}}>타겟</label>
            <select className={inp} style={ist} value={f.target} onChange={upd("target")}>
              {TARGETS.map(t=><option key={t}>{t}</option>)}
            </select></div>
        </div>
        <div><label className={lbl} style={{color:"#9CA3AF"}}>분위기</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m=>(
              <button key={m} onClick={()=>setF(p=>({...p,mood:m}))}
                className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all"
                style={{background:f.mood===m?"#EF3B2D":"#F3F4F6",color:f.mood===m?"#FFF":"#6B7280"}}>{m}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={lbl} style={{color:"#9CA3AF"}}>콘텐츠 내용 *</label>
          <textarea className={inp} style={ist} rows={4} value={f.prompt} onChange={upd("prompt")}
            placeholder="예: 목동점 여름방학 학생 복싱 체험반 모집. 초보자도 쉽게 배울 수 있음. 7월 한 달만 50% 할인 이벤트."/>
        </div>

        {/* 예시 */}
        <div>
          <p className="text-[11px] font-semibold mb-2" style={{color:"#9CA3AF"}}>예시 (클릭하면 채워짐)</p>
          <div className="flex flex-wrap gap-2">
            {examples.map(ex=>(
              <button key={ex} onClick={()=>setF(p=>({...p,prompt:ex}))}
                className="rounded-xl px-3 py-1.5 text-[11px] transition-all hover:bg-gray-100"
                style={{background:"#F9FAFB",color:"#374151",border:"1px solid #E5E7EB"}}>{ex}</button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-black disabled:opacity-50 transition-all"
          style={{background:"#EF3B2D",color:"#FFF"}}>
          {loading?<RefreshCw size={16} className="animate-spin"/>:<Sparkles size={16}/>}
          {loading?"AI가 생성 중입니다...":"콘텐츠 생성"}
        </button>
      </div>

      {/* 결과 */}
      {result&&(
        <div className="space-y-4">
          <p className="text-[12px] font-bold" style={{color:"#059669"}}>✅ 생성 완료</p>
          <ResultBox label="📸 인스타그램 게시글" value={result.insta??""} />
          <ResultBox label="🎬 네이버 클립 제목" value={result.clip_title??""} />
          <ResultBox label="📝 블로그 초안" value={result.blog??""} />
          <ResultBox label="#️⃣ 해시태그" value={result.hashtags??""} />
          {result.hashtags&&result.insta&&(
            <CopyBtn text={`${result.insta}\n\n${result.hashtags}`} label="인스타+해시태그 한 번에 복사"/>
          )}
        </div>
      )}
    </div>
  );
}
