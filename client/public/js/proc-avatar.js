// ---------- utilities: seeded RNG for stable NPC faces ----------
function xmur3(str){for(let h=1779033703^str.length,i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}return ()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0}}
function sfc32(a,b,c,d){return function(){a|=0;b|=0;c|=0;d|=0;let t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=(c<<21|c>>>11)+t|0;return (t>>>0)/4294967296}}
function rngFromSeed(seed){const x=xmur3(seed)();return sfc32(x, x^0x9E3779B1, x^0x85EBCA77, x^0xC2B2AE3D)}
const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];

// ---------- palettes ----------
const SKIN = {F1:'#f1c9a5',F2:'#d9a06b',F3:'#a8693a',F4:'#6b3b1f'};
const SHADOW = (hex,k=0.82)=>{const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const d=v=>Math.max(0,Math.min(255,Math.round(v*k)));return `#${(d(r)<<16|d(g)<<8|d(b)).toString(16).padStart(6,'0')}`};

// ---------- low-level drawing helpers ----------
function setupCanvas(canvas, cssSize){
  const scale=Math.min(2, window.devicePixelRatio||1);
  canvas.width=cssSize*scale; canvas.height=cssSize*scale;
  canvas.style.width=cssSize+'px'; canvas.style.height=cssSize+'px';
  const ctx=canvas.getContext('2d'); ctx.imageSmoothingEnabled=true; ctx.scale(scale,scale); return ctx;
}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function el(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.closePath();}

