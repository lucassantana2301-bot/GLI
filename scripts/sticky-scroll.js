/**
 * Sticky Scroll Sequence Controller for Engineering Highlights
 * Keeps the GLI image pinned while scrolling reveals dynamic technical chapters
 */

document.addEventListener('DOMContentLoaded', () => {
  const chapterCards = document.querySelectorAll('.chapter-card');
  const activeBadge = document.getElementById('active-highlight-badge');
  const telemetryTorque = document.getElementById('telemetry-torque');
  const hotspotsContainer = document.getElementById('hotspots-container');

  const chapterData = {
    '1': {
      title: 'Capítulo 1: Bloqueio Eletrônico VAQ',
      torque: '100% Eixo Dianteiro',
      hotspotX: '28%',
      hotspotY: '68%'
    },
    '2': {
      title: 'Capítulo 2: Suspensão Multi-link',
      torque: 'Traseira Independente',
      hotspotX: '78%',
      hotspotY: '70%'
    },
    '3': {
      title: 'Capítulo 3: Direção Progressiva',
      torque: '2,1 Voltas Batente',
      hotspotX: '45%',
      hotspotY: '45%'
    },
    '4': {
      title: 'Capítulo 4: Freios Ventilados 312mm',
      torque: 'Pinças Vermelhas GLI',
      hotspotX: '25%',
      hotspotY: '72%'
    }
  };

  function updateChapter(chapterNum) {
    const data = chapterData[chapterNum];
    if (!data) return;

    // Update Card Active States
    chapterCards.forEach(card => {
      if (card.getAttribute('data-chapter') === chapterNum) {
        card.classList.add('active-chapter');
        card.setAttribute('aria-current', 'true');
      } else {
        card.classList.remove('active-chapter');
        card.removeAttribute('aria-current');
      }
    });

    // Update Badge & Telemetry
    if (activeBadge) {
      activeBadge.textContent = data.title;
    }
    if (telemetryTorque) {
      telemetryTorque.textContent = data.torque;
    }

    // Update Hotspot Position smoothly
    if (hotspotsContainer) {
      hotspotsContainer.innerHTML = `
        <div class="hotspot-dot absolute w-5 h-5 rounded-full bg-gli-red animate-ping opacity-75" style="top: ${data.hotspotY}; left: ${data.hotspotX};"></div>
        <div class="hotspot-dot absolute w-5 h-5 rounded-full bg-gli-red border-2 border-white shadow-lg" style="top: ${data.hotspotY}; left: ${data.hotspotX};"></div>
      `;
    }
  }

  // Click listener on chapters
  chapterCards.forEach(card => {
    card.addEventListener('click', () => {
      const chapter = card.getAttribute('data-chapter');
      updateChapter(chapter);
    });
  });

  // IntersectionObserver for natural scroll tracking
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          const chapter = entry.target.getAttribute('data-chapter');
          updateChapter(chapter);
        }
      });
    }, {
      rootMargin: '-20% 0px -40% 0px',
      threshold: [0.4, 0.7]
    });

    chapterCards.forEach(card => observer.observe(card));
  }
});
