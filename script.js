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

const setupStationMap = ({ mapId, stations, cardId, kickerId, titleId, textId, closeId }) => {
  const mapEl = document.getElementById(mapId);
  if (!mapEl) return;

  const card = document.getElementById(cardId);
  const cardKicker = document.getElementById(kickerId);
  const cardTitle = document.getElementById(titleId);
  const cardText = document.getElementById(textId);
  const cardClose = document.getElementById(closeId);

  const openCard = (stationId, clientX, clientY) => {
    const data = stations[stationId];
    if (!data || !card) return;

    cardKicker.textContent = `${stationId}`;
    cardTitle.textContent = data.title;
    const offerItems = data.offers.map(item => `<li>${item}</li>`).join("");
    cardText.innerHTML = `
      <p class="station-card__intro">What Data 14 can offer:</p>
      <ul class="station-card__list">${offerItems}</ul>
      <p class="station-card__note">${data.note}</p>
    `;

    const wrap = mapEl.closest(".hero-map__wrap");
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();

    mapEl.querySelectorAll(".station.is-active").forEach(el => el.classList.remove("is-active"));
    const node = mapEl.querySelector(`.station[data-station="${stationId}"]`);
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
    mapEl.querySelectorAll(".station.is-active").forEach(el => el.classList.remove("is-active"));
  };

  mapEl.querySelectorAll(".station").forEach((node) => {
    const id = node.getAttribute("data-station");

    node.addEventListener("click", (e) => {
      openCard(id, e.clientX, e.clientY);
    });

    // Click only interaction
  });

  cardClose?.addEventListener("click", closeCard);
  document.addEventListener("click", (e) => {
    const isStation = e.target.closest && e.target.closest(".station");
    const isCard = e.target.closest && e.target.closest(`#${cardId}`);
    if (!isStation && !isCard) closeCard();
  });
};

// Healthcare supply chain station map
const SUPPLY_CHAIN_STATIONS = {
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

const MARKETING_STATIONS = {
  1: {
    title: "Tracking and Campaign Taxonomy Foundation",
    offers: [
      "KPI + Conversion Definition: Lock definitions for CAC, ROAS, CVR, CPL, pipeline/revenue attribution (and what counts as a conversion at each funnel stage)",
      "Campaign Naming System: Create a consistent taxonomy for Campaign / Ad Set / Ad naming (channel, audience, offer, geo, objective, creative concept) so reporting stays clean over time",
      "UTM + Click ID Standards: Standardize UTMs (source/medium/campaign/content/term) and map click IDs (gclid / fbclid where applicable) so traffic and conversions reconcile across platforms",
      "Tracking QA and Gap Audit: Identify missing events, broken tags, duplicate conversions, cross-domain issues, or CRM handoff gaps (the stuff that silently ruins reporting)"
    ],
    note: "This is the get the truth right station. Without it, performance reporting turns into arguments about whose numbers are correct."
  },
  2: {
    title: "Data Integration and Unified Marketing Model",
    offers: [
      "Source Connectivity: Pull data from ad platforms + analytics + CRM/ecommerce via API/connectors (Meta, Google Ads, LinkedIn, GA4, HubSpot/Salesforce, Shopify/CRM/legacy systems)",
      "Normalization Layer: Standardize time zones, currencies, campaign naming, channel grouping, and UTM parsing so Facebook / fb / paid_social does not become three different channels",
      "Identity and Funnel Stitching: Join spend to sessions to leads to opportunities to revenue using stable keys (lead IDs, contact IDs, opportunity IDs, transaction IDs) and mapping rules for clean cross-platform joins",
      "Analytics Data Model: Build a reporting-ready schema (fact tables for spend/clicks/leads/revenue + dimensions for date/channel/campaign/audience/creative) designed for Power BI performance and long-term scale"
    ],
    note: "This is where marketing data becomes one system, not five dashboards telling five different stories."
  },
  3: {
    title: "Performance Reporting and Funnel Diagnostics",
    offers: [
      "Full-Funnel Views: Build reporting that connects top-of-funnel activity to downstream outcomes (leads to qualified to pipeline to revenue), not just clicks and impressions",
      "Segmented Performance Analysis: Break results down by channel/campaign/audience/creative/geo/device and isolate what is driving wins or losses",
      "Attribution-Ready Reporting (Practical): Implement clear, explainable attribution views (first-touch / last-touch / simple multi-touch rules) with transparent assumptions",
      "Variance and Root-Cause Drilldowns: Explain performance changes using drivers like mix shift (channel mix / audience mix), creative fatigue, landing-page changes, tracking breaks, or CRM stage delays"
    ],
    note: "This is where you stop reporting results and start explaining performance in a way teams can actually act on."
  },
  4: {
    title: "Optimization Engine and Budget Intelligence (MMM + ML-Ready)",
    offers: [
      "Action-Driven Insight Cadence: Turn reporting into weekly/monthly decisions: what changed, why it changed, and what to do next (pause/scale/shift budget/test)",
      "Experiment Measurement Support: Set up clean measurement for tests (creative tests, landing page tests, audience tests) with consistent baselines and tracking so learnings stick",
      "Budget Allocation Guidance: Build decision views that compare efficiency vs scale (CAC vs volume) and show where performance is saturating or breaking down",
      "Marketing Mix Modeling (Optional, Data-Dependent): If you have enough history and spend variation, we can build an MMM-style model (regression/Bayesian approaches; ML-assisted feature engineering) to estimate channel contribution and guide budget shifts. If not, we build the foundation so you become MMM-ready over time."
    ],
    note: "This is the numbers over gut-feel station. Performance monitoring plus clear recommendations that teams can execute with confidence."
  }
};

setupStationMap({
  mapId: "routeMap",
  stations: SUPPLY_CHAIN_STATIONS,
  cardId: "stationCard",
  kickerId: "cardKicker",
  titleId: "cardTitle",
  textId: "cardText",
  closeId: "cardClose"
});

setupStationMap({
  mapId: "marketingRouteMap",
  stations: MARKETING_STATIONS,
  cardId: "stationCard",
  kickerId: "cardKicker",
  titleId: "cardTitle",
  textId: "cardText",
  closeId: "cardClose"
});

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

// Header dropdown toggles (click)
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = dropdownToggle?.closest(".dropdown")?.querySelector(".dropdown-menu");
const dropdownSubToggle = document.querySelector(".dropdown-sub-toggle");
const dropdownSubMenu = dropdownSubToggle?.closest(".dropdown-sub")?.querySelector(".dropdown-menu-right");

const closeDropdowns = () => {
  dropdownMenu?.classList.remove("is-open");
  dropdownSubMenu?.classList.remove("is-open");
  dropdownToggle?.setAttribute("aria-expanded", "false");
  dropdownSubToggle?.setAttribute("aria-expanded", "false");
};

dropdownToggle?.addEventListener("click", (e) => {
  e.preventDefault();
  const isOpen = dropdownMenu?.classList.contains("is-open");
  closeDropdowns();
  if (!isOpen) {
    dropdownMenu?.classList.add("is-open");
    dropdownToggle.setAttribute("aria-expanded", "true");
  }
});

dropdownSubToggle?.addEventListener("click", (e) => {
  e.preventDefault();
  if (!dropdownMenu?.classList.contains("is-open")) {
    dropdownMenu?.classList.add("is-open");
    dropdownToggle?.setAttribute("aria-expanded", "true");
  }
  const isOpen = dropdownSubMenu?.classList.contains("is-open");
  dropdownSubMenu?.classList.toggle("is-open", !isOpen);
  dropdownSubToggle.setAttribute("aria-expanded", String(!isOpen));
});

document.addEventListener("click", (e) => {
  const target = e.target;
  if (target && !target.closest(".dropdown")) {
    closeDropdowns();
  }
});

// Fake form submit (we'll connect to a real endpoint later)
function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  if (status) status.textContent = "✅ Message captured locally. Next step: connect a real form endpoint.";
  e.target.reset();
  return false;
}