// ---------- the avatar painter (head only) ----------
function drawHead(ctx,{skin='F3', eyeColor='#3a2f25', hair='short', hairColor='#2b2018', brows=true, facial='none', accessory='none', accent='#EA6A11'}){
  ctx.clearRect(0,0,128,128);
  ctx.fillStyle='#2a2320'; ctx.fillRect(0,0,128,128);

  const SK=SKIN[skin]||SKIN.F3, shade=SHADOW(SK,0.78);

  // neck
  el(ctx,64,99,16,11); ctx.fillStyle=SK; ctx.fill(); ctx.strokeStyle=SHADOW(SK,0.7); ctx.lineWidth=1; ctx.stroke();

  // face base
  el(ctx,64,64,30,36); ctx.fillStyle=SK; ctx.fill();

  // ears
  el(ctx,34,66,6,8); ctx.fill(); el(ctx,94,66,6,8); ctx.fill();

  // jaw shadow
  el(ctx,64,80,22,12); ctx.fillStyle=SHADOW(SK,0.92); ctx.globalAlpha=.35; ctx.fill(); ctx.globalAlpha=1;

  // eyes
  el(ctx,53,64,6.8,6.8); ctx.fillStyle='#fff'; ctx.fill();
  el(ctx,75,64,6.8,6.8); ctx.fillStyle='#fff'; ctx.fill();
  el(ctx,53,65,3.7,3.7); ctx.fillStyle=eyeColor; ctx.fill();
  el(ctx,75,65,3.7,3.7); ctx.fillStyle=eyeColor; ctx.fill();
  el(ctx,55,63.5,1.6,1.6); ctx.fillStyle='#fff'; ctx.fill();
  el(ctx,77,63.5,1.6,1.6); ctx.fillStyle='#fff'; ctx.fill();

  // brows
  if(brows){ ctx.fillStyle=hairColor; rr(ctx,43,52,18,4,2); ctx.fill(); rr(ctx,71,52,18,4,2); ctx.fill(); }

  // nose
  ctx.strokeStyle=SHADOW(SK,0.7); ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(64,68); ctx.lineTo(64,74); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(60,76); ctx.quadraticCurveTo(64,78,68,76); ctx.stroke();

  // mouth (neutral)
  ctx.strokeStyle=SHADOW(SK,0.65); ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(56,86); ctx.quadraticCurveTo(64,89,72,86); ctx.stroke();

  // facial hair
  ctx.fillStyle=hairColor;
  if(facial==='goatee'){rr(ctx,60,92,8,6,3); ctx.fill();}
  if(facial==='mustache'){rr(ctx,56,83,16,3,2); ctx.fill();}
  if(facial==='full'){
    rr(ctx,48,80,32,20,10); ctx.globalAlpha=.92; ctx.fill(); ctx.globalAlpha=1;
    ctx.globalCompositeOperation='destination-out'; rr(ctx,58,86,12,6,3); ctx.fill(); ctx.globalCompositeOperation='source-over';
  }

  // hair helpers
  function hairBase(){
    ctx.fillStyle=hairColor;
    el(ctx,64,42,30,16); ctx.fill();
    el(ctx,37,58,8,16); ctx.fill();
    el(ctx,91,58,8,16); ctx.fill();
  }

  switch(hair){
    case 'bald': break;
    case 'buzz':
      hairBase(); ctx.globalAlpha=.35; el(ctx,64,42,28,14); ctx.fillStyle='#000'; ctx.fill(); ctx.globalAlpha=1; break;
    case 'short':
      hairBase(); rr(ctx,42,40,44,8,4); ctx.fillStyle=hairColor; ctx.fill(); break;
    case 'waves':
      hairBase(); ctx.strokeStyle=SHADOW(hairColor,0.7); ctx.lineWidth=1;
      for(let y=40;y<56;y+=4){ctx.beginPath();ctx.moveTo(40,y);ctx.bezierCurveTo(54,y+2,74,y-2,88,y+2);ctx.stroke();} break;
    case 'afro':
      ctx.fillStyle=hairColor; for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2,r=22+Math.random()*4,x=64+Math.cos(a)*r,y=50+Math.sin(a)*r; el(ctx,x,y,6.5,6.5); ctx.fill();} break;
    case 'curls':
      ctx.fillStyle=hairColor; for(let x=40;x<=88;x+=8){el(ctx,x,44+((x/8)%2?2:0),5.2,5.2); ctx.fill();}
      el(ctx,37,58,7,15); ctx.fill(); el(ctx,91,58,7,15); ctx.fill(); break;
    case 'locs':
      hairBase(); ctx.fillStyle=hairColor;
      for(let i=0;i<7;i++){const x=46+i*6; rr(ctx,x,48,4,18,2); ctx.fill();}
      for(let i=0;i<6;i++){const x=50+i*6; rr(ctx,x,62,4,10,2); ctx.fill();} break;
    case 'braids':
      hairBase(); ctx.fillStyle=hairColor; for(let i=0;i<6;i++){const x=46+i*6; rr(ctx,x,50,4,18,2); ctx.fill();} break;
    case 'beanie':
      ctx.fillStyle=hairColor; rr(ctx,36,38,56,24,10); ctx.fill(); ctx.fillStyle=SHADOW(hairColor,0.6); rr(ctx,36,56,56,8,6); ctx.fill(); break;
    case 'durag':
      hairBase(); ctx.fillStyle=hairColor; rr(ctx,36,38,56,20,10); ctx.fill(); rr(ctx,84,58,10,22,5); ctx.fill(); break;
    case 'headband':
      hairBase(); ctx.fillStyle='#fff'; rr(ctx,38,46,52,10,5); ctx.fill(); ctx.fillStyle=accent; rr(ctx,38,50,52,4,3); ctx.fill(); break;
  }
}

// ---------- DNA + randomization ----------
const HAIRS=['bald','buzz','short','afro','curls','waves','braids','locs','beanie','durag','headband'];
const FACIALS=['none','goatee','mustache','full'];
const HCOLORS=['#2b2018','#3a2f25','#4b382e','#754c24','#111111'];
const ECOLORS=['#3a2f25','#1f2d57','#0a6a4f','#5b3a2e'];

export function randomDNA(seed='seed'){
  const r=rngFromSeed(seed);
  const skin = pick(r,['F1','F2','F3','F4']);
  let hair = pick(r,HAIRS);
  const facial = (r()<0.45)?pick(r,FACIALS):'none';
  const hairColor = pick(r,HCOLORS);
  const eyeColor  = pick(r,ECOLORS);
  const brows = r()<0.9;
  const accessory = (hair==='headband'||hair==='beanie'||hair==='durag') ? hair : 'none';
  const accent = '#EA6A11';
  return {skin,hair,hairColor,eyeColor,brows,facial,accessory,accent};
}

export function renderAvatar(canvas, dna){
  const ctx=setupCanvas(canvas, parseInt(getComputedStyle(canvas).width||canvas.width||128));
  drawHead(ctx,dna);
}

export function dnaFromSeed(seed){ return randomDNA(seed); }