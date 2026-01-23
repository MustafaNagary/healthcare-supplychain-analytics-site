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
  html += '<div class="expanded-cta-wrap"><a href="https://calendar.app.google/YaRjgie3NBDr8Vaf8" class="expanded-cta-button" target="_blank" rel="noopener">Book a Call</a></div>';
  
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

// Healthcare supply chain station map
const routeMap = document.getElementById("routeMap");
if (routeMap) {
  const STATIONS = {
    1: {
      title: "Clinical Demand and Usage Visibility",
      offers: [
        "Track usage by department/cost center, service line, and therapy/procedure type",
        "Explain variance using patient volume, CMI/acuity, and scheduling patterns",
        "Detect shifts from physician preference changes, substitutions, and documentation gaps",
        "Align teams on what to measure and where to capture it before standardizing the catalog"
      ],
      note: "This step builds clinical buy-in early ... so standardization reflects real usage patterns instead of forcing a model that teams won’t follow."
    },
    2: {
      title: "Item Master and Catalog Standardization (Foundation)",
      offers: [
        "Identify duplicate items using match logic (description similarity, packaging, manufacturer, UoM)",
        "Fix UoM issues (each vs box vs case) to prevent false usage and inventory calculations",
        "Standardize categories and item hierarchy (med/surg, clinical, implant, pharmacy-adjacent, etc.)",
        "Define required fields, naming rules, mapping logic, and approval workflow for new items",
        "Monitor catalog health (new items, missing fields, category drift, inactive items)"
      ],
      note: "This is the station that stops the entire system from breaking later."
    },
    3: {
      title: "Sourcing and Supplier Strategy",
      offers: [
        "Vendor spend analytics by category, facility, service line, and GL alignment",
        "Price variance logic: compare contract price vs paid price vs historical price",
        "Supplier performance monitoring using lead-time stability, fill rate, backorder frequency",
        "Vendor concentration + supply risk: identify “single points of failure” for critical categories"
      ],
      note: "This is where sourcing is turned into measurable performance, not anecdotes."
    },
    4: {
      title: "Contract Control and Purchase Compliance",
      offers: [
        "Contract compliance scorecards (contract vs non-contract, compliant vendors, compliant items)",
        "Detect contract leakage patterns like: same item bought from multiple vendors; off-contract substitutions; mismatched catalog mapping causing incorrect “non-contract” flags",
        "Build an “action list” dashboard: top leakage categories; high-frequency offenders (items + departments); savings targets based on historical run-rate"
      ],
      note: "This station becomes a “savings engine” once master data is cleaned."
    },
    5: {
      title: "Procurement Flow (Req → PO → Receiving)",
      offers: [
        "Cycle time tracking across the full purchasing lifecycle: requisition approval time; PO creation time; vendor confirmation time; receiving time + put-away delays",
        "Bottleneck analytics by role/team/location (ex: approval queues, receiving backlog)",
        "Exception monitoring: partial receipts; missing invoices; price mismatches; emergency buys outside the normal workflow"
      ],
      note: "This is where “process drag” is reduced with actual data."
    },
    6: {
      title: "Inventory Control and Optimization",
      offers: [
        "Core inventory reporting: days on hand; usage velocity; ABC classification + slow-mover detection; stock distribution across storerooms and departments",
        "Root cause analysis for stockouts/overstock: PAR levels misaligned with demand; case pack issues driving over-ordering; poor UoM conversion causing distorted “on hand” values",
        "Expiration prediction: estimate “time-to-deplete” using historical consumption rate; flag items where expiry date < expected depletion date; generate “at-risk” inventory worklist",
        "Optimization recommendations: PAR recalibration; reorder point tuning; transfer suggestions between locations"
      ],
      note: "This station is considered the “control tower” and the biggest value station."
    },
    7: {
      title: "Internal Distribution and Department Replenishment",
      offers: [
        "Track internal movement: issues, transfers, case cart usage, department replenishment patterns",
        "Identify waste patterns: excessive pulling compared to patient volume; frequent transfers due to wrong stocking locations; high variance units needing standardization",
        "Support better stocking strategy: align supplies to actual usage by unit/service; reduce unnecessary movement and “hidden inventory pockets”"
      ],
      note: "This is where supply chain becomes operational performance."
    },
    8: {
      title: "Service Levels + Waste + Returns Recovery",
      offers: [
        "Service level visibility: fill rate and backorder behavior; critical item availability monitoring; vendor vs internal-driven delays",
        "Waste + expiration reporting: expired items by department/category; non-moving inventory exceeding thresholds; usage drops indicating upcoming waste risk",
        "Returns/credits analytics: returns volume trends; credit capture gaps; return eligibility tracking (time windows / vendor rules)",
        "Recovery worklists: “consume first” list; transfer-out recommendations; return candidates prioritized by value and urgency"
      ],
      note: "This station closes the loop and protects cost + availability."
    }
  };

  const card = document.getElementById("stationCard");
  const cardKicker = document.getElementById("cardKicker");
  const cardTitle = document.getElementById("cardTitle");
  const cardText = document.getElementById("cardText");
  const cardClose = document.getElementById("cardClose");

  const openCard = (stationId, clientX, clientY) => {
    const data = STATIONS[stationId];
    if (!data || !card) return;

    cardKicker.textContent = `${stationId}`;
    cardTitle.textContent = data.title;
    const offerItems = data.offers.map(item => `<li>${item}</li>`).join("");
    cardText.innerHTML = `
      <p class="station-card__intro">What Data 14 can offer:</p>
      <ul class="station-card__list">${offerItems}</ul>
      <p class="station-card__note">${data.note}</p>
    `;

    const wrap = routeMap.closest(".hero-map__wrap");
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();

    routeMap.querySelectorAll(".station.is-active").forEach(el => el.classList.remove("is-active"));
    const node = routeMap.querySelector(`.station[data-station="${stationId}"]`);
    if (node) node.classList.add("is-active");

    card.classList.add("is-open");
    card.setAttribute("aria-hidden", "false");

    const nodeRect = node?.getBoundingClientRect();
    const cardWidth = card.offsetWidth || 320;
    const cardHeight = card.offsetHeight || 160;
    const fallbackX = Math.max(12, clientX - wrapRect.left + 14);
    const fallbackY = Math.max(12, clientY - wrapRect.top + 14);

    const baseX = nodeRect ? (nodeRect.left - wrapRect.left + (nodeRect.width / 2) - (cardWidth / 2)) : fallbackX;
    const baseY = nodeRect ? (nodeRect.top - wrapRect.top + nodeRect.height + 14) : fallbackY;

    const x = Math.min(wrapRect.width - cardWidth - 12, Math.max(12, baseX));
    const y = Math.min(wrapRect.height - cardHeight - 12, Math.max(12, baseY));

    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  };

  const closeCard = () => {
    if (!card) return;
    card.classList.remove("is-open");
    card.setAttribute("aria-hidden", "true");
    routeMap.querySelectorAll(".station.is-active").forEach(el => el.classList.remove("is-active"));
  };

  routeMap.querySelectorAll(".station").forEach((node) => {
    const id = node.getAttribute("data-station");

    node.addEventListener("click", (e) => {
      openCard(id, e.clientX, e.clientY);
    });

    // Click only interaction
  });

  cardClose?.addEventListener("click", closeCard);
  document.addEventListener("click", (e) => {
    const isStation = e.target.closest && e.target.closest(".station");
    const isCard = e.target.closest && e.target.closest("#stationCard");
    if (!isStation && !isCard) closeCard();
  });
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
