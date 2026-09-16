/**
 * Main Application Logic for Volkswagen Jetta GLI
 * Navigation, GSAP Scroll Interactions, Drive Modes, Launch Control & Audio Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll visual transformation
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('bg-carbon-950/95', 'shadow-2xl', 'border-white/10');
      header?.classList.remove('bg-carbon-950/60', 'border-white/5');
    } else {
      header?.classList.remove('bg-carbon-950/95', 'shadow-2xl', 'border-white/10');
      header?.classList.add('bg-carbon-950/60', 'border-white/5');
    }
  });

  // 2. Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    const isOpen = !mobileDrawer?.classList.contains('hidden');
    if (isOpen) {
      mobileDrawer?.classList.add('hidden');
      menuIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
      mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    } else {
      mobileDrawer?.classList.remove('hidden');
      menuIcon?.classList.add('hidden');
      closeIcon?.classList.remove('hidden');
      mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.add('hidden');
      menuIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
      mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // 3. Audio Engine Toggles & Launch Control Trigger
  const btnToggleEngine = document.getElementById('btn-toggle-engine');
  const btnLaunchControl = document.getElementById('btn-launch-control');

  if (btnToggleEngine) {
    btnToggleEngine.addEventListener('click', () => {
      if (window.gliAudio) {
        window.gliAudio.toggle();
      }
    });
  }

  if (btnLaunchControl) {
    btnLaunchControl.addEventListener('click', () => {
      if (window.gliAudio) {
        btnLaunchControl.classList.add('scale-95', 'border-gli-red');
        const originalText = btnLaunchControl.innerHTML;
        btnLaunchControl.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gli-red" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Acelerando 0-100 km/h...</span>
        `;

        window.gliAudio.launchControlRun();

        setTimeout(() => {
          btnLaunchControl.innerHTML = originalText;
          btnLaunchControl.classList.remove('scale-95', 'border-gli-red');
        }, 6500);
      }
    });
  }

  // 4. Drive Modes Configuration
  const modeBtns = document.querySelectorAll('.mode-btn');
  const modeThrottle = document.getElementById('mode-throttle');
  const modeShifts = document.getElementById('mode-shifts');
  const modeSteering = document.getElementById('mode-steering');
  const modeSound = document.getElementById('mode-sound');

  const modeSpecs = {
    eco: {
      throttle: 'Suave / Otimizada para Consumo',
      shifts: 'Trocas Precoces (~1.600 rpm)',
      steering: 'Leve / Conforto Urbano',
      sound: 'Atenuado / Silencioso'
    },
    comfort: {
      throttle: 'Linear e Progressiva',
      shifts: 'Modo D Padrão (~2.200 rpm)',
      steering: 'Assistência Balanceada',
      sound: 'Equilibrado'
    },
    sport: {
      throttle: 'Ultra Instantânea',
      shifts: 'Rotações Elevadas (S)',
      steering: 'Firme & Precisa',
      sound: 'Ativo com Pops & Bangs'
    },
    individual: {
      throttle: 'Customizável pelo Piloto',
      shifts: 'DSG Manual por Paddle Shift',
      steering: 'Modo Sport Personalizado',
      sound: 'Configuração Esportiva'
    }
  };

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode') || 'sport';
      const data = modeSpecs[mode];
      if (!data) return;

      // Update button styling
      modeBtns.forEach(b => {
        b.classList.remove('bg-gli-red', 'text-white', 'border-gli-red', 'shadow-lg', 'shadow-gli-red/30');
        b.classList.add('bg-carbon-900', 'text-neutral-400', 'border-white/5');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('bg-gli-red', 'text-white', 'border-gli-red', 'shadow-lg', 'shadow-gli-red/30');
      btn.classList.remove('bg-carbon-900', 'text-neutral-400', 'border-white/5');
      btn.setAttribute('aria-selected', 'true');

      // Update spec descriptions
      if (modeThrottle) modeThrottle.textContent = data.throttle;
      if (modeShifts) modeShifts.textContent = data.shifts;
      if (modeSteering) modeSteering.textContent = data.steering;
      if (modeSound) modeSound.textContent = data.sound;
    });
  });

  // 5. GSAP ScrollTrigger Animations (respects prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in stat cards on load
    gsap.from('.stat-card', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.2
    });

    // Reveal elements as they enter viewport
    gsap.utils.toArray('.feature-item, .spec-card, .gallery-item').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: 'power3.out'
      });
    });
  }
});
