// AvatarKit v2 - procedural head-only avatars
// ===== RNG =====
function xmur3(str){for(let h=1779033703^str.length,i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0;}}
function sfc32(a,b,c,d){return function(){a|=0;b|=0;c|=0;d|=0;let t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=(c<<21|c>>>11)+t|0;return (t>>>0)/4294967296;}}
function rng(seed){const x=xmur3(seed)();return sfc32(x,x^0x9E3779B1,x^0x85EBCA77,x^0xC2B2AE3D);}
const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];

// ===== palettes =====
const SKIN={F1:'#f1c9a5',F2:'#d9a06b',F3:'#a8693a',F4:'#6b3b1f'};
const darken=(hex,k=0.82)=>{const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const d=v=>Math.max(0,Math.min(255,Math.round(v*k)));return '#'+(d(r)<<16|d(g)<<8|d(b)).toString(16).padStart(6,'0');};

// ===== canvas helpers =====
function setup(canvas){
  const css=parseInt(getComputedStyle(canvas).width||canvas.width);
  const scale=Math.min(2,window.devicePixelRatio||1);
  canvas.width=css*scale;canvas.height=css*scale;
  const ctx=canvas.getContext('2d');ctx.setTransform(scale,0,0,scale,0,0);
  ctx.imageSmoothingEnabled=true;return ctx;
}
const E=(ctx,x,y,rx,ry)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.closePath();};
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}

