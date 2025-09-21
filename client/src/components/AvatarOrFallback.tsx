import React from "react";
type Props = { name?: string; size?: number; bg?: string; fg?: string; pixelProps?: Record<string, any>; };
function initialsFrom(name?: string){ if(!name) return "??"; const parts=name.trim().split(/\s+/).slice(0,2); return parts.map(p=>p[0]?.toUpperCase() ?? "").join("") || "??"; }
export default function AvatarOrFallback({ name="Player", size=96, bg="#1F2937", fg="#F9FAFB", pixelProps={} }: Props){
  const [Pixel,setPixel] = React.useState<null | ((p:any)=>JSX.Element)>(null);
  React.useEffect(()=>{ let m=true; (async()=>{ try { const mod = await import("../pixel/PixelAvatar"); if(m && mod?.PixelAvatar) setPixel(()=>mod.PixelAvatar); } catch {} })(); return ()=>{m=false}; },[]);
  if (Pixel) return <Pixel size={Math.max(64,size)} {...pixelProps} />;
  const style:React.CSSProperties = { width:size,height:size,borderRadius:12,background:bg,color:fg,display:"grid",placeItems:"center",fontWeight:700,letterSpacing:"0.5px",userSelect:"none",boxShadow:"0 2px 10px rgba(0,0,0,0.25)" };
  return <div style={style} aria-label="Avatar Fallback"><span style={{fontSize:Math.round(size*0.34)}}>{initialsFrom(name)}</span></div>;
}
