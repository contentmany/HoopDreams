import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface AvatarCustomizeNewProps {
  onNavigate?: (path: string) => void;
}

export default function AvatarCustomizeNew({ onNavigate }: AvatarCustomizeNewProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onNavigate?.('/new');
                  setLocation('/new');
                }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Customize Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <style>{`
  .avatar-wrap{display:flex;flex-direction:column;gap:.75rem;max-width:360px}
  #avatarCanvas{width:128px;height:128px;background:#2a2320;border-radius:12px}
  .avatar64{width:64px;height:64px}
  .avatar40{width:40px;height:40px}
  .controls{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
  .controls label{display:flex;flex-direction:column;font-size:.9rem;gap:.25rem}
  .controls select,.controls button{background:#1f1a17;color:#fff;border:1px solid #3a2f2a;border-radius:8px;padding:.35rem .5rem}
            `}</style>

            <div className="avatar-wrap">
              <canvas id="avatarCanvas" width={128} height={128} aria-label="avatar preview"></canvas>
              <div className="controls">
                <label>Skin
                  <select id="skinSel">
                    <option value="F1">F1 – light</option>
                    <option value="F2" selected>F2 – tan</option>
                    <option value="F3">F3 – brown</option>
                    <option value="F4">F4 – deep</option>
                  </select>
                </label>

                <label>Hair
                  <select id="hairSel">
                    <option value="bald">bald</option>
                    <option value="afro">afro</option>
                    <option value="straight">straight (side part)</option>
                    <option value="fadeShort" selected>short fade</option>
                    <option value="cornrows">cornrows</option>
                  </select>
                </label>

                <label>Hair Color
                  <select id="hairColorSel">
                    <option value="#111111" selected>Black</option>
                    <option value="#2b2018">Very Dark Brown</option>
                    <option value="#3a2f25">Dark Brown</option>
                    <option value="#4b382e">Brown</option>
                    <option value="#754c24">Chestnut</option>
                  </select>
                </label>

                <label>Eye Color
                  <select id="eyeColorSel">
                    <option value="#3a2f25" selected>Brown</option>
                    <option value="#1f2d57">Dark Blue</option>
                    <option value="#0a6a4f">Green</option>
                    <option value="#5b3a2e">Hazel</option>
                  </select>
                </label>

                <label>Eye Shape
                  <select id="eyeShapeSel">
                    <option value="round" selected>round</option>
                    <option value="almond">almond</option>
                    <option value="sleepy">sleepy</option>
                  </select>
                </label>

                <label>Mouth
                  <select id="mouthSel">
                    <option value="neutral" selected>neutral</option>
                    <option value="smile">smile</option>
                    <option value="frown">frown</option>
                    <option value="smirk">smirk</option>
                  </select>
                </label>

                <label>Facial Hair
                  <select id="facialSel">
                    <option value="none" selected>none</option>
                    <option value="goatee">goatee</option>
                    <option value="mustache">mustache</option>
                    <option value="full">full beard</option>
                  </select>
                </label>

                <label>Accessory
                  <select id="accSel">
                    <option value="none" selected>none</option>
                    <option value="headband">headband</option>
                    <option value="beanie">beanie</option>
                    <option value="durag">durag</option>
                  </select>
                </label>

                <button id="btnRandom">Randomize</button>
              </div>
            </div>

            <script type="module">{`
function xmur3(str){for(let h=1779033703^str.length,i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0}}
function sfc32(a,b,c,d){return function(){a|=0;b|=0;c|=0;d|=0;let t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=(c<<21|c>>>11)+t|0;return (t>>>0)/4294967296}}
function rng(seed){const x=xmur3(seed)();return sfc32(x,x^0x9E3779B1,x^0x85EBCA77,x^0xC2B2AE3D)}
const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];

const SKIN={F1:'#f1c9a5',F2:'#d9a06b',F3:'#a8693a',F4:'#6b3b1f'};
const darken=(hex,k=0.82)=>{const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const d=v=>Math.max(0,Math.min(255,Math.round(v*k)));return '#'+(d(r)<<16|d(g)<<8|d(b)).toString(16).padStart(6,'0')};

function setup(canvas){
  const css=parseInt(getComputedStyle(canvas).width);
  const scale=Math.min(2,window.devicePixelRatio||1);
  canvas.width=css*scale; canvas.height=css*scale;
  const ctx=canvas.getContext('2d'); ctx.setTransform(scale,0,0,scale,0,0);
  ctx.imageSmoothingEnabled=true; return ctx;
}
const E=(ctx,x,y,rx,ry)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.closePath()};
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}

function drawHead(ctx, dna){
  const {skin='F2', eyeColor='#3a2f25', eyeShape='round', mouth='neutral',
         hair='fadeShort', hairColor='#111111',
         facial='none', accessory='none', accent='#EA6A11'} = dna;

  ctx.clearRect(0,0,128,128); ctx.fillStyle='#2a2320'; ctx.fillRect(0,0,128,128);
  const SK=SKIN[skin]||SKIN.F2, SKd=darken(SK,0.78), cx=64;

  E(ctx,cx,100,16,11); ctx.fillStyle=SK; ctx.fill(); ctx.strokeStyle=SKd; ctx.stroke();
  E(ctx,cx,66,30,36); ctx.fillStyle=SK; ctx.fill();
  E(ctx,34,66,6,8); ctx.fill(); E(ctx,94,66,6,8); ctx.fill();
  ctx.globalAlpha=.35; E(ctx,cx,82,22,12); ctx.fillStyle=darken(SK,0.9); ctx.fill(); ctx.globalAlpha=1;

  const eye=(x,y)=>{
    ctx.fillStyle='#fff'; E(ctx,x,y,6.4,6.4); ctx.fill();
    ctx.fillStyle=eyeColor;
    if(eyeShape==='round'){E(ctx,x,y+1.2,3.5,3.5); ctx.fill()}
    if(eyeShape==='almond'){rr(ctx,x-3.8,y-2.2,7.6,4.4,2.2); ctx.fill()}
    if(eyeShape==='sleepy'){rr(ctx,x-4.6,y-1.2,9.2,3.2,1.6); ctx.fill()}
    ctx.fillStyle='#fff'; E(ctx,x+2,y-1.6,1.3,1.3); ctx.fill();
  };
  eye(52,64); eye(76,64);

  ctx.fillStyle=hairColor; rr(ctx,42,52,18,4,2); ctx.fill(); rr(ctx,68,52,18,4,2); ctx.fill();

  ctx.strokeStyle=darken(SK,0.7); ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(cx,68); ctx.lineTo(cx,74); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-4,76); ctx.quadraticCurveTo(cx,78,cx+4,76); ctx.stroke();
  ctx.strokeStyle=darken(SK,0.65); ctx.lineWidth=1.8; ctx.beginPath();
  if(mouth==='neutral'){ctx.moveTo(cx-8,86); ctx.quadraticCurveTo(cx,89,cx+8,86)}
  if(mouth==='smile'){ctx.moveTo(cx-9,86); ctx.quadraticCurveTo(cx,92,cx+9,86)}
  if(mouth==='frown'){ctx.moveTo(cx-9,88); ctx.quadraticCurveTo(cx,82,cx+9,88)}
  if(mouth==='smirk'){ctx.moveTo(cx-6,87); ctx.quadraticCurveTo(cx+2,89,cx+10,85)}
  ctx.stroke();

  ctx.fillStyle=hairColor; ctx.globalAlpha=.95;
  if(facial==='goatee'){rr(ctx,cx-6,92,12,6,3); ctx.fill()}
  if(facial==='mustache'){rr(ctx,cx-10,83,20,3,2); ctx.fill()}
  if(facial==='full'){rr(ctx,cx-16,80,32,20,10); ctx.fill(); ctx.globalCompositeOperation='destination-out'; rr(ctx,cx-8,86,16,6,3); ctx.fill(); ctx.globalCompositeOperation='source-over'}
  ctx.globalAlpha=1;

  const hairBase=()=>{ctx.fillStyle=hairColor; E(ctx,cx,44,30,16); ctx.fill(); E(ctx,38,60,8,16); ctx.fill(); E(ctx,90,60,8,16); ctx.fill()};

  switch(hair){
    case 'bald': break;
    case 'fadeShort': hairBase(); ctx.globalAlpha=.25; E(ctx,cx,44,26,13); ctx.fillStyle='#000'; ctx.fill(); ctx.globalAlpha=1; rr(ctx,cx-22,40,44,8,4); ctx.fillStyle=hairColor; ctx.fill(); break;
    case 'straight': ctx.fillStyle=hairColor; rr(ctx,cx-30,36,58,18,12); ctx.fill(); rr(ctx,cx-12,38,36,12,10); ctx.fill(); ctx.fillStyle=darken(hairColor,0.6); rr(ctx,cx-2,38,3,16,1.5); ctx.fill(); rr(ctx,cx-30,54,8,18,4); ctx.fill(); rr(ctx,cx+22,54,8,18,4); ctx.fill(); break;
    case 'afro': ctx.fillStyle=hairColor; for(let i=0;i<28;i++){const a=i/28*6.283, r=22+Math.sin(i*1.7)*3; const x=cx+Math.cos(a)*r, y=50+Math.sin(a)*r; E(ctx,x,y,6.2,6.2); ctx.fill()} break;
    case 'cornrows': hairBase(); ctx.strokeStyle=darken(hairColor,0.65); ctx.lineWidth=2; for(let i=-18;i<=18;i+=4){ctx.beginPath(); ctx.moveTo(cx+i,44); ctx.bezierCurveTo(cx+i-6,52,cx+i-6,60,cx+i,68); ctx.stroke();} break;
  }

  if(accessory==='headband'){ctx.fillStyle='#fff'; rr(ctx,cx-26,46,52,10,6); ctx.fill(); ctx.fillStyle=accent; rr(ctx,cx-26,50,52,4,3); ctx.fill()}
  if(accessory==='beanie'){ctx.fillStyle=hairColor; rr(ctx,cx-28,38,56,24,12); ctx.fill(); ctx.fillStyle=darken(hairColor,0.6); rr(ctx,cx-28,56,56,8,6); ctx.fill()}
  if(accessory==='durag'){ctx.fillStyle=hairColor; rr(ctx,cx-28,40,56,20,10); ctx.fill(); rr(ctx,cx+18,58,12,24,6); ctx.fill()}
}

const HAIRS=['bald','afro','straight','fadeShort','cornrows'];
const FACIALS=['none','goatee','mustache','full'];
const HCOLORS=['#111111','#2b2018','#3a2f25','#4b382e','#754c24'];
const ECOLORS=['#3a2f25','#1f2d57','#0a6a4f','#5b3a2e'];
const EYESHAPES=['round','almond','sleepy'];
const MOUTHS=['neutral','smile','frown','smirk'];
const ACCESSORIES=['none','headband','beanie','durag'];

function randomDNA(seed='seed'){const r=rng(seed);return{skin:pick(r,['F1','F2','F3','F4']),hair:pick(r,HAIRS),hairColor:pick(r,HCOLORS),eyeColor:pick(r,ECOLORS),eyeShape:pick(r,EYESHAPES),mouth:pick(r,MOUTHS),facial:r()<0.5?pick(r,FACIALS):'none',accessory:pick(r,ACCESSORIES),accent:'#EA6A11'}}
function render(canvas,dna){drawHead(setup(canvas), dna)}
window.AvatarKit={render, randomDNA};

const canvas=document.getElementById('avatarCanvas');
let dna = JSON.parse(localStorage.getItem('hd:playerDNA')||'null') || randomDNA('preview'); const $=id=>document.getElementById(id);
const sync=()=>{AvatarKit.render(canvas, dna); localStorage.setItem('hd:playerDNA', JSON.stringify(dna));};
['skinSel','hairSel','hairColorSel','eyeColorSel','eyeShapeSel','mouthSel','facialSel','accSel'].forEach(id=>{
  const el=$(id); if(!el) return; const map={skinSel:'skin',hairSel:'hair',hairColorSel:'hairColor',eyeColorSel:'eyeColor',eyeShapeSel:'eyeShape',mouthSel:'mouth',facialSel:'facial',accSel:'accessory'};
  el.addEventListener('change',e=>{dna[map[id]]=e.target.value; sync()});
});
document.getElementById('btnRandom').addEventListener('click',()=>{dna=randomDNA(String(Math.random())); $('#skinSel').value=dna.skin; $('#hairSel').value=dna.hair; $('#hairColorSel').value=dna.hairColor; $('#eyeColorSel').value=dna.eyeColor; $('#eyeShapeSel').value=dna.eyeShape; $('#mouthSel').value=dna.mouth; $('#facialSel').value=dna.facial; $('#accSel').value=dna.accessory; sync()});
sync();
            `}</script>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              onNavigate?.('/new');
              setLocation('/new');
            }}
            data-testid="button-back"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