// ===== painter =====
function drawHead(ctx,dna){
  const {skin='F2', eyeColor='#3a2f25', eyeShape='round', mouth='neutral',
        hair='fadeShort', hairColor='#111111',
        facial='none', accessory='none', accent='#EA6A11'} = dna;

  ctx.clearRect(0,0,128,128); ctx.fillStyle='#2a2320'; ctx.fillRect(0,0,128,128);
  const SK=SKIN[skin]||SKIN.F2, SKd=darken(SK,0.78), cx=64;

  // neck + head
  E(ctx,cx,100,16,11); ctx.fillStyle=SK; ctx.fill(); ctx.strokeStyle=SKd; ctx.stroke();
  E(ctx,cx,66,30,36); ctx.fillStyle=SK; ctx.fill();
  E(ctx,34,66,6,8); ctx.fill(); E(ctx,94,66,6,8); ctx.fill();
  ctx.globalAlpha=.35; E(ctx,cx,82,22,12); ctx.fillStyle=darken(SK,0.9); ctx.fill(); ctx.globalAlpha=1;

  // eyes
  const eye=(x,y)=>{
    ctx.fillStyle='#fff'; E(ctx,x,y,6.4,6.4); ctx.fill();
    ctx.fillStyle=eyeColor;
    if(eyeShape==='round'){E(ctx,x,y+1.2,3.5,3.5); ctx.fill();}
    if(eyeShape==='almond'){rr(ctx,x-3.8,y-2.2,7.6,4.4,2.2); ctx.fill();}
    if(eyeShape==='sleepy'){rr(ctx,x-4.6,y-1.2,9.2,3.2,1.6); ctx.fill();}
    ctx.fillStyle='#fff'; E(ctx,x+2,y-1.6,1.3,1.3); ctx.fill();
  };
  eye(cx-12,64); eye(cx+12,64);

  // brows
  ctx.fillStyle=hairColor; rr(ctx,cx-22,52,18,4,2); ctx.fill(); rr(ctx,cx+4,52,18,4,2); ctx.fill();

  // nose + mouth
  ctx.strokeStyle=darken(SK,0.7); ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(cx,68); ctx.lineTo(cx,74); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-4,76); ctx.quadraticCurveTo(cx,78,cx+4,76); ctx.stroke();
  ctx.strokeStyle=darken(SK,0.65); ctx.lineWidth=1.8; ctx.beginPath();
  if(mouth==='neutral'){ctx.moveTo(cx-8,86); ctx.quadraticCurveTo(cx,89,cx+8,86);}
  if(mouth==='smile'){ctx.moveTo(cx-9,86); ctx.quadraticCurveTo(cx,92,cx+9,86);}
  if(mouth==='frown'){ctx.moveTo(cx-9,88); ctx.quadraticCurveTo(cx,82,cx+9,88);}
  if(mouth==='smirk'){ctx.moveTo(cx-6,87); ctx.quadraticCurveTo(cx+2,89,cx+10,85);}
  ctx.stroke();

  // facial hair
  ctx.fillStyle=hairColor; ctx.globalAlpha=.95;
  if(facial==='goatee'){rr(ctx,cx-6,92,12,6,3); ctx.fill();}
  if(facial==='mustache'){rr(ctx,cx-10,83,20,3,2); ctx.fill();}
  if(facial==='full'){rr(ctx,cx-16,80,32,20,10); ctx.fill(); ctx.globalCompositeOperation='destination-out'; rr(ctx,cx-8,86,16,6,3); ctx.fill(); ctx.globalCompositeOperation='source-over';}
  ctx.globalAlpha=1;

  // hair bases
  const hairBase=()=>{ctx.fillStyle=hairColor; E(ctx,cx,44,30,16); ctx.fill(); E(ctx,38,60,8,16); ctx.fill(); E(ctx,90,60,8,16); ctx.fill();};

  switch(hair){
    case 'bald': break;
    case 'fadeShort': hairBase(); ctx.globalAlpha=.25; E(ctx,cx,44,26,13); ctx.fillStyle='#000'; ctx.fill(); ctx.globalAlpha=1; rr(ctx,cx-22,40,44,8,4); ctx.fillStyle=hairColor; ctx.fill(); break;
    case 'straight': ctx.fillStyle=hairColor; rr(ctx,cx-30,36,58,18,12); ctx.fill(); rr(ctx,cx-12,38,36,12,10); ctx.fill(); ctx.fillStyle=darken(hairColor,0.6); rr(ctx,cx-2,38,3,16,1.5); ctx.fill(); rr(ctx,cx-30,54,8,18,4); ctx.fill(); rr(ctx,cx+22,54,8,18,4); ctx.fill(); break;
    case 'afro': ctx.fillStyle=hairColor; for(let i=0;i<28;i++){const a=i/28*6.283, r=22+Math.sin(i*1.7)*3; const x=cx+Math.cos(a)*r, y=50+Math.sin(a)*r; E(ctx,x,y,6.2,6.2); ctx.fill();} break;
    case 'cornrows': hairBase(); ctx.strokeStyle=darken(hairColor,0.65); ctx.lineWidth=2; for(let i=-18;i<=18;i+=4){ctx.beginPath(); ctx.moveTo(cx+i,44); ctx.bezierCurveTo(cx+i-6,52,cx+i-6,60,cx+i,68); ctx.stroke();} break;
  }

  // accessories
  if(accessory==='headband'){ctx.fillStyle='#fff'; rr(ctx,cx-26,46,52,10,6); ctx.fill(); ctx.fillStyle=accent; rr(ctx,cx-26,50,52,4,3); ctx.fill();}
  if(accessory==='beanie'){ctx.fillStyle=hairColor; rr(ctx,cx-28,38,56,24,12); ctx.fill(); ctx.fillStyle=darken(hairColor,0.6); rr(ctx,cx-28,56,56,8,6); ctx.fill();}
  if(accessory==='durag'){ctx.fillStyle=hairColor; rr(ctx,cx-28,40,56,20,10); ctx.fill(); rr(ctx,cx+18,58,12,24,6); ctx.fill();}
}

// ===== API =====
const HAIRS=['bald','afro','straight','fadeShort','cornrows'];
const FACIALS=['none','goatee','mustache','full'];
const HCOLORS=['#111111','#2b2018','#3a2f25','#4b382e','#754c24'];
const ECOLORS=['#3a2f25','#1f2d57','#0a6a4f','#5b3a2e'];
const EYESHAPES=['round','almond','sleepy'];
const MOUTHS=['neutral','smile','frown','smirk'];
const ACCESSORIES=['none','headband','beanie','durag'];

function randomDNA(seed='seed'){const r=rng(seed);return{skin:pick(r,['F1','F2','F3','F4']),hair:pick(r,HAIRS),hairColor:pick(r,HCOLORS),eyeColor:pick(r,ECOLORS),eyeShape:pick(r,EYESHAPES),mouth:pick(r,MOUTHS),facial:r()<0.5?pick(r,FACIALS):'none',accessory:pick(r,ACCESSORIES),accent:'#EA6A11'};}
function render(canvas,dna){drawHead(setup(canvas),dna);}

window.AvatarKit={render, randomDNA};
