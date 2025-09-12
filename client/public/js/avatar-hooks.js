import { renderAvatar, randomDNA, dnaFromSeed } from '/js/proc-avatar.js';

export function mountCustomize(){
  const c=document.getElementById('avatarCanvas'); c.classList.add('avatar128');
  let dna = randomDNA('preview'); renderAvatar(c, dna);
  const $=id=>document.getElementById(id);
  $('#skin').onchange=e=>{dna.skin=e.target.value; renderAvatar(c,dna)}
  $('#hair').onchange=e=>{dna.hair=e.target.value; renderAvatar(c,dna)}
  $('#hairColor').onchange=e=>{dna.hairColor=e.target.value; renderAvatar(c,dna)}
  $('#eyeColor').onchange=e=>{dna.eyeColor=e.target.value; renderAvatar(c,dna)}
  $('#facial').onchange=e=>{dna.facial=e.target.value; renderAvatar(c,dna)}
  $('#btnRandom').onclick=()=>{dna = randomDNA(String(Math.random())); renderAvatar(c,dna)}
  // save & continue button if present
  const save=document.getElementById('avatarSave');
  if(save){ save.onclick=()=>{ localStorage.setItem('hd_player_dna', JSON.stringify(dna)); window.location.assign(save.dataset.next||'/builder'); } }
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