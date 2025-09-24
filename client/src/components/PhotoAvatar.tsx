import React, { useRef } from "react";
type Props = { size?: number; value?: string|null; onChange?: (url:string|null)=>void };
const makeSilhouette=(size:number)=>{
  const c=document.createElement("canvas"); c.width=c.height=size; const g=c.getContext("2d")!;
  g.fillStyle="#1c2230"; g.fillRect(0,0,size,size);
  g.fillStyle="#2e3a52"; const r=size*0.25, cx=size/2, cy=size*0.38; g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.fill();
  g.fillRect(size*0.28,size*0.62,size*0.44,size*0.28); return c.toDataURL("image/png");
};
function cropToSquare(img: HTMLImageElement, out=384){ const s=Math.min(img.naturalWidth,img.naturalHeight);
  const sx=(img.naturalWidth-s)/2, sy=(img.naturalHeight-s)/2;
  const c=document.createElement("canvas"); c.width=c.height=out; const g=c.getContext("2d")!;
  g.imageSmoothingEnabled=true; g.imageSmoothingQuality="high"; g.drawImage(img,sx,sy,s,s,0,0,out,out); return c.toDataURL("image/png"); }
export default function PhotoAvatar({size=112,value,onChange}:Props){
  const input=useRef<HTMLInputElement>(null);
  const src=value || makeSilhouette(size*2);
  return (
    <div style={{display:"inline-grid",gap:8,justifyItems:"center"}}>
      <img src={src} width={size} height={size} alt="Avatar" style={{borderRadius:12,border:"1px solid #272a3b",background:"#0f1320"}}/>
      <button className="btn secondary" onClick={()=>input.current?.click()}>Upload Photo</button>
      <input ref={input} type="file" accept="image/*" style={{display:"none"}}
        onChange={(e)=>{ const f=e.target.files?.[0]; if(!f){ onChange?.(null); return; }
          const fr=new FileReader(); fr.onload=()=>{ const img=new Image(); img.onload=()=>onChange?.(cropToSquare(img)); img.src=String(fr.result); }; fr.readAsDataURL(f); }}/>
      {value && <button className="btn ghost" onClick={()=>onChange?.(null)}>Remove</button>}
    </div>
  );
}
