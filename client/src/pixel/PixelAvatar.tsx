import React, { useEffect, useRef, useState } from "react";
import { SKIN, HAIR as HAIR_PAL } from "./palettes";
import { HAIR_SET } from "./hairSet";
import { drawSprite, loadImage } from "./sprite";
type Props = { size?: number; skin?: keyof typeof SKIN; hairId?: string; hairColor?: keyof typeof HAIR_PAL; };
async function drawHead(ctx: CanvasRenderingContext2D, skinKey: keyof typeof SKIN, x: number, y: number, size: number) {
  const headPng="/sprites/pixel/head/base.png";
  try { const img = await loadImage(headPng); drawSprite(ctx,img,x,y,{ tint: SKIN[skinKey] }); return; }
  catch { const pal=SKIN[skinKey]; const sq=Math.floor(size/8); (ctx as any).imageSmoothingEnabled=false; pal.forEach((rgb,i)=>{ const [r,g,b]=rgb; ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(x+i*1,y+i*1,size-i*2,size - i*2); }); }
}
export function PixelAvatar({ size=128, skin="tan", hairId="dreads_medium", hairColor="dark" }: Props) {
  const ref=useRef<HTMLCanvasElement>(null); const [ready,setReady]=useState(false);
  useEffect(()=>{ let cancelled=false; (async()=>{ const canvas=ref.current!; canvas.width=size; canvas.height=size; const ctx=canvas.getContext("2d")!; (ctx as any).imageSmoothingEnabled=false; ctx.clearRect(0,0,size,size);
    const hair=HAIR_SET.find(h=>h.id===hairId);
    if(hair?.back){ try{ const back=await loadImage(hair.back); drawSprite(ctx,back,0,0,hair.tintable?{tint:HAIR_PAL[hairColor]}:undefined);}catch{} }
    await drawHead(ctx,skin,0,0,size);
    if(hair?.front){ try{ const front=await loadImage(hair.front); drawSprite(ctx,front,0,0,hair.tintable?{tint:HAIR_PAL[hairColor]}:undefined);}catch{} }
    if(!cancelled) setReady(true);
  })(); return ()=>{cancelled=true}; },[size,skin,hairId,hairColor]);
  return <canvas ref={ref} style={{imageRendering:"pixelated",width:size,height:size,display:"block"}} aria-label="Pixel Avatar" data-ready={ready?"1":"0"} />;
}
export default PixelAvatar;
