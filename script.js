// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Detailed content for expanded modals
const detailedContent = {
  'pbi-track': [
    {
      title: 'Decision-Ready Power BI Report',
      description: 'A custom report designed around the questions leadership actually needs answered — clear, focused, and easy to use.'
    },
    {
      title: 'Scalable Data Model + Measures',
      description: 'Clean relationships and well-structured measures for reliable automation and long-term flexibility.'
    },
    {
      title: 'Reusable Visual System',
      description: 'A professional theme and layout you can reuse across future dashboards to keep reporting consistent.'
    },
    {
      title: 'Documentation + Handover Pack',
      description: 'A simple guide with KPI definitions, refresh instructions, and maintenance notes so your team can support it confidently.'
    },
    {
      title: '60-Day Fix Guarantee',
      description: 'Small fixes and refinements included for 60 days after delivery — so everything runs exactly as expected.'
    },
    {
      title: 'Complete Ownership',
      description: 'You receive the PBIX file(s), model logic, and assets. No lock-in, no subscription dependency.'
    }
  ]
};

function openModal(detailsKey) {
  const modal = document.getElementById('expandedModal');
  const modalBody = document.getElementById('modalBody');
  const content = detailedContent[detailsKey] || [];
  
  let html = '';
  content.forEach(item => {
    html += `<h3>${item.title}</h3><p>${item.description}</p>`;
  });
  html += '<div class="expanded-cta-wrap"><a href="#" class="expanded-cta-button">Book a Call</a></div>';
  
  modalBody.innerHTML = html;
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('expandedModal').style.display = 'none';
}

// Delivered slider behavior
const deliveredTrack = document.getElementById('deliveredTrack');
if (deliveredTrack) {
  const deliveredCards = Array.from(deliveredTrack.querySelectorAll('.delivered-card'));
  const leftArrow = document.querySelector('.delivered-arrow-left');
  const rightArrow = document.querySelector('.delivered-arrow-right');
  let currentIndex = Math.floor(deliveredCards.length / 2);

  const updateDeliveredState = () => {
    deliveredCards.forEach((card, index) => {
      const isActive = index === currentIndex;
      const isSide = index === currentIndex - 1 || index === currentIndex + 1;
      card.classList.toggle('is-active', isActive);
      card.classList.toggle('is-side', isSide);
      card.classList.toggle('is-hidden', !isActive && !isSide);
    });
  };

  const centerCard = (index) => {
    if (index < 0) index = deliveredCards.length - 1;
    if (index >= deliveredCards.length) index = 0;
    currentIndex = index;
    const slider = document.getElementById('deliveredSlider');
    const card = deliveredCards[currentIndex];
    if (!slider || !card) return;
    const gap = parseFloat(getComputedStyle(deliveredTrack).gap) || 0;
    const cardWidth = card.offsetWidth;
    const total = cardWidth + gap;
    const sliderWidth = slider.clientWidth;
    const trackStyles = getComputedStyle(deliveredTrack);
    const trackPaddingLeft = parseFloat(trackStyles.paddingLeft) || 0;
    const offsetToCard = trackPaddingLeft + (currentIndex * total);
    const centerOffset = (sliderWidth - cardWidth) / 2;
    const translateX = centerOffset - offsetToCard;
    deliveredTrack.style.transform = `translateX(${translateX}px)`;
    updateDeliveredState();
  };

  deliveredCards.forEach((card, index) => {
    card.addEventListener('click', () => centerCard(index));
  });

  if (leftArrow) {
    leftArrow.addEventListener('click', () => centerCard(currentIndex - 1));
  }
  if (rightArrow) {
    rightArrow.addEventListener('click', () => centerCard(currentIndex + 1));
  }

  window.addEventListener('resize', () => centerCard(currentIndex));
  centerCard(currentIndex);
}

// Modal triggers
document.querySelectorAll('.modal-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const detailsKey = trigger.getAttribute('data-details');
    if (detailsKey) {
      openModal(detailsKey);
    }
  });
});

// Close modal when clicking overlay
document.getElementById('expandedModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'expandedModal') {
    closeModal();
  }
});

// Segmented toggle (Business / Individuals)
const segBtns = document.querySelectorAll(".seg-btn");
const panels = document.querySelectorAll(".seg-panel");

segBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.seg;

    segBtns.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    panels.forEach(p => {
      p.classList.toggle("show", p.dataset.panel === target);
    });
  });
});

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileNav.style.display === "block";
    mobileNav.style.display = isOpen ? "none" : "block";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.style.display = "none";
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Fake form submit (we'll connect to a real endpoint later)
function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  if (status) status.textContent = "✅ Message captured locally. Next step: connect a real form endpoint.";
  e.target.reset();
  return false;
}
