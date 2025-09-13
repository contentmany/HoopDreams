// V2 Avatar System - Seeded RNG utilities
function xmur3(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}return ()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0}}
function sfc32(a,b,c,d){return function(){a|=0;b|=0;c|=0;d|=0;let t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=(c<<21|c>>>11)+t|0;return (t>>>0)/4294967296}}
function rngFromSeed(seed){const x=xmur3(seed)();return sfc32(x,x^0x9E3779B1,x^0x85EBCA77,x^0xC2B2AE3D)}
const pick=(r,a)=>a[Math.floor(r()*a.length)];

const SKIN={F1:'#f1c9a5',F2:'#d9a06b',F3:'#a8693a',F4:'#6b3b1f'};
const darken=(hex,k=.82)=>{const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const d=v=>Math.round(v*k);return `#${(d(r)<<16|d(g)<<8|d(b)).toString(16).padStart(6,'0')}`};

function setup(canvas,px){const deviceScale=Math.min(2,window.devicePixelRatio||1);const targetScale=px/128; // Scale from logical 128-unit space to target size
canvas.width=px*deviceScale;canvas.height=px*deviceScale;canvas.style.width=px+'px';canvas.style.height=px+'px';const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.scale(deviceScale*targetScale,deviceScale*targetScale);return ctx}
function E(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.closePath()}
function R(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}

function drawFace(ctx,d){
  // Clear entire canvas and fill background in logical 128-unit space
  ctx.clearRect(0,0,128,128);
  ctx.fillStyle='#2a2320'; ctx.fillRect(0,0,128,128); // padded bg

  // Create deterministic RNG from DNA for consistent rendering
  const rng = rngFromSeed(JSON.stringify(d));

  // geometry anchors (keeps everything attached)
  const CX=64, CY=66, HEAD_RX=30, HEAD_RY=36, PADY=6; // PADY lowers everything a touch so hair never crops

  // neck
  E(ctx,CX,98,16,11); ctx.fillStyle=SKIN[d.skin]; ctx.fill(); ctx.strokeStyle=darken(SKIN[d.skin],.78); ctx.lineWidth=1; ctx.stroke();

  // head
  E(ctx,CX,CY,HEAD_RX,HEAD_RY); ctx.fillStyle=SKIN[d.skin]; ctx.fill();
  // ears
  E(ctx,CX-HEAD_RX+6,CY+2,6,8); ctx.fill();
  E(ctx,CX+HEAD_RX-6,CY+2,6,8); ctx.fill();

  // jaw shadow
  E(ctx,CX,CY+16,22,12); ctx.fillStyle=darken(SKIN[d.skin],.92); ctx.globalAlpha=.35; ctx.fill(); ctx.globalAlpha=1;

  // eyes (4 shapes)
  const eyeFill=d.eyeColor, whites='#fff';
  const eye = (x,y,s,shape)=>{
    ctx.fillStyle=whites;
    if(shape==='round'){E(ctx,x,y,7,7);ctx.fill()}
    if(shape==='almond'){R(ctx,x-7,y-4,14,8,4);ctx.fill()}
    if(shape==='droopy'){R(ctx,x-7,y-3,14,8,4);ctx.fill();ctx.fillStyle='#2a2320';R(ctx,x-7,y+1,14,3,2);ctx.fill();ctx.fillStyle=whites}
    if(shape==='sharp'){ctx.beginPath();ctx.moveTo(x-7,y);ctx.quadraticCurveTo(x,y-5,x+7,y);ctx.quadraticCurveTo(x,y+5,x-7,y);ctx.closePath();ctx.fill()}
    // iris + highlight
    E(ctx,x,y+1,3.8,3.8); ctx.fillStyle=eyeFill; ctx.fill();
    E(ctx,x+2.1,y-1.3,1.6,1.6); ctx.fillStyle='#fff'; ctx.fill();
  };
  eye(CX-11,CY,1,d.eyeShape); eye(CX+11,CY,1,d.eyeShape);

  // brows
  if(d.brows){
    ctx.fillStyle=d.hairColor;
    R(ctx,CX-22,CY-12,18,4,2); ctx.fill();
    R(ctx,CX+4,CY-12,18,4,2); ctx.fill();
  }

  // nose
  ctx.strokeStyle=darken(SKIN[d.skin],.7); ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.moveTo(CX, CY+3); ctx.lineTo(CX, CY+10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX-4, CY+12); ctx.quadraticCurveTo(CX, CY+14, CX+4, CY+12); ctx.stroke();

  // mouth (5 shapes)
  ctx.strokeStyle=darken(SKIN[d.skin],.65);
  ctx.lineWidth=1.8;
  if(d.mouth==='neutral'){ctx.beginPath();ctx.moveTo(CX-8,CY+22);ctx.quadraticCurveTo(CX,CY+24,CX+8,CY+22);ctx.stroke()}
  if(d.mouth==='smile'){ctx.beginPath();ctx.moveTo(CX-10,CY+22);ctx.quadraticCurveTo(CX,CY+28,CX+10,CY+22);ctx.stroke()}
  if(d.mouth==='grin'){ctx.beginPath();ctx.moveTo(CX-10,CY+21);ctx.quadraticCurveTo(CX,CY+29,CX+10,CY+21);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CX-6,CY+23);ctx.lineTo(CX+6,CY+23);ctx.stroke()}
  if(d.mouth==='smirk'){ctx.beginPath();ctx.moveTo(CX-8,CY+22);ctx.quadraticCurveTo(CX+1,CY+24,CX+10,CY+20);ctx.stroke()}
  if(d.mouth==='frown'){ctx.beginPath();ctx.moveTo(CX-8,CY+24);ctx.quadraticCurveTo(CX,CY+20,CX+8,CY+24);ctx.stroke()}

  // facial hair (5)
  ctx.fillStyle=d.hairColor;
  if(d.facial==='goatee'){R(ctx,CX-6,CY+27,12,8,4);ctx.fill()}
  if(d.facial==='mustache'){R(ctx,CX-8,CY+18,16,4,2);ctx.fill()}
  if(d.facial==='chinstrap'){R(ctx,CX-18,CY+30,36,8,6);ctx.globalAlpha=.92;ctx.fill();ctx.globalAlpha=1}
  if(d.facial==='full'){R(ctx,CX-20,CY+18,40,20,10);ctx.globalAlpha=.92;ctx.fill();ctx.globalAlpha=1;ctx.globalCompositeOperation='destination-out';R(ctx,CX-10,CY+22,20,8,4);ctx.fill();ctx.globalCompositeOperation='source-over'}

  // hair (anchored by same CX/CY; never floats)
  const hc=d.hairColor;
  const hairBase=()=>{ctx.fillStyle=hc;E(ctx,CX,CY-22,29,15);ctx.fill();E(ctx,CX-26,CY-2,8,16);ctx.fill();E(ctx,CX+26,CY-2,8,16);ctx.fill()};
  switch(d.hairStyle){
    case 'bald': break;
    case 'buzz': hairBase(); ctx.globalAlpha=.35; E(ctx,CX,CY-22,27,13); ctx.fillStyle='#000'; ctx.fill(); ctx.globalAlpha=1; break;
    case 'short': hairBase(); R(ctx,CX-22,CY-24,44,8,4); ctx.fillStyle=hc; ctx.fill(); break;
    case 'waves': hairBase(); ctx.strokeStyle=darken(hc,.7); ctx.lineWidth=1; for(let y=CY-24;y<CY-6;y+=4){ctx.beginPath();ctx.moveTo(CX-24,y);ctx.bezierCurveTo(CX-8,y+2,CX+8,y-2,CX+24,y+2);ctx.stroke()} break;
    case 'afro': ctx.fillStyle=hc; for(let i=0;i<26;i++){const a=rng()*Math.PI*2,r=22+rng()*4;const x=CX+Math.cos(a)*r,y=CY-16+Math.sin(a)*r;E(ctx,x,y,6.5,6.5);ctx.fill()} break;
    case 'curls': ctx.fillStyle=hc; for(let x=CX-24;x<=CX+24;x+=8){E(ctx,x,CY-22+((x/8)%2?2:0),5.2,5.2);ctx.fill()} E(ctx,CX-26,CY-2,7,15);ctx.fill();E(ctx,CX+26,CY-2,7,15);ctx.fill(); break;
    case 'braids': hairBase(); ctx.fillStyle=hc; for(let i=0;i<6;i++){const x=CX-18+i*6; R(ctx,x,CY-14,4,22,2); ctx.fill()} break;
    case 'locs': hairBase(); ctx.fillStyle=hc; for(let i=0;i<7;i++){const x=CX-18+i*6; R(ctx,x,CY-12,5,26,3); ctx.fill()} for(let i=0;i<6;i++){const x=CX-15+i*6; R(ctx,x,CY+8,5,10,2); ctx.fill()} break;
    case 'highTop': ctx.fillStyle=hc; R(ctx,CX-22,CY-30,44,22,4); ctx.fill(); break;
  }

  // accessories (separate from hair)
  if(d.accessory==='headband'){ctx.fillStyle='#fff'; R(ctx,CX-26,CY-18,52,10,6); ctx.fill(); ctx.fillStyle='#EA6A11'; R(ctx,CX-26,CY-15,52,4,3); ctx.fill()}
  if(d.accessory==='beanie'){ctx.fillStyle=hc; R(ctx,CX-28,CY-28,56,22,10); ctx.fill(); ctx.fillStyle=darken(hc,.6); R(ctx,CX-28,CY-10,56,8,6); ctx.fill()}
  if(d.accessory==='durag'){ctx.fillStyle=hc; R(ctx,CX-28,CY-26,56,18,10); ctx.fill(); R(ctx,CX+14,CY-6,12,26,6); ctx.fill()}
}

const HAIRSTYLES=['bald','buzz','short','afro','curls','waves','braids','locs','highTop'];
const FACIALS=['none','goatee','mustache','chinstrap','full'];
const HCOLORS=['#2b2018','#3a2f25','#4b382e','#754c24','#111111'];
const ECOLORS=['#3a2f25','#1f2d57','#0a6a4f','#5b3a2e'];
const EYESHAPES=['round','almond','droopy','sharp'];
const ACCESSORIES=['none','headband','beanie','durag'];

function randomDNA(seed='seed'){const r=rngFromSeed(seed);return{
  skin: pick(r,['F1','F2','F3','F4']),
  hairStyle: pick(r,HAIRSTYLES),
  hairColor: pick(r,HCOLORS),
  eyeColor: pick(r,ECOLORS),
  eyeShape: pick(r,EYESHAPES),
  brows: r()<0.9,
  mouth: pick(r,['neutral','smile','grin','smirk','frown']),
  facial: r()<0.5?pick(r,FACIALS):'none',
  accessory: r()<0.35?pick(r,ACCESSORIES):'none'
}}

function render(canvas,dna){const ctx=setup(canvas,parseInt(getComputedStyle(canvas).width));drawFace(ctx,dna)}

// Export functions for module imports
export function renderAvatar(canvas, dna) { return render(canvas, dna); }
export function dnaFromSeed(seed) { return randomDNA(seed); }

// Global API for window usage
window.AvatarKit={render,randomDNA};