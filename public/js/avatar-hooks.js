import { renderAvatar, randomDNA, dnaFromSeed } from '/js/proc-avatar.js';

export function mountCustomize(){
  const c=document.getElementById('avatarCanvas'); 
  if (!c) {
    console.error('Avatar canvas not found');
    return;
  }
  c.classList.add('avatar128');
  let dna = randomDNA('preview'); 
  renderAvatar(c, dna);
  
  const $=id=>{
    const el = document.getElementById(id);
    if (!el) console.warn(`Element with id '${id}' not found`);
    return el;
  };
  
  const skinEl = $('#skin');
  if (skinEl) skinEl.onchange = e => {dna.skin = e.target.value; renderAvatar(c, dna)};
  
  const hairEl = $('#hair');
  if (hairEl) hairEl.onchange = e => {dna.hair = e.target.value; renderAvatar(c, dna)};
  
  const hairColorEl = $('#hairColor');
  if (hairColorEl) hairColorEl.onchange = e => {dna.hairColor = e.target.value; renderAvatar(c, dna)};
  
  const eyeColorEl = $('#eyeColor');
  if (eyeColorEl) eyeColorEl.onchange = e => {dna.eyeColor = e.target.value; renderAvatar(c, dna)};
  
  const facialEl = $('#facial');
  if (facialEl) facialEl.onchange = e => {dna.facial = e.target.value; renderAvatar(c, dna)};
  
  const randomBtn = $('#btnRandom');
  if (randomBtn) randomBtn.onclick = () => {dna = randomDNA(String(Math.random())); renderAvatar(c, dna)};
  
  // save & continue button if present
  const save = document.getElementById('avatarSave');
  if (save) { 
    save.onclick = () => { 
      localStorage.setItem('hd_player_dna', JSON.stringify(dna)); 
      window.location.assign(save.dataset.next || '/builder'); 
    }
  }
}

export function attachImgCanvas(selector,size=64){
  const el=document.querySelector(selector); if(!el) return;
  el.width=size; el.height=size; el.classList.add(`avatar${size}`);
  const dna = JSON.parse(localStorage.getItem('hd_player_dna')||'null') || randomDNA('player');
  renderAvatar(el, dna);
}

export function npcIntoCanvas(canvas, seed, size=40){
  canvas.width=size; canvas.height=size; canvas.classList.add(`avatar${size}`);
  renderAvatar(canvas, dnaFromSeed(seed));
}