import { renderAvatar, randomDNA, dnaFromSeed } from '/js/proc-avatar.js';

export function mountCustomize(){
  const c=document.getElementById('avatarCanvas'); 
  if (!c) {
    console.error('Avatar canvas not found');
    return;
  }
  
  try {
    c.classList.add('avatar128');
    let dna = randomDNA('preview'); 
    renderAvatar(c, dna);
    
    // Enhanced element lookup with better error handling
    const safeGetElement = (id) => {
      try {
        const el = document.getElementById(id);
        if (!el) {
          console.warn(`Element with id '${id}' not found`);
        }
        return el;
      } catch (error) {
        console.error(`Error getting element '${id}':`, error);
        return null;
      }
    };
    
    // Safe event handler attachment with null checks
    const attachHandler = (elementId, property, handler) => {
      const el = safeGetElement(elementId);
      if (el && el[property] !== undefined) {
        try {
          el[property] = handler;
          console.log(`Successfully attached ${property} handler to ${elementId}`);
        } catch (error) {
          console.error(`Error attaching ${property} handler to ${elementId}:`, error);
        }
      } else {
        console.warn(`Cannot attach ${property} handler to ${elementId} - element not found or property not supported`);
      }
    };
    
    // Attach all event handlers with safe error handling
    attachHandler('skin', 'onchange', (e) => {
      try {
        dna.skin = e.target.value; 
        renderAvatar(c, dna);
      } catch (error) {
        console.error('Error in skin change handler:', error);
      }
    });
    
    attachHandler('hair', 'onchange', (e) => {
      try {
        dna.hair = e.target.value; 
        renderAvatar(c, dna);
      } catch (error) {
        console.error('Error in hair change handler:', error);
      }
    });
    
    attachHandler('hairColor', 'onchange', (e) => {
      try {
        dna.hairColor = e.target.value; 
        renderAvatar(c, dna);
      } catch (error) {
        console.error('Error in hair color change handler:', error);
      }
    });
    
    attachHandler('eyeColor', 'onchange', (e) => {
      try {
        dna.eyeColor = e.target.value; 
        renderAvatar(c, dna);
      } catch (error) {
        console.error('Error in eye color change handler:', error);
      }
    });
    
    attachHandler('facial', 'onchange', (e) => {
      try {
        dna.facial = e.target.value; 
        renderAvatar(c, dna);
      } catch (error) {
        console.error('Error in facial hair change handler:', error);
      }
    });
    
    attachHandler('btnRandom', 'onclick', () => {
      try {
        dna = randomDNA(String(Math.random())); 
        renderAvatar(c, dna);
        
        // Update form controls to match the new random DNA
        const updateControl = (id, value) => {
          const el = safeGetElement(id);
          if (el && el.value !== undefined) {
            el.value = value;
          }
        };
        
        updateControl('skin', dna.skin);
        updateControl('hair', dna.hair);
        updateControl('hairColor', dna.hairColor);
        updateControl('eyeColor', dna.eyeColor);
        updateControl('facial', dna.facial);
      } catch (error) {
        console.error('Error in randomize handler:', error);
      }
    });
    
    // Save & continue button handler
    const saveEl = safeGetElement('avatarSave');
    if (saveEl) {
      attachHandler('avatarSave', 'onclick', () => {
        try {
          localStorage.setItem('hd_player_dna', JSON.stringify(dna));
          const nextPath = saveEl.dataset.next || '/builder';
          console.log('Saving avatar DNA and navigating to:', nextPath);
          window.location.assign(nextPath);
        } catch (error) {
          console.error('Error in save handler:', error);
        }
      });
    }
    
    console.log('Avatar customization system initialized successfully');
    
  } catch (error) {
    console.error('Error in mountCustomize:', error);
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