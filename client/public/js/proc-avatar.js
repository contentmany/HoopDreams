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
  const hcDark=darken(hc,.75);
  const hcLight=darken(hc,.95);
  
  // Improved hair base function - follows head contours naturally
  const hairBase=()=>{
    ctx.fillStyle=hc;
    // Main crown area - follows head ellipse shape
    E(ctx,CX,CY-18,HEAD_RX-2,18);ctx.fill();
    // Natural temple connection points
    E(ctx,CX-HEAD_RX+4,CY-8,10,12);ctx.fill();
    E(ctx,CX+HEAD_RX-4,CY-8,10,12);ctx.fill();
    // Seamless blending with scalp
    ctx.globalAlpha=.8;
    E(ctx,CX,CY-12,HEAD_RX-4,8);ctx.fill();
    ctx.globalAlpha=1;
  };
  
  // Enhanced hairline function for natural growth patterns
  const drawHairline=(fromY,toY,density=1)=>{
    for(let i=0;i<density*15;i++){
      const angle=(i/15)*Math.PI*2;
      const x=CX+Math.cos(angle)*HEAD_RX*.9;
      const y=fromY+Math.sin(angle*2)*2;
      if(y>=fromY&&y<=toY){
        ctx.strokeStyle=hcDark;ctx.lineWidth=.8;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+rng()*3-1.5,y+3+rng()*2);ctx.stroke();
      }
    }
  };
  
  switch(d.hairStyle){
    case 'bald': 
      // Subtle hair follicles for realism
      drawHairline(CY-16,CY-10,.3);
      break;
      
    case 'buzz': 
      hairBase(); 
      ctx.globalAlpha=.4; 
      E(ctx,CX,CY-18,HEAD_RX-4,16); 
      ctx.fillStyle=hcDark; 
      ctx.fill(); 
      ctx.globalAlpha=1; 
      drawHairline(CY-20,CY-8,.6);
      break;
      
    case 'short': 
      hairBase(); 
      // Natural short hair texture
      R(ctx,CX-HEAD_RX+2,CY-22,HEAD_RX*2-4,6,3); 
      ctx.fillStyle=hc; 
      ctx.fill();
      // Add subtle texture lines
      ctx.strokeStyle=hcDark;ctx.lineWidth=.6;
      for(let i=0;i<8;i++){
        const x=CX-20+i*5;
        ctx.beginPath();ctx.moveTo(x,CY-20);ctx.lineTo(x+rng()*2-1,CY-12);ctx.stroke();
      }
      break;
      
    case 'waves': 
      hairBase(); 
      // Improved wave rendering with natural flow
      ctx.strokeStyle=hcDark; 
      ctx.lineWidth=1.2;
      for(let y=CY-24;y<CY-8;y+=3){
        const waveY=y+Math.sin((y-CY)*0.3)*1.5;
        ctx.beginPath();
        ctx.moveTo(CX-HEAD_RX+4,waveY);
        ctx.bezierCurveTo(CX-8,waveY+2,CX+8,waveY-2,CX+HEAD_RX-4,waveY+1);
        ctx.stroke();
      }
      break;
      
    case 'afro': 
      // Natural afro with better scalp connection
      ctx.fillStyle=hc; 
      const afroPoints=[];
      for(let i=0;i<28;i++){
        const angle=rng()*Math.PI*2;
        const r=18+rng()*8;
        const x=CX+Math.cos(angle)*r;
        const y=CY-12+Math.sin(angle)*r;
        afroPoints.push({x,y,size:5.5+rng()*2});
      }
      // Draw from inside out for natural layering
      afroPoints.sort((a,b)=>(a.x-CX)**2+(a.y-CY)**2-(b.x-CX)**2-(b.y-CY)**2);
      afroPoints.forEach(p=>{
        ctx.globalAlpha=.9;
        E(ctx,p.x,p.y,p.size,p.size);
        ctx.fill();
      });
      ctx.globalAlpha=1;
      // Add scalp connection
      E(ctx,CX,CY-12,HEAD_RX-6,12);ctx.fillStyle=hc;ctx.fill();
      break;
      
    case 'curls': 
      ctx.fillStyle=hc; 
      // Natural curl placement following head shape
      for(let angle=0;angle<Math.PI*2;angle+=.8){
        const baseX=CX+Math.cos(angle)*HEAD_RX*.7;
        const baseY=CY-16+Math.sin(angle)*10;
        const curlSize=4.5+rng()*1.5;
        E(ctx,baseX,baseY+Math.sin(angle*3)*2,curlSize,curlSize);
        ctx.fill();
      }
      // Temple area curls
      E(ctx,CX-HEAD_RX+6,CY-4,6,14);ctx.fill();
      E(ctx,CX+HEAD_RX-6,CY-4,6,14);ctx.fill();
      break;
      
    case 'braids': 
      // Realistic braids that follow head contours
      ctx.fillStyle=hc;
      const braidCount=5;
      for(let i=0;i<braidCount;i++){
        const startAngle=(i/(braidCount-1))*Math.PI*0.8-Math.PI*0.4;
        const startX=CX+Math.cos(startAngle+Math.PI/2)*HEAD_RX*.8;
        const startY=CY-14;
        
        // Draw braid as curved segments
        let currentX=startX;
        let currentY=startY;
        const braidLength=25;
        const segments=8;
        
        for(let seg=0;seg<segments;seg++){
          const progress=seg/segments;
          const width=4.5-progress*1.5; // Tapering
          const curve=Math.sin(progress*Math.PI*2)*3;
          
          currentY+=braidLength/segments;
          currentX+=curve+(rng()-.5)*1.5;
          
          // Braid segment with natural curves
          ctx.beginPath();
          ctx.ellipse(currentX,currentY,width/2,3,0,0,Math.PI*2);
          ctx.fill();
          
          // Braid texture
          if(seg%2===0){
            ctx.fillStyle=hcDark;
            ctx.beginPath();
            ctx.ellipse(currentX,currentY,width/3,1.5,0,0,Math.PI*2);
            ctx.fill();
            ctx.fillStyle=hc;
          }
        }
      }
      // Scalp connection for braids
      E(ctx,CX,CY-16,HEAD_RX-4,8);ctx.fill();
      break;
      
    case 'locs': 
      hairBase(); 
      ctx.fillStyle=hc; 
      const locCount=6;
      for(let i=0;i<locCount;i++){
        const startAngle=(i/(locCount-1))*Math.PI*0.7-Math.PI*0.35;
        const x=CX+Math.cos(startAngle+Math.PI/2)*HEAD_RX*.7+i*6-15;
        
        // Main loc strands
        R(ctx,x,CY-14,4.5,24,2.5); 
        ctx.fill();
        
        // Loc texture and variation
        ctx.fillStyle=hcDark;
        R(ctx,x+.5,CY-12,3.5,20,2); 
        ctx.fill();
        ctx.fillStyle=hc;
        
        // Lower hanging locs
        if(i%2===0){
          R(ctx,x-1,CY+6,4,12,2); 
          ctx.fill();
        }
      }
      break;
      
    case 'highTop': 
      ctx.fillStyle=hc; 
      // Shaped high-top with natural sides
      R(ctx,CX-HEAD_RX+2,CY-28,HEAD_RX*2-4,20,3); 
      ctx.fill();
      // Side fade effect
      ctx.fillStyle=hcDark;
      ctx.globalAlpha=.6;
      E(ctx,CX-HEAD_RX+6,CY-8,8,12);ctx.fill();
      E(ctx,CX+HEAD_RX-6,CY-8,8,12);ctx.fill();
      ctx.globalAlpha=1;
      // Top texture
      ctx.strokeStyle=hcDark;ctx.lineWidth=.8;
      for(let i=0;i<5;i++){
        const x=CX-15+i*6;
        ctx.beginPath();ctx.moveTo(x,CY-26);ctx.lineTo(x+rng()*2-1,CY-16);ctx.stroke();
      }
      break;
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