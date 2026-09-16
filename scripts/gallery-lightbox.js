/**
 * Gallery & Lightbox Controller for Volkswagen Jetta GLI
 * Supports category filtering, keyboard navigation (Esc, Left, Right), and high-res previews
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;

  const galleryData = [
    {
      title: 'Stance Frontal Agressivo & Grade Honeycomb',
      caption: 'Volkswagen Jetta GLI no Salão de Chicago (Wikimedia Commons / CC BY-SA 4.0)',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/2022_Volkswagen_Jetta_GLI.jpg/1920px-2022_Volkswagen_Jetta_GLI.jpg'
    },
    {
      title: 'Cockpit Digital & Volante Esportivo Multifuncional',
      caption: 'Habitáculo com Active Info Display e costuras vermelhas GLI (CC BY 2.0)',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Volkswagen_Jetta_GLI_40th_Anniversary_Edition_%282024%29_%2853623916911%29.jpg/1920px-Volkswagen_Jetta_GLI_40th_Anniversary_Edition_%282024%29_%2853623916911%29.jpg'
    },
    {
      title: 'Traseira Esportiva com Saída Dupla de Escape',
      caption: 'Ponteiras cromadas reais e difusor tipo colmeia (CC BY-SA 4.0)',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/2024_Volkswagen_Jetta_GLI%2C_rear_left%2C_08-21-2026.jpg/1920px-2024_Volkswagen_Jetta_GLI%2C_rear_left%2C_08-21-2026.jpg'
    },
    {
      title: 'Faróis Full LED com Projetores & Friso Red GLI',
      caption: 'Conjunto óptico dianteiro de alta definição com Light Assist (CC BY-SA 4.0)',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/2025_Volkswagen_Jetta_VII_GLI_DSC_7774.jpg/1920px-2025_Volkswagen_Jetta_VII_GLI_DSC_7774.jpg'
    },
    {
      title: 'Silhueta Lateral Fastback & Rodas Aro 18"',
      caption: 'Design aerodinâmico refinado com entre-eixos estendido (CC BY-SA 4.0)',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/2022-2024_Volkswagen_Jetta_GLI.jpg/1920px-2022-2024_Volkswagen_Jetta_GLI.jpg'
    },
    {
      title: 'Emblemas Exclusivos & Edição Especial GLI',
      caption: 'Detalhes comemorativos no Salão Internacional de Nova York (CC BY 2.0)',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Volkswagen_Jetta_GLI_40th_Anniversary_Edition_%282024%29_%2853623030087%29.jpg/1920px-Volkswagen_Jetta_GLI_40th_Anniversary_Edition_%282024%29_%2853623030087%29.jpg'
    }
  ];

  // 1. Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button states
      filterBtns.forEach(b => {
        b.classList.remove('active-filter', 'bg-gli-red', 'text-white', 'border-gli-red');
        b.classList.add('bg-carbon-900', 'text-neutral-400', 'border-white/10');
      });
      btn.classList.add('active-filter', 'bg-gli-red', 'text-white', 'border-gli-red');
      btn.classList.remove('bg-carbon-900', 'text-neutral-400', 'border-white/10');

      // Filter gallery cards
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 2. Lightbox Open
  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryData[index];
    if (!item || !lightboxModal) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxCaption.textContent = item.caption;

    lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryData.length) % galleryData.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index') || '0', 10);
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
  }

  // Close when clicking outside image
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
  });
});
