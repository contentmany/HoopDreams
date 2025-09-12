// V2 Avatar Control Wiring - Uses AvatarKit API
export function mountCustomize(){
  const C = document.getElementById('avatarCanvas');
  if (!C) {
    console.error('Avatar canvas not found');
    return;
  }
  
  // Set generic default DNA so it's never blank
  let dna = window.AvatarKit.randomDNA('default-generic');
  dna.hairStyle = 'short'; 
  dna.eyeShape = 'almond'; 
  dna.mouth = 'smile'; 
  dna.accessory = 'none';
  
  // Render initial avatar
  window.AvatarKit.render(C, dna);
  
  const $ = (id) => document.getElementById(id);
  
  // Wire up all V2 controls
  const wireControl = (id, handler) => {
    const el = $(id);
    if (el) {
      el.onchange = handler;
      console.log(`Wired control: ${id}`);
    } else {
      console.warn(`Control not found: ${id}`);
    }
  };
  
  wireControl('skin', e => {dna.skin = e.target.value; window.AvatarKit.render(C, dna)});
  wireControl('hairStyle', e => {dna.hairStyle = e.target.value; window.AvatarKit.render(C, dna)});
  wireControl('hairColor', e => {dna.hairColor = e.target.value; window.AvatarKit.render(C, dna)});
  wireControl('eyeColor', e => {dna.eyeColor = e.target.value; window.AvatarKit.render(C, dna)});
  wireControl('eyeShape', e => {dna.eyeShape = e.target.value; window.AvatarKit.render(C, dna)});
  wireControl('brows', e => {dna.brows = e.target.value === 'true'; window.AvatarKit.render(C, dna)});
  wireControl('mouth', e => {dna.mouth = e.target.value; window.AvatarKit.render(C, dna)});
  wireControl('facial', e => {dna.facial = e.target.value; window.AvatarKit.render(C, dna)});
  wireControl('accessory', e => {dna.accessory = e.target.value; window.AvatarKit.render(C, dna)});
  
  // Randomize button
  const randomBtn = $('btnRandom');
  if (randomBtn) {
    randomBtn.onclick = () => {
      dna = window.AvatarKit.randomDNA(String(Math.random()));
      window.AvatarKit.render(C, dna);
      
      // Update all form controls to match random DNA
      const updateSelect = (id, value) => {
        const el = $(id);
        if (el) el.value = value;
      };
      
      updateSelect('skin', dna.skin);
      updateSelect('hairStyle', dna.hairStyle);
      updateSelect('hairColor', dna.hairColor);
      updateSelect('eyeColor', dna.eyeColor);
      updateSelect('eyeShape', dna.eyeShape);
      updateSelect('brows', dna.brows.toString());
      updateSelect('mouth', dna.mouth);
      updateSelect('facial', dna.facial);
      updateSelect('accessory', dna.accessory);
    };
    console.log('Wired randomize button');
  }
  
  console.log('V2 Avatar customization system initialized successfully');
}

// Updated helper functions for V2 API compatibility
export function attachImgCanvas(selector, size = 64){
  const el = document.querySelector(selector); 
  if (!el) return;
  el.width = size; 
  el.height = size; 
  el.classList.add(`avatar${size}`);
  const dna = JSON.parse(localStorage.getItem('hd_player_dna') || 'null') || window.AvatarKit.randomDNA('player');
  window.AvatarKit.render(el, dna);
}

export function npcIntoCanvas(canvas, seed, size = 40){
  canvas.width = size; 
  canvas.height = size; 
  canvas.classList.add(`avatar${size}`);
  window.AvatarKit.render(canvas, window.AvatarKit.randomDNA(seed));
}