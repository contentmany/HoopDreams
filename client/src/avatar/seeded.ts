export type PickFn<T> = (arr: readonly T[]) => T;
function hash32(str:string){ let h=2166136261>>>0; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function rnd(seed:number){ return function(){ let s = seed|0; s = (s+0x6D2B79F5); let t=Math.imul(s^(s>>>15),1|s); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
export function picker<T>(seedStr:string):PickFn<T>{ const r=rnd(hash32(seedStr)); return (arr:readonly T[])=>arr[Math.floor(r()*arr.length)]; }
export function avatarFromId(id:string){
  const pick = picker<string>(id||"guest");
  const skins = ["porcelain","light","tan","brown","deep"] as const;
  const hairs = ["dreads_medium","waves_short","buzz"] as const;
  const colors = ["black","dark","brown","blonde"] as const;
  return { skin: pick(skins), hairId: pick(hairs), hairColor: pick(colors) } as const;
}
