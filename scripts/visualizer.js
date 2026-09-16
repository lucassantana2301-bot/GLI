/**
 * Visualizer Module for Jetta GLI
 * Controls Interior Ambient Lighting simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Interior Ambient Light Simulation
  const ambientBtns = document.querySelectorAll('.ambient-btn');
  const ambientGlow = document.getElementById('ambient-glow');

  ambientBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      
      // Update glow background smoothly
      if (ambientGlow) {
        ambientGlow.style.backgroundColor = color;
        ambientGlow.style.opacity = color === '#ffffff' ? '0.12' : '0.28';
      }

      // Update button active state
      ambientBtns.forEach(b => {
        b.classList.remove('scale-110', 'ring-2', 'ring-white');
      });
      btn.classList.add('scale-110', 'ring-2', 'ring-white');
    });
  });
});
