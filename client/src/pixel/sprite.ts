import type { Palette, RGB } from "./palettes";
export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => { const img = new Image(); img.crossOrigin="anonymous"; img.onload=()=>res(img); img.onerror=rej; img.src=url; });
}
function shadeToColor(gray: number, pal: Palette): RGB { const step = Math.floor((gray/255)*pal.length); const idx = Math.max(0, Math.min(pal.length-1, step)); return pal[idx]; }
export function drawSprite(ctx: CanvasRenderingContext2D, img: HTMLImageElement, dx: number, dy: number, options?: { tint?: Palette; smoothing?: boolean }) {
  const { tint, smoothing=false } = options ?? {}; const w=img.width,h=img.height; (ctx as any).imageSmoothingEnabled = smoothing;
  if(!tint){ ctx.drawImage(img,dx,dy); return; }
  const off=document.createElement("canvas"); off.width=w; off.height=h; const octx=off.getContext("2d")!; (octx as any).imageSmoothingEnabled=false; octx.drawImage(img,0,0);
  const data=octx.getImageData(0,0,w,h); const a=data.data;
  for(let i=0;i<a.length;i+=4){ const r=a[i],g=a[i+1],b=a[i+2],al=a[i+3]; if(al===0)continue; const gray=(r+g+b)/3; const [nr,ng,nb]=shadeToColor(gray,tint); a[i]=nr;a[i+1]=ng;a[i+2]=nb; }
  octx.putImageData(data,0,0); ctx.drawImage(off,dx,dy);
}
