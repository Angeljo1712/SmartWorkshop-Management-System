const output = document.getElementById("output");
let token = null;

const write = (data) => {
  if (!output) {
    return;
  }
  output.textContent = JSON.stringify(data, null, 2);
};

const api = (path, options = {}) =>
  fetch(`http://localhost:3000${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  }).then(async (response) => {
    const payload = await response.json();
    if (!response.ok) {
      throw payload;
    }
    return payload;
  });

const apiAuth = (path, token, options = {}) =>
  api(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

const heroBackdrop = document.querySelector(".home-hero .hero-backdrop");
if (heroBackdrop) {
  const layers = heroBackdrop.querySelectorAll(".hero-backdrop-layer");
  const heroImages = [
    { src: "/images/hero-1.jpg", brightness: 1.5 },
    { src: "/images/hero-2.jpg", brightness: 1.5 },
    { src: "/images/hero-3.jpg", brightness: 1.5 },
    { src: "/images/hero-4.jpg", brightness: 1.5 },
    { src: "/images/hero-5.jpg", brightness: 1.5 }
  ];
  let heroIndex = 0;
  let activeIndex = 0;

  const setLayerImage = (layer, image) => {
    layer.style.backgroundImage = `url("${image.src}")`;
    layer.style.filter = `saturate(0.85) contrast(1.05) brightness(${image.brightness || 1})`;
  };

  if (layers.length >= 2) {
    const jumpToImage = (imageIndex) => {
      const current = layers[activeIndex];
      const nextIndex = activeIndex === 0 ? 1 : 0;
      const next = layers[nextIndex];
      next.classList.remove("is-exiting");
      current.classList.remove("is-exiting");
      setLayerImage(next, heroImages[imageIndex]);
      next.classList.add("is-active");
      current.classList.remove("is-active");
      activeIndex = nextIndex;
      heroIndex = (imageIndex + 1) % heroImages.length;
    };

    setLayerImage(layers[activeIndex], heroImages[heroIndex]);
    heroIndex = (heroIndex + 1) % heroImages.length;
    setInterval(() => {
      const nextIndex = activeIndex === 0 ? 1 : 0;
      const current = layers[activeIndex];
      const next = layers[nextIndex];

      next.classList.remove("is-exiting");
      setLayerImage(next, heroImages[heroIndex]);
      heroIndex = (heroIndex + 1) % heroImages.length;

      next.classList.add("is-active");
      current.classList.add("is-exiting");
      current.classList.remove("is-active");

      setTimeout(() => {
        current.classList.remove("is-exiting");
      }, 900);

      activeIndex = nextIndex;
    }, 5000);
  }
}

const homeHeader = document.querySelector(".home-header");
const homeHero = document.querySelector(".home-hero");
if (homeHeader && homeHero) {
  const applyHeaderState = (isHero) => {
    homeHeader.classList.toggle("is-hero", isHero);
    homeHeader.classList.toggle("is-light", !isHero);
  };

  if ("IntersectionObserver" in window) {
    const updateObserver = () => {
      const headerHeight = homeHeader.offsetHeight || 0;
      const observer = new IntersectionObserver(
        ([entry]) => {
          applyHeaderState(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0,
          rootMargin: `-${headerHeight}px 0px 0px 0px`
        }
      );
      observer.observe(homeHero);
      return observer;
    };

    let observer = updateObserver();
    window.addEventListener("resize", () => {
      observer.disconnect();
      observer = updateObserver();
    });
  } else {
    const updateHeaderTheme = () => {
      const heroBottom = homeHero.getBoundingClientRect().bottom;
      const headerHeight = homeHeader.offsetHeight || 0;
      const isPastHero = heroBottom <= headerHeight + 1;
      applyHeaderState(!isPastHero ? true : false);
    };
    updateHeaderTheme();
    window.addEventListener("scroll", updateHeaderTheme, { passive: true });
    window.addEventListener("resize", updateHeaderTheme);
  }
}

const homeNavRootLink = document.querySelector('.home-nav a[href="/"]');
if (homeNavRootLink) {
  homeNavRootLink.addEventListener("click", (event) => {
    // On the home page, keep URL clean and scroll smoothly instead of reloading.
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", "/");
    }
  });
}

const renderVehicleSummary = () => {
  const container = document.getElementById("vehicleSummary");
  const titleEl = document.getElementById("bookingsTitle");
  const stored = sessionStorage.getItem("vehicleEnquiry");
  let data = null;
  if (stored) {
    data = JSON.parse(stored);
  } else {
    const params = new URLSearchParams(window.location.search);
    const reg = params.get("reg");
    const postcode = params.get("postcode");
    const make = params.get("make");
    const model = params.get("model");
    if (reg || postcode || make || model) {
      data = { registrationNumber: reg, postcode, make, model };
    }
  }

  if (!data) {
    if (container) {
      container.textContent = "No vehicle details found. Please start from the home page.";
    }
    return;
  }
  if (titleEl) {
    const make = data.make;
    const model = data.model;
    if (make && model) {
      titleEl.textContent = `What does your ${make} ${model} need?`;
    } else if (make) {
      titleEl.textContent = `What does your ${make} need?`;
    } else {
      titleEl.textContent = "What does your vehicle need?";
    }
  }
  if (container) {
    container.innerHTML = `
      <strong>Vehicle</strong>
      <p>${data.registrationNumber || "Unknown"} · ${data.make || "Unknown"} ${data.model || ""}</p>
      <p>${data.colour || "Unknown colour"} · ${data.fuelType || "Unknown fuel"} · ${data.yearOfManufacture || "Unknown year"}</p>
      <p>Postcode: ${data.postcode || "Unknown"}</p>
    `;
  }
};

const authPanel = document.querySelector(".auth-panel");
if (authPanel) {
  const toggleButtons = authPanel.querySelectorAll("[data-auth-toggle]");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-auth-toggle");
      authPanel.classList.toggle("is-create", mode === "create");
    });
  });
}

const vehicleForm = document.getElementById("vehicleLookupForm");
if (vehicleForm) {
  const regInput = document.getElementById("vehicleReg");
  const postcodeInput = document.getElementById("postcode");
  const errorEl = document.getElementById("vehicleLookupError");

  vehicleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const registrationNumber = regInput.value.trim().toUpperCase().replace(/\s+/g, "");
    const postcode = postcodeInput.value.trim().toUpperCase();

    if (!registrationNumber) {
      errorEl.textContent = "Please enter your registration number.";
      return;
    }
    if (!postcodeRegex.test(postcode)) {
      errorEl.textContent = "Please enter a valid UK postcode.";
      return;
    }

    errorEl.textContent = "";
    try {
      const result = await api("/api/vehicle-enquiry", {
        method: "POST",
        body: JSON.stringify({ registrationNumber })
      });

      const vehicleData = {
        registrationNumber: result.registrationNumber || registrationNumber,
        make: result.make,
        model: result.model,
        colour: result.colour,
        fuelType: result.fuelType,
        yearOfManufacture: result.yearOfManufacture,
        postcode
      };

      sessionStorage.setItem("vehicleEnquiry", JSON.stringify(vehicleData));
      const params = new URLSearchParams({
        reg: vehicleData.registrationNumber,
        postcode,
        make: vehicleData.make || "",
        model: vehicleData.model || ""
      });
      window.location.href = "/bookings/work/";
    } catch (err) {
      const message = err?.error?.message || err?.message || "Unable to look up vehicle details.";
      errorEl.textContent = message;
    }
  });
}

const authVehicleForm = document.getElementById("authVehicleForm");
if (authVehicleForm) {
  const regInput = document.getElementById("authVehicleReg");
  const postcodeInput = document.getElementById("authVehiclePostcode");
  const errorEl = document.getElementById("authVehicleError");

  authVehicleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const registrationNumber = regInput.value.trim().toUpperCase().replace(/\s+/g, "");
    const postcode = postcodeInput.value.trim().toUpperCase();

    if (!registrationNumber) {
      errorEl.textContent = "Please enter your registration number.";
      return;
    }
    if (!postcodeRegex.test(postcode)) {
      errorEl.textContent = "Please enter a valid UK postcode.";
      return;
    }

    errorEl.textContent = "";
    try {
      const result = await api("/api/vehicle-enquiry", {
        method: "POST",
        body: JSON.stringify({ registrationNumber })
      });

      const vehicleData = {
        registrationNumber: result.registrationNumber || registrationNumber,
        make: result.make,
        model: result.model,
        colour: result.colour,
        fuelType: result.fuelType,
        yearOfManufacture: result.yearOfManufacture,
        postcode
      };

      sessionStorage.setItem("vehicleEnquiry", JSON.stringify(vehicleData));
      const params = new URLSearchParams({
        reg: vehicleData.registrationNumber,
        postcode,
        make: vehicleData.make || "",
        model: vehicleData.model || ""
      });
      window.location.href = "/bookings/work/";
    } catch (err) {
      const message = err?.error?.message || err?.message || "Unable to look up vehicle details.";
      errorEl.textContent = message;
    }
  });
}

const getInstantQuotes = document.getElementById("getInstantQuotes");
if (getInstantQuotes) {
  getInstantQuotes.addEventListener("click", () => {
    window.location.href = "/bookings/work/";
  });
}

renderVehicleSummary();

const applicationJoin = document.getElementById("applicationJoin");
if (applicationJoin) {
  const formWrap = document.getElementById("applicationForm");
  const hero = document.querySelector(".application-hero");
  const headingEl = document.getElementById("applicationHeading");
  if (formWrap) formWrap.classList.add("is-hidden");
  if (hero) hero.classList.remove("is-hidden");
  const links = applicationJoin.querySelectorAll(".application-link");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const stored = sessionStorage.getItem("mechanicLead");
      if (stored && headingEl) {
        try {
          const lead = JSON.parse(stored);
          if (lead?.first_name) {
            headingEl.textContent = `Congratulations ${lead.first_name}!`;
          }
        } catch {}
      }
      formWrap?.classList.remove("is-hidden");
      hero?.classList.add("is-hidden");
      formWrap?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

const mechanicLeadForm = document.querySelector(".mechanic-form");
if (mechanicLeadForm) {
  mechanicLeadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const errorEl = document.getElementById("mechanicLeadError");
    if (errorEl) errorEl.textContent = "";
    const payload = {
      first_name: mechanicLeadForm.querySelector("input[name='first_name']")?.value?.trim(),
      last_name: mechanicLeadForm.querySelector("input[name='last_name']")?.value?.trim(),
      email: mechanicLeadForm.querySelector("input[name='email']")?.value?.trim(),
      phone: mechanicLeadForm.querySelector("input[name='phone']")?.value?.trim(),
      postcode: mechanicLeadForm.querySelector("input[name='postcode']")?.value?.trim()
    };
    if (!payload.email) {
      if (errorEl) errorEl.textContent = "Please enter an email.";
      return;
    }
    fetch(`/api/auth/check-email?email=${encodeURIComponent(payload.email)}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.exists) {
          if (errorEl) errorEl.textContent = "User with this email is already registered.";
          return;
        }
        sessionStorage.setItem("mechanicLead", JSON.stringify(payload));
        window.location.href = "/application/join";
      })
      .catch(() => {
        if (errorEl) errorEl.textContent = "Unable to verify email right now.";
      });
  });
}

const applicationForm = document.querySelector(".application-form");
if (applicationForm) {
  applicationForm.addEventListener("submit", () => {
    sessionStorage.setItem("fromApplication", "1");
    const stored = sessionStorage.getItem("mechanicLead");
    if (stored) {
      try {
        const lead = JSON.parse(stored);
        const first = document.getElementById("applyFirstName");
        const last = document.getElementById("applyLastName");
        const email = document.getElementById("applyEmail");
        const phoneVisible = document.getElementById("applyPhoneVisible");
        if (first) first.value = lead.first_name || "";
        if (last) last.value = lead.last_name || "";
        if (email) email.value = lead.email || "";
        if (phoneVisible) phoneVisible.value = lead.phone || "";
      } catch {}
    }
  });
}

const getSessionId = () => {
  const key = "bookingSessionId";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = (crypto?.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)) + Date.now();
    sessionStorage.setItem(key, value);
  }
  return value;
};

let bookingDraftWork = { items: [], total: 0 };
let bookingCatalogServices = [];

const bookingTypeStorageKey = "bookingWorkType";
const currentBookingType = new URLSearchParams(window.location.search).get("type");
if (currentBookingType) {
  sessionStorage.setItem(bookingTypeStorageKey, currentBookingType);
}

document.querySelectorAll(".bookings-stepper .stepper").forEach((stepper) => {
  const steps = Array.from(stepper.querySelectorAll(".step"));
  if (!steps.length) return;

  const storedType = sessionStorage.getItem(bookingTypeStorageKey) || "repair";
  const routes = [
    "/bookings",
    `/bookings/work?type=${encodeURIComponent(storedType)}`,
    "/bookings/details",
    "/bookings/payment"
  ];
  const activeIndex = steps.findIndex((step) => step.classList.contains("is-active"));
  const currentIndex = activeIndex >= 0 ? activeIndex : Math.max(...steps
    .map((step, index) => (step.classList.contains("is-complete") ? index : -1)));

  steps.forEach((step, index) => {
    const isAllowed = index <= currentIndex;
    step.style.cursor = isAllowed ? "pointer" : "default";
    step.setAttribute("role", isAllowed ? "link" : "button");
    step.setAttribute("tabindex", isAllowed ? "0" : "-1");
    step.setAttribute("aria-disabled", isAllowed ? "false" : "true");

    const navigateToStep = () => {
      if (!isAllowed) return;
      const targetRoute = routes[index];
      if (!targetRoute) return;
      window.location.href = targetRoute;
    };

    step.addEventListener("click", navigateToStep);
    step.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigateToStep();
      }
    });
  });
});

const getSelectedServiceIds = () =>
  new Set((bookingDraftWork.items || []).map((item) => String(item.service_catalog_id || item.service_id || item.id)));
const getSelectedServiceCodes = () => new Set((bookingDraftWork.items || []).map((item) => String(item.code || "")));

const formatLabourTime = (minutes) => {
  const value = Number(minutes || 0);
  if (!value || Number.isNaN(value)) return "";

  const minHours = Math.max(1, Math.floor(value / 60));
  const maxHours = Math.max(minHours, Math.ceil(value / 60));

  if (minHours === maxHours) {
    return `${minHours} hour${minHours === 1 ? "" : "s"} labour time`;
  }

  return `${minHours}-${maxHours} hours labour time`;
};

const formatDecimalHours = (minutes) => {
  const value = Number(minutes || 0);
  if (!value || Number.isNaN(value)) return "";
  return `${(value / 60).toFixed(1)} hours`;
};

const syncCompareButtons = () => {
  const buttons = document.querySelectorAll(".compare-service-toggle");
  if (!buttons.length) return;

  const selectedIds = getSelectedServiceIds();
  const selectedCodes = getSelectedServiceCodes();

  buttons.forEach((button) => {
    const code = String(button.dataset.serviceCode || "");
    const service = bookingCatalogServices.find((entry) => String(entry.code) === code);

    if (!service) {
      button.disabled = true;
      button.textContent = "Unavailable";
      return;
    }

    const isSelected = selectedCodes.has(code) || selectedIds.has(String(service.id));
    button.dataset.serviceId = String(service.id);
    button.dataset.selected = isSelected ? "true" : "false";
    button.textContent = isSelected ? "Remove" : "Add";
    button.className = `${isSelected ? "ghost" : "primary"} compare-service-toggle`;
    button.disabled = false;
  });
};

const addServiceToDraft = async (serviceId) => {
  const sessionId = getSessionId();
  const draft = await api("/api/bookings/draft/items", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, service_id: Number(serviceId) })
  });
  bookingDraftWork = draft;
  renderWorkSummary(draft);
  renderDraftSummary(draft);
  renderServices(null, bookingCatalogServices);
};

const removeServiceFromDraft = async (serviceId) => {
  const sessionId = getSessionId();
  const draft = await api(`/api/bookings/draft/items/${serviceId}?session_id=${encodeURIComponent(sessionId)}`, {
    method: "DELETE"
  });
  bookingDraftWork = draft;
  renderWorkSummary(draft);
  renderDraftSummary(draft);
  renderServices(null, bookingCatalogServices);
};

document.addEventListener("click", (event) => {
  const summaryRemoveBtn = event.target.closest("button.summary-remove");
  if (summaryRemoveBtn && summaryRemoveBtn.dataset.serviceId) {
    removeServiceFromDraft(summaryRemoveBtn.dataset.serviceId).catch(() => {});
    return;
  }

  const compareBtn = event.target.closest("button.compare-service-toggle");
  if (compareBtn && compareBtn.dataset.serviceId) {
    const selected = compareBtn.dataset.selected === "true";
    const action = selected ? removeServiceFromDraft : addServiceToDraft;
    action(compareBtn.dataset.serviceId).catch(() => {});
    return;
  }

  const toggleBtn = event.target.closest("button.service-toggle");
  if (toggleBtn && toggleBtn.dataset.serviceId) {
    const selected = toggleBtn.dataset.selected === "true";
    const action = selected ? removeServiceFromDraft : addServiceToDraft;
    action(toggleBtn.dataset.serviceId).catch(() => {});
    return;
  }

  const removeBtn = event.target.closest("button.service-remove");
  if (removeBtn && removeBtn.dataset.serviceId) {
    removeServiceFromDraft(removeBtn.dataset.serviceId).catch(() => {});
  }
});

const renderServices = (category, services) => {
  const list = document.getElementById("serviceList");
  const empty = document.getElementById("serviceListEmpty");
  if (!list) return;

  if (Array.isArray(services)) {
    bookingCatalogServices = services;
  }

  list.innerHTML = "";
  if (!services || services.length === 0) {
    if (empty) empty.classList.remove("is-hidden");
    return;
  }
  if (empty) empty.classList.add("is-hidden");

  const selectedIds = getSelectedServiceIds();

  services.forEach((service) => {
    const li = document.createElement("li");
    li.className = "work-row";

    const main = document.createElement("div");
    main.className = "work-main";

    const title = document.createElement("strong");
    title.textContent = service.name;
    main.appendChild(title);

    if (service.description) {
      const desc = document.createElement("span");
      desc.textContent = service.description;
      main.appendChild(desc);
    }

    const labourTime = formatLabourTime(service.base_labour_minutes);
    if (labourTime) {
      const labour = document.createElement("span");
      labour.textContent = labourTime;
      main.appendChild(labour);
    }

    const actions = document.createElement("div");
    actions.className = "work-actions";

    const more = document.createElement("a");
    more.href = "#";
    more.textContent = "More info";
    actions.appendChild(more);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = selectedIds.has(String(service.id)) ? "ghost service-toggle" : "primary service-toggle";
    toggle.textContent = selectedIds.has(String(service.id)) ? "Remove" : "Add";
    toggle.dataset.serviceId = service.id;
    toggle.dataset.selected = selectedIds.has(String(service.id)) ? "true" : "false";
    actions.appendChild(toggle);

    li.appendChild(main);
    li.appendChild(actions);
    list.appendChild(li);
  });

  syncCompareButtons();
};

const workLayout = document.querySelector(".work-layout");
if (workLayout) {
  const category = workLayout.dataset.serviceCategory;
  if (category) {
    fetch(`/api/catalog/services?category=${encodeURIComponent(category)}&region=UK-default`)
      .then((res) => res.json())
      .then((services) => renderServices(category, services))
      .catch(() => renderServices(category, []));
  }
}

const renderDraftSummary = (draft) => {
  const totalEl = document.getElementById("summaryTotal");
  const vehicleLineEl = document.getElementById("summaryVehicleLine");
  const workLineEl = document.getElementById("summaryWorkLine");

  if (totalEl) totalEl.textContent = `£${Number(draft.total || 0).toFixed(2)}`;

  if (vehicleLineEl) {
    vehicleLineEl.textContent = "Toyota Corolla 1.4L Petrol 2005 · KT10 0QR";
  }

  if (workLineEl) {
    if (!draft.items || draft.items.length === 0) {
      workLineEl.textContent = "No work selected yet.";
    } else {
      workLineEl.innerHTML = draft.items
        .map((item) => {
          const labour = formatDecimalHours(item.base_labour_minutes);
          return labour ? `${item.name} · Labour time: ${labour}` : item.name;
        })
        .map((line) => `<span class="price-work-line">${line}</span>`)
        .join("");
    }
  }
};

const renderWorkSummary = (draft) => {
  const list = document.getElementById("selectedWorkListWork");
  const empty = document.getElementById("selectedWorkEmptyWork");
  const totalEl = document.getElementById("summaryTotalWork");
  const summarySection = document.getElementById("workSummarySection");
  const nextStep = document.getElementById("workNextStep");
  if (!list) return;

  bookingDraftWork = draft;
  list.innerHTML = "";
  if (!draft.items || draft.items.length === 0) {
    if (summarySection) summarySection.classList.add("is-hidden");
    if (nextStep) nextStep.classList.add("is-hidden");
    if (empty) empty.classList.remove("is-hidden");
  } else if (empty) {
    if (summarySection) summarySection.classList.remove("is-hidden");
    if (nextStep) nextStep.classList.remove("is-hidden");
    empty.classList.add("is-hidden");
    draft.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "summary-item";
      row.innerHTML = `
        <button type="button" class="summary-remove service-remove" data-service-id="${item.service_catalog_id || item.service_id || item.id}" aria-label="Remove ${item.name}">×</button>
        <div class="summary-copy">
          <div class="summary-title-row">
            <strong>${item.name}</strong>
            <span class="summary-line-price">£${Number(item.line_total_eur || 0).toFixed(2)}</span>
          </div>
          ${
            formatLabourTime(item.base_labour_minutes)
              ? `<span>Estimated labour: ${formatLabourTime(item.base_labour_minutes).replace(" labour time", "")}</span>`
              : ""
          }
          ${
            item.description
              ? `<span>${item.description}</span>`
              : ""
          }
        </div>
      `;
      list.appendChild(row);
    });

    const collectionRow = document.createElement("div");
    collectionRow.className = "summary-benefit";
    collectionRow.innerHTML = `
      <div class="summary-benefit-copy">
        <strong>Collection & Delivery</strong>
      </div>
      <span class="summary-benefit-value">FREE</span>
    `;
    list.appendChild(collectionRow);

    const warrantyRow = document.createElement("div");
    warrantyRow.className = "summary-benefit";
    warrantyRow.innerHTML = `
      <div class="summary-benefit-copy">
        <strong>12-Month Warranty</strong>
        <span>Valid on labour & parts</span>
      </div>
      <span class="summary-benefit-value">FREE</span>
    `;
    list.appendChild(warrantyRow);
  }
  if (totalEl) totalEl.textContent = `£${Number(draft.total || 0).toFixed(2)}`;
  syncCompareButtons();
};

const detailsPage = document.getElementById("bookingDetailsPage");
if (detailsPage) {
  const sessionId = getSessionId();
  fetch(`/api/bookings/draft?session_id=${encodeURIComponent(sessionId)}`)
    .then((res) => res.json())
    .then((draft) => renderDraftSummary(draft))
    .catch(() => renderDraftSummary({ items: [], subtotal: 0, vat: 0, total: 0 }));
}

const workSummary = document.getElementById("summaryTotalWork");
if (workSummary) {
  const sessionId = getSessionId();
  fetch(`/api/bookings/draft?session_id=${encodeURIComponent(sessionId)}`)
    .then((res) => res.json())
    .then((draft) => {
      renderWorkSummary(draft);
      if (bookingCatalogServices.length) renderServices(null, bookingCatalogServices);
    })
    .catch(() => {
      renderWorkSummary({ items: [], subtotal: 0, vat: 0, total: 0 });
      if (bookingCatalogServices.length) renderServices(null, bookingCatalogServices);
    });
}

  const paymentPage = document.getElementById("bookingPaymentPage");
  if (paymentPage) {
  const sessionId = getSessionId();
  fetch(`/api/bookings/draft?session_id=${encodeURIComponent(sessionId)}`)
    .then((res) => res.json())
    .then((draft) => {
      const items = document.getElementById("paymentItems");
      const empty = document.getElementById("paymentEmpty");
      const totalEl = document.getElementById("paymentTotal");
      if (items) items.innerHTML = "";
      if (!draft.items || draft.items.length === 0) {
        if (empty) empty.classList.remove("is-hidden");
      } else if (empty) {
        empty.classList.add("is-hidden");
        draft.items.forEach((item) => {
          const row = document.createElement("div");
          row.className = "summary-item";
          row.innerHTML = `
            <div>
              <strong>${item.name}</strong>
              ${item.description ? `<span>${item.description}</span>` : ""}
            </div>
            <span>£${Number(item.line_total_eur).toFixed(2)}</span>
          `;
          items.appendChild(row);
        });
      }
      if (totalEl) totalEl.textContent = `£${Number(draft.total || 0).toFixed(2)}`;
    })
    .catch(() => {});

  const completeBtn = paymentPage.querySelector(".details-submit");
  completeBtn?.addEventListener("click", async () => {
    try {
      const result = await api("/api/bookings/draft/pay", {
        method: "POST",
        body: JSON.stringify({ session_id: getSessionId(), provider: "mock", currency: "GBP" })
      });
      if (result?.booking_id) {
        sessionStorage.setItem("latestBookingReference", String(result.booking_id));
      }
      window.location.href = "/bookings/confirm";
    } catch (err) {
      alert(err?.error?.message || err?.message || "Payment failed.");
    }
  });
}

const confirmPage = document.getElementById("bookingConfirmPage");
if (confirmPage) {
  const sessionId = getSessionId();
  const confirmAccountCard = document.getElementById("confirmAccountCard");
  const confirmAccountPassword = document.getElementById("confirmAccountPassword");
  const confirmAccountPasswordConfirm = document.getElementById("confirmAccountPasswordConfirm");
  const confirmAccountError = document.getElementById("confirmAccountError");
  const confirmAccountSubmit = document.getElementById("confirmAccountSubmit");
  fetch(`/api/bookings/draft?session_id=${encodeURIComponent(sessionId)}`)
    .then((res) => res.json())
    .then((draft) => {
      const items = document.getElementById("confirmItems");
      const empty = document.getElementById("confirmEmpty");
      const totalEl = document.getElementById("confirmTotal");
      if (items) items.innerHTML = "";
      if (!draft.items || draft.items.length === 0) {
        if (empty) empty.classList.remove("is-hidden");
      } else if (empty) {
        empty.classList.add("is-hidden");
        draft.items.forEach((item) => {
          const row = document.createElement("div");
          row.className = "summary-item";
          row.innerHTML = `
            <div>
              <strong>${item.name}</strong>
              ${item.description ? `<span>${item.description}</span>` : ""}
            </div>
            <span>£${Number(item.line_total_eur).toFixed(2)}</span>
          `;
          items.appendChild(row);
        });
      }
      if (totalEl) totalEl.textContent = `£${Number(draft.total || 0).toFixed(2)}`;

      const bookingReferenceEl = document.getElementById("confirmBookingReference");
      const storedBookingReference = sessionStorage.getItem("latestBookingReference");
      if (bookingReferenceEl) {
        bookingReferenceEl.textContent = storedBookingReference || "-";
      }

      const nameEl = document.getElementById("confirmCustomerName");
      const emailEl = document.getElementById("confirmCustomerEmail");
      const phoneEl = document.getElementById("confirmCustomerPhone");
      if (draft.user) {
        const fullName = [draft.user.name, draft.user.lastname].filter(Boolean).join(" ");
        if (nameEl) nameEl.textContent = fullName || "-";
        if (emailEl) emailEl.textContent = draft.user.email || "-";
        if (phoneEl) phoneEl.textContent = draft.user.phone || "-";
      }

      const addressEl = document.getElementById("confirmAddress");
      if (draft.address) {
        const addr = [draft.address.line1, draft.address.line2, draft.address.city, draft.address.postal_code, draft.address.country]
          .filter(Boolean)
          .join(", ");
        if (addressEl) addressEl.textContent = addr || "-";
      }

      const availabilityEl = document.getElementById("confirmAvailability");
      if (availabilityEl) {
        const slots = (draft.availability || [])
          .filter((day) => day.slots && day.slots.length)
          .map((day) => `${day.day} (${day.weekday}): ${day.slots.join(", ")}`);
        availabilityEl.textContent = slots.length ? slots.join(" | ") : "-";
      }

      const vehicleDrivableEl = document.getElementById("confirmVehicleDrivable");
      if (vehicleDrivableEl) {
        vehicleDrivableEl.textContent =
          draft.vehicle_drivable === "yes"
            ? "Yes, the vehicle can be collected."
            : draft.vehicle_drivable === "no"
              ? "No, the vehicle is not drivable for collection."
              : "-";
      }

      const diagnosticNotesEl = document.getElementById("confirmDiagnosticNotes");
      if (diagnosticNotesEl) {
        diagnosticNotesEl.textContent = draft.notes?.trim() || "-";
      }

      const createdAccountEmail = sessionStorage.getItem("bookingCreatedAccountEmail");
      const shouldShowAccountCard =
        sessionStorage.getItem("bookingCreatedAccountPending") === "true" ||
        (createdAccountEmail && draft.user?.email && createdAccountEmail === draft.user.email);

      if (confirmAccountCard && shouldShowAccountCard) {
        confirmAccountCard.classList.remove("is-hidden");
      }
    })
    .catch(() => {});

  confirmAccountSubmit?.addEventListener("click", async () => {
    if (confirmAccountError) confirmAccountError.textContent = "";
    const password = confirmAccountPassword?.value || "";
    const confirm = confirmAccountPasswordConfirm?.value || "";

    if (!password || !confirm) {
      if (confirmAccountError) confirmAccountError.textContent = "Enter and confirm your password.";
      return;
    }

    if (password !== confirm) {
      if (confirmAccountError) confirmAccountError.textContent = "Passwords do not match.";
      return;
    }

    try {
      const setPasswordResult = await api("/api/bookings/draft/account-password", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId, password })
      });

      const loginResult = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: setPasswordResult.email, password })
      });

      sessionStorage.setItem("userToken", loginResult.token);
      sessionStorage.setItem("userProfile", JSON.stringify(loginResult.user));
      sessionStorage.setItem("activeRole", "CUSTOMER");
      sessionStorage.removeItem("bookingCreatedAccountPending");
      sessionStorage.removeItem("bookingCreatedAccountEmail");
      window.location.href = "/user/dashboard";
    } catch (err) {
      if (confirmAccountError) {
        confirmAccountError.textContent = err?.error?.message || err?.message || "Unable to create account access.";
      }
    }
  });
}

const bookingDetailsForm = document.getElementById("bookingDetailsForm");
if (bookingDetailsForm) {
  const errorEl = document.getElementById("bookingDetailsError");
  const toggleButtons = bookingDetailsForm.querySelectorAll(".toggle");
  const detailsEmailInput = document.getElementById("detailsEmail");
  const detailsEmailExistsMessage = document.getElementById("detailsEmailExistsMessage");
  const availabilityGrid = bookingDetailsForm.querySelector("#availabilityGrid");
  const availabilityMonthLabel = bookingDetailsForm.querySelector("#availabilityMonthLabel");
  const availabilityPrevMonth = bookingDetailsForm.querySelector("#availabilityPrevMonth");
  const availabilityNextMonth = bookingDetailsForm.querySelector("#availabilityNextMonth");
  const availabilitySlotOptions = ["All day", "8-10 AM", "10-12 AM", "12-2 PM", "2-4 PM", "4-6 PM"];
  const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
  const monthFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const initialAvailabilityDate = new Date();
  initialAvailabilityDate.setHours(0, 0, 0, 0);
  const minimumAvailabilityDate = new Date(initialAvailabilityDate);
  minimumAvailabilityDate.setMonth(minimumAvailabilityDate.getMonth() + 1);
  let currentAvailabilityStartDate = new Date(minimumAvailabilityDate);
  const availabilitySelections = new Map();

  const formatOrdinalDay = (dayNumber) => {
    const remainder = dayNumber % 10;
    const teens = dayNumber % 100;
    if (teens >= 11 && teens <= 13) return `${dayNumber}th`;
    if (remainder === 1) return `${dayNumber}st`;
    if (remainder === 2) return `${dayNumber}nd`;
    if (remainder === 3) return `${dayNumber}rd`;
    return `${dayNumber}th`;
  };

  const getVisibleAvailabilitySelections = () => {
    if (!availabilityGrid) return new Map();
    const selections = new Map();
    availabilityGrid.querySelectorAll(".availability-day").forEach((day) => {
      const key = day.dataset.isoDate;
      const slots = Array.from(day.querySelectorAll(".slot.is-active")).map((slot) => slot.dataset.time);
      if (key && slots.length) selections.set(key, slots);
    });
    return selections;
  };

  const persistVisibleAvailabilitySelections = () => {
    const visibleSelections = getVisibleAvailabilitySelections();
    visibleSelections.forEach((slots, key) => {
      availabilitySelections.set(key, slots);
    });

    if (!availabilityGrid) return;
    availabilityGrid.querySelectorAll(".availability-day").forEach((day) => {
      const key = day.dataset.isoDate;
      if (!key) return;
      const slots = Array.from(day.querySelectorAll(".slot.is-active")).map((slot) => slot.dataset.time);
      if (!slots.length) availabilitySelections.delete(key);
    });
  };

  const buildAvailabilityPayload = () =>
    Array.from(availabilitySelections.entries())
      .filter(([, slots]) => slots && slots.length)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([isoDate, slots]) => {
        const date = new Date(`${isoDate}T00:00:00`);
        return {
          day: formatOrdinalDay(date.getDate()),
          weekday: weekdayFormatter.format(date),
          iso_date: isoDate,
          slots
        };
      });

  let emailCheckRequest = 0;
  const checkBookingDetailsEmail = async () => {
    const email = detailsEmailInput?.value?.trim();
    if (!detailsEmailExistsMessage) return;
    detailsEmailExistsMessage.classList.add("is-hidden");
    if (!email) return;

    const requestId = ++emailCheckRequest;
    try {
      const result = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`).then((res) => res.json());
      if (requestId !== emailCheckRequest) return;
      if (result?.exists) {
        detailsEmailExistsMessage.classList.remove("is-hidden");
      }
    } catch (_err) {}
  };

  const renderAvailabilityCalendar = (startDate) => {
    if (!availabilityGrid || !availabilityMonthLabel) return;
    availabilityMonthLabel.textContent = monthFormatter.format(startDate);

    const daysMarkup = Array.from({ length: 5 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const isoDate = date.toISOString().slice(0, 10);
      const daySlots = availabilitySelections.get(isoDate) || [];
      const isCurrentDay = index === 0 ? " is-current" : "";
      const slotMarkup = availabilitySlotOptions
        .map((time) => {
          const isActive = daySlots.includes(time) ? " is-active" : "";
          return `<button class="slot${isActive}" type="button" data-time="${time}">${time}</button>`;
        })
        .join("");

      return `
        <div class="availability-day${isCurrentDay}" data-day="${formatOrdinalDay(date.getDate())}" data-weekday="${weekdayFormatter.format(date)}" data-iso-date="${isoDate}">
          <strong>${formatOrdinalDay(date.getDate())}</strong>
          <span>${weekdayFormatter.format(date)}</span>
          ${slotMarkup}
        </div>
      `;
    }).join("");

    availabilityGrid.innerHTML = daysMarkup;

    if (availabilityPrevMonth) {
      availabilityPrevMonth.disabled = startDate <= minimumAvailabilityDate;
    }
  };

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  detailsEmailInput?.addEventListener("blur", checkBookingDetailsEmail);

  renderAvailabilityCalendar(currentAvailabilityStartDate);

  if (availabilityGrid) {
    availabilityGrid.addEventListener("click", (event) => {
      const slotButton = event.target.closest(".slot");
      if (!slotButton) return;
      const dayColumn = slotButton.closest(".availability-day");
      if (!dayColumn) return;

      const daySlots = Array.from(dayColumn.querySelectorAll(".slot"));
      const allDayButton = dayColumn.querySelector('.slot[data-time="All day"]');
      const hourlySlots = daySlots.filter((slot) => slot.dataset.time !== "All day");

      if (slotButton.dataset.time === "All day") {
        const shouldActivateAll = !slotButton.classList.contains("is-active");
        daySlots.forEach((slot) => {
          slot.classList.toggle("is-active", shouldActivateAll);
        });
        return;
      }

      slotButton.classList.toggle("is-active");

      if (allDayButton) {
        const areAllHourlySlotsActive = hourlySlots.length > 0 && hourlySlots.every((slot) => slot.classList.contains("is-active"));
        allDayButton.classList.toggle("is-active", areAllHourlySlotsActive);
      }

      persistVisibleAvailabilitySelections();
    });
  }

  if (availabilityNextMonth) {
    availabilityNextMonth.addEventListener("click", () => {
      persistVisibleAvailabilitySelections();
      currentAvailabilityStartDate = new Date(currentAvailabilityStartDate);
      currentAvailabilityStartDate.setDate(currentAvailabilityStartDate.getDate() + 1);
      renderAvailabilityCalendar(currentAvailabilityStartDate);
    });
  }

  if (availabilityPrevMonth) {
    availabilityPrevMonth.addEventListener("click", () => {
      const previousStartDate = new Date(currentAvailabilityStartDate);
      previousStartDate.setDate(previousStartDate.getDate() - 1);
      if (previousStartDate < minimumAvailabilityDate) return;
      persistVisibleAvailabilitySelections();
      currentAvailabilityStartDate = previousStartDate;
      renderAvailabilityCalendar(currentAvailabilityStartDate);
    });
  }

  bookingDetailsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (errorEl) errorEl.textContent = "";

    const isDrivable = bookingDetailsForm.querySelector(".toggle.is-active")?.textContent?.trim() === "Yes";
    persistVisibleAvailabilitySelections();
    const availability = buildAvailabilityPayload();

    const storedVehicle = sessionStorage.getItem("vehicleEnquiry");
    const vehicle = storedVehicle ? JSON.parse(storedVehicle) : null;
    const payload = {
      first_name: document.getElementById("detailsFirstName").value.trim(),
      last_name: document.getElementById("detailsLastName").value.trim(),
      email: document.getElementById("detailsEmail").value.trim(),
      address1: document.getElementById("detailsAddress1").value.trim(),
      address2: document.getElementById("detailsAddress2").value.trim(),
      city: document.getElementById("detailsCity").value.trim(),
      postcode: document.getElementById("detailsPostcode").value.trim(),
      phone: document.getElementById("detailsPhone").value.trim(),
      notes: document.getElementById("detailsNotes")?.value?.trim() || "",
      vehicle_drivable: isDrivable ? "yes" : "no",
      session_id: getSessionId(),
      availability,
      vehicle
    };

    try {
      const result = await api("/api/bookings/details", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      sessionStorage.setItem("bookingCreatedAccountPending", result.createdAccount ? "true" : "false");
      if (result.createdAccount) {
        sessionStorage.setItem("bookingCreatedAccountEmail", payload.email);
      } else {
        sessionStorage.removeItem("bookingCreatedAccountEmail");
      }
      window.location.href = "/bookings/payment";
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err?.error?.message || err?.message || "Unable to save booking details.";
      }
    }
  });
}

const adminPage = document.getElementById("adminPage");
if (adminPage) {
  const adminGate = document.getElementById("adminGate");
  const adminApp = document.getElementById("adminApp");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  const adminLoginError = document.getElementById("adminLoginError");
  const adminSearch = document.getElementById("adminSearch");
  const adminRoleFilter = document.getElementById("adminRoleFilter");
  const adminStatusFilter = document.getElementById("adminStatusFilter");
  const adminDateFilter = document.getElementById("adminDateFilter");
  const adminUserRows = document.getElementById("adminUserRows");
  const adminEmptyState = document.getElementById("adminEmptyState");
  const adminUserCount = document.getElementById("adminUserCount");
  const adminRowsPerPage = document.getElementById("adminRowsPerPage");
  const adminRowsMeta = document.getElementById("adminRowsMeta");
  const adminPagination = document.getElementById("adminPagination");
  const adminExportBtn = document.getElementById("adminExportBtn");
  const adminAddUserBtn = document.getElementById("adminAddUserBtn");
  const adminAddUserPanel = document.getElementById("adminAddUserPanel");
  const adminAddUserClose = document.getElementById("adminAddUserClose");
  const adminAddUserForm = document.getElementById("adminAddUserForm");
  const adminAddUserError = document.getElementById("adminAddUserError");
  const filterSections = document.querySelectorAll("[data-filter-section]");
  const adminNavLinks = document.querySelectorAll(".admin-nav-link");
  const adminProfileView = document.getElementById("adminProfileView");
  const adminUsersView = document.getElementById("adminUsersView");
  const adminSettingsView = document.getElementById("adminSettingsView");
  const adminProfileAvatar = document.getElementById("adminProfileAvatar");
  const adminProfileName = document.getElementById("adminProfileName");
  const adminProfileRole = document.getElementById("adminProfileRole");
  const adminSettingsAvatar = document.getElementById("adminSettingsAvatar");
  const adminSettingsName = document.getElementById("adminSettingsName");
  const adminSettingsEmail = document.getElementById("adminSettingsEmail");
  const adminSettingsEmailDetail = document.getElementById("adminSettingsEmailDetail");
  const adminSettingsRole = document.getElementById("adminSettingsRole");
  const adminSettingsPhone = document.getElementById("adminSettingsPhone");

  let adminUsers = [];
  let filteredUsers = [];
  let pageSize = Number(adminRowsPerPage?.value || 10);
  let currentPage = 1;

  const getAdminToken = () => sessionStorage.getItem("userToken");
  const getAdminProfile = () => {
    const stored = sessionStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : null;
  };
  const clearAdminSession = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userProfile");
    sessionStorage.removeItem("activeRole");
  };

  const setAdminHeader = (user) => {
    const displayName = user?.full_name || user?.email || "Admin";
    const role = user?.role_name || "ADMIN";
    const initials = getInitials(displayName);
    if (adminProfileAvatar) adminProfileAvatar.textContent = initials;
    if (adminProfileName) adminProfileName.textContent = displayName;
    if (adminProfileRole) adminProfileRole.textContent = role;
    if (adminSettingsAvatar) adminSettingsAvatar.textContent = initials;
    if (adminSettingsName) adminSettingsName.textContent = displayName;
    if (adminSettingsEmail) adminSettingsEmail.textContent = user?.email || "admin@smartworkshop.local";
    if (adminSettingsEmailDetail) {
      adminSettingsEmailDetail.textContent = `Email: ${user?.email || "admin@smartworkshop.local"}`;
    }
    if (adminSettingsRole) adminSettingsRole.textContent = role;
    if (adminSettingsPhone) adminSettingsPhone.textContent = "Phone: -";
  };

  const setAdminVisibility = (loggedIn) => {
    adminGate.classList.toggle("is-hidden", loggedIn);
    adminApp.classList.toggle("is-hidden", !loggedIn);
    adminLogoutBtn.disabled = !loggedIn;
  };

  const statusCycle = ["Active", "Pending", "Suspended", "Banned"];
  const toStatusLabel = (value) => {
    if (!value) return null;
    const lower = String(value).toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  const getStatus = (user, index) => toStatusLabel(user.status) || statusCycle[index % statusCycle.length];
  const getLastActive = (user, index) => {
    if (user.last_active) {
      const date = new Date(user.last_active);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      }
    }
    const options = ["1 minute ago", "4 hours ago", "2 days ago", "1 week ago", "1 month ago"];
    return options[index % options.length];
  };
  const getAvatarUrl = (email) =>
    email ? `https://i.pravatar.cc/80?u=${encodeURIComponent(email)}` : "";
  const fallbackLocations = [
    "Los Angeles, CA",
    "Sacramento, CA",
    "San Francisco, CA",
    "San Diego, CA",
    "San Jose, CA",
    "Oakland, CA"
  ];
  const getLocation = (user, index) => {
    if (user.location) return user.location;
    const city = user.city || user.town;
    if (city) return `${city}, CA`;
    return fallbackLocations[index % fallbackLocations.length];
  };
  const getCurrentJob = (user) => {
    const byRole = {
      ADMIN: "Operations Administrator",
      MECHANIC: "Lead Service Mechanic",
      CUSTOMER: "Vehicle Service Customer"
    };
    return byRole[user.role_name] || "Service Candidate";
  };
  const getExperience = (user) => {
    const created = new Date(user.created_at);
    if (!Number.isNaN(created.getTime())) {
      const years = Math.max(1, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365)));
      return `${years} yrs.`;
    }
    return "5 yrs.";
  };
  const getReadiness = (user, index) => {
    const status = getStatus(user, index);
    if (status === "Active") return "5/5";
    if (status === "Pending") return "4/5";
    if (status === "Suspended") return "2/5";
    return "1/5";
  };
  const getScore = (user, index) => {
    const seed = Number(user.user_id) || index + 1;
    return 420 + ((seed * 137) % 520);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    const parts = name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((part) => part[0]).join("");
    return initials.toUpperCase();
  };

  const getUsername = (email) => {
    if (!email) return "-";
    const [local] = email.split("@");
    return local || "-";
  };

  const applyFilters = () => {
    const term = adminSearch.value.trim().toLowerCase();
    const roleValue = adminRoleFilter.value;
    const statusValue = adminStatusFilter.value;
    const dateValue = adminDateFilter.value;
    const now = new Date();

    filteredUsers = adminUsers.filter((user, index) => {
      const role = user.role_name || "";
      const status = getStatus(user, index);
      const fullName = (user.full_name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const username = (user.username || "").toLowerCase();
      const matchesTerm =
        !term ||
        fullName.includes(term) ||
        email.includes(term) ||
        username.includes(term) ||
        role.toLowerCase().includes(term);
      const matchesRole = roleValue === "all" || role === roleValue;
      const matchesStatus = statusValue === "all" || status === statusValue;
      const matchesDate = (() => {
        if (dateValue === "all") return true;
        const created = new Date(user.created_at);
        if (Number.isNaN(created.getTime())) return false;
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);
        return diffDays <= Number(dateValue);
      })();

      return matchesTerm && matchesRole && matchesStatus && matchesDate;
    });

    currentPage = 1;
    renderPage();
  };

  const renderUsers = (users) => {
    adminUserRows.innerHTML = "";
    const total = adminUsers.length;
    adminUserCount.textContent = `${filteredUsers.length} of ${total} users total`;

    if (users.length === 0) {
      adminEmptyState.classList.remove("is-hidden");
      return;
    }

    adminEmptyState.classList.add("is-hidden");

    users.forEach((user, index) => {
      const row = document.createElement("tr");
      const readiness = getReadiness(user, index);
      const score = getScore(user, index);
      const location = getLocation(user, index);
      const currentJob = getCurrentJob(user);
      const experience = getExperience(user);
      const avatarUrl = getAvatarUrl(user.email);
      const displayName = user.full_name || user.email || "Unknown user";
      row.innerHTML = `
        <td class="table-check">
          <input type="checkbox" aria-label="Select ${displayName}" disabled />
        </td>
        <td>
          <div class="user-cell">
            <div class="avatar">
              ${avatarUrl ? `<img src="${avatarUrl}" alt="" />` : getInitials(displayName)}
            </div>
            <div class="user-meta">
              <strong>${displayName}</strong>
              <span>${user.email || `ID ${user.user_id}`}</span>
            </div>
          </div>
        </td>
        <td>${location}</td>
        <td>${currentJob}</td>
        <td>${experience}</td>
        <td>${readiness}</td>
        <td><span class="score-pill">${score}</span></td>
        <td class="table-actions">
          <div class="admin-actions-cell">
            <button class="icon-btn" type="button" title="Edit (coming soon)" disabled>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
            </button>
            <button class="icon-btn danger" type="button" title="Delete (coming soon)" disabled>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
              </svg>
            </button>
          </div>
        </td>
      `;
      adminUserRows.appendChild(row);
    });
  };

  const renderPagination = (totalPages) => {
    adminPagination.innerHTML = "";
    if (totalPages <= 1) return;

    const addButton = (label, page, isActive = false, isDisabled = false) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.disabled = isDisabled;
      btn.classList.toggle("active", isActive);
      btn.addEventListener("click", () => {
        currentPage = page;
        renderPage();
      });
      adminPagination.appendChild(btn);
    };

    addButton("<", Math.max(1, currentPage - 1), false, currentPage === 1);

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let page = start; page <= end; page += 1) {
      addButton(String(page), page, page === currentPage);
    }

    addButton(">", Math.min(totalPages, currentPage + 1), false, currentPage === totalPages);
  };

  const renderPage = () => {
    const total = filteredUsers.length;
    if (total === 0) {
      adminRowsMeta.textContent = "0 of 0 rows";
      renderUsers([]);
      adminPagination.innerHTML = "";
      return;
    }
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > pages) currentPage = pages;
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    adminRowsMeta.textContent = `${start + 1}-${end} of ${total} rows`;
    renderUsers(filteredUsers.slice(start, end));
    renderPagination(pages);
  };

  const fetchUsers = async () => {
    const token = getAdminToken();
    if (!token) {
      setAdminVisibility(false);
      return;
    }

    try {
      const result = await apiAuth("/api/admin/users", token);
      adminUsers = (result || []).map((user) => ({ ...user }));
      applyFilters();
    } catch (err) {
      adminLoginError.textContent = "Access denied. Please sign in with an admin account.";
      setAdminVisibility(false);
    }
  };

  const exportUsers = () => {
    if (!adminUsers.length) return;
    const rows = [
      ["Full name", "Email", "Username", "Role", "Status", "Joined date"],
      ...adminUsers.map((user) => [
        user.full_name,
        user.email,
        user.username || "",
        user.role_name,
        getStatus(user),
        formatDate(user.created_at)
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smartworkshop-users.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const ensureAdminProfile = () => {
    const profile = getAdminProfile();
    if (profile && profile.role_name === "ADMIN") {
      setAdminHeader(profile);
      setAdminVisibility(true);
      return true;
    }
    setAdminHeader(null);
    setAdminVisibility(false);
    return false;
  };

  adminLogoutBtn?.addEventListener("click", () => {
    clearAdminSession();
    window.location.replace("/");
  });

  adminNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.view;
      adminNavLinks.forEach((btn) => btn.classList.toggle("active", btn === link));
      adminProfileView.classList.toggle("is-hidden", view !== "profile");
      adminUsersView.classList.toggle("is-hidden", view !== "users");
      adminSettingsView?.classList.toggle("is-hidden", view !== "settings");
    });
  });

  adminExportBtn?.addEventListener("click", exportUsers);
  adminSearch?.addEventListener("input", applyFilters);
  adminRoleFilter?.addEventListener("change", applyFilters);
  adminStatusFilter?.addEventListener("change", applyFilters);
  adminDateFilter?.addEventListener("change", applyFilters);
  adminRowsPerPage?.addEventListener("change", () => {
    pageSize = Number(adminRowsPerPage.value);
    currentPage = 1;
    renderPage();
  });

  adminAddUserBtn?.addEventListener("click", () => {
    adminAddUserPanel.classList.toggle("is-hidden");
  });

  adminAddUserClose?.addEventListener("click", () => {
    adminAddUserPanel.classList.add("is-hidden");
  });

  adminAddUserForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminAddUserError.textContent = "";
    const token = getAdminToken();
    if (!token) {
      adminAddUserError.textContent = "Sign in as admin first.";
      return;
    }
    try {
      const payload = {
        full_name: document.getElementById("adminNewName").value.trim(),
        email: document.getElementById("adminNewEmail").value.trim(),
        password: document.getElementById("adminNewPassword").value,
        role: document.getElementById("adminNewRole").value
      };
      await apiAuth("/api/admin/users", token, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      adminAddUserForm.reset();
      adminAddUserPanel.classList.add("is-hidden");
      fetchUsers();
    } catch (err) {
      adminAddUserError.textContent = err?.error?.message || "Unable to create user.";
    }
  });

  const hasProfile = ensureAdminProfile();
  if (hasProfile) {
    fetchUsers();
  } else {
    adminLoginError.textContent = "Admins only. Please sign in first.";
  }

  filterSections.forEach((section) => {
    const toggleBtn = section.querySelector(".filter-toggle");
    if (!toggleBtn) return;
    toggleBtn.addEventListener("click", () => {
      const isCollapsed = section.classList.toggle("is-collapsed");
      toggleBtn.setAttribute("aria-expanded", String(!isCollapsed));
    });
  });
}

const loginButton = document.getElementById("loginCustomer");
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "customer@smartworkshop.local",
          password: "Customer123!"
        })
      });
      token = result.token;
      write(result);
    } catch (err) {
      write(err);
    }
  });
}

const requestsButton = document.getElementById("getRequests");
if (requestsButton) {
  requestsButton.addEventListener("click", async () => {
    if (!token) {
      return write({ error: "Login first to get a token." });
    }
    try {
      const result = await api("/api/service-requests/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      write(result);
    } catch (err) {
      write(err);
    }
  });
}

const signInForm = document.getElementById("signInForm");
if (signInForm) {
  const signInEmail = document.getElementById("signInEmail");
  const signInPassword = document.getElementById("signInPassword");
  const signInError = document.getElementById("signInError");

  // Force clean inputs on load to avoid browser/password-manager autofill remnants.
  signInForm.reset();
  if (signInEmail) signInEmail.value = "";
  if (signInPassword) signInPassword.value = "";
  setTimeout(() => {
    if (signInEmail) signInEmail.value = "";
    if (signInPassword) signInPassword.value = "";
  }, 0);

  signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    signInError.textContent = "";

    const identifier = signInEmail.value.trim();
    const password = signInPassword.value;

    if (!identifier || !password) {
      signInError.textContent = "Please enter your email or username and password.";
      return;
    }

    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password })
      });
      sessionStorage.setItem("userToken", result.token);
      sessionStorage.setItem("userProfile", JSON.stringify(result.user));
      const rawRoles = Array.isArray(result.user?.roles) && result.user.roles.length
        ? result.user.roles
        : [result.user?.role_name || "CUSTOMER"];
      const roles = rawRoles.map((role) => String(role || "").toUpperCase());
      const hasCustomerRole = roles.includes("CUSTOMER") || roles.includes("USER");
      const hasMechanicRole = roles.includes("MECHANIC");

      if (roles.includes("ADMIN")) {
        sessionStorage.setItem("activeRole", "ADMIN");
        window.location.href = "/admin";
        return;
      }
      if (hasMechanicRole && hasCustomerRole) {
        window.location.href = "/auth/select-role";
        return;
      }
      if (hasMechanicRole) {
        sessionStorage.setItem("activeRole", "MECHANIC");
        window.location.href = "/mechanic/dashboard";
        return;
      }
      sessionStorage.setItem("activeRole", "CUSTOMER");
      window.location.href = "/user/dashboard";
    } catch (err) {
      signInError.textContent = err?.error?.message || "Login failed. Check your credentials.";
    }
  });
}

const rolePickerButtons = document.querySelectorAll("[data-role-target]");
if (rolePickerButtons.length) {
  const storedProfile = sessionStorage.getItem("userProfile");
  let roles = [];
  try {
    const parsed = storedProfile ? JSON.parse(storedProfile) : null;
    const rawRoles = Array.isArray(parsed?.roles) && parsed.roles.length
      ? parsed.roles
      : [parsed?.role_name || ""];
    roles = rawRoles.map((role) => String(role || "").toUpperCase());
  } catch (_err) {
    roles = [];
  }

  const hasCustomerRole = roles.includes("CUSTOMER") || roles.includes("USER");
  const hasMechanicRole = roles.includes("MECHANIC");

  if (!hasCustomerRole || !hasMechanicRole) {
    if (hasMechanicRole) {
      sessionStorage.setItem("activeRole", "MECHANIC");
      window.location.replace("/mechanic/dashboard");
    } else {
      sessionStorage.setItem("activeRole", "CUSTOMER");
      window.location.replace("/user/dashboard");
    }
  }

  rolePickerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetRole = String(button.getAttribute("data-role-target") || "").toUpperCase();
      if (targetRole === "MECHANIC") {
        sessionStorage.setItem("activeRole", "MECHANIC");
        window.location.href = "/mechanic/dashboard";
        return;
      }
      sessionStorage.setItem("activeRole", "CUSTOMER");
      window.location.href = "/user/dashboard";
    });
  });
}

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
if (forgotPasswordForm) {
  const emailInput = document.getElementById("forgotPasswordEmail");
  const errorEl = document.getElementById("forgotPasswordError");

  forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorEl.textContent = "";
    const email = emailInput.value.trim();
    if (!email) {
      errorEl.textContent = "Please enter your email address.";
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/auth/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw payload;
      }
      errorEl.textContent = "Check your email for the reset link.";
    } catch (err) {
      errorEl.textContent = err?.error?.message || err?.message || "Unable to send reset link.";
    }
  });
}

const resetPasswordForm = document.getElementById("resetPasswordForm");
if (resetPasswordForm) {
  const passwordInput = document.getElementById("resetPasswordValue");
  const confirmInput = document.getElementById("resetPasswordConfirm");
  const errorEl = document.getElementById("resetPasswordError");
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorEl.textContent = "";
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const passwordRules = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;
    if (!token) {
      errorEl.textContent = "Missing reset token.";
      return;
    }
    if (!password || !confirm) {
      errorEl.textContent = "Please enter and confirm your new password.";
      return;
    }
    if (password !== confirm) {
      errorEl.textContent = "Passwords do not match.";
      return;
    }
    if (!passwordRules.test(password)) {
      errorEl.textContent = "Password must be 10+ chars with 1 uppercase, 1 number, 1 symbol.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw payload;
      }
      errorEl.textContent = "Password updated. Redirecting to sign in...";
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1200);
    } catch (err) {
      errorEl.textContent = err?.error?.message || err?.message || "Unable to reset password.";
    }
  });
}

const userPage = document.getElementById("userPage");
if (userPage) {
  const userLogoutBtn = document.getElementById("userLogoutBtn");
  const userProfileAvatar = document.getElementById("userProfileAvatar");
  const userProfileName = document.getElementById("userProfileName");
  const userProfileRole = document.getElementById("userProfileRole");
  const userSettingsAvatar = document.getElementById("userSettingsAvatar");
  const userSettingsName = document.getElementById("userSettingsName");
  const userSettingsEmail = document.getElementById("userSettingsEmail");
  const userSettingsEmailDetail = document.getElementById("userSettingsEmailDetail");
  const userSettingsUsername = document.getElementById("userSettingsUsername");
  const userSettingsRole = document.getElementById("userSettingsRole");
  const userSettingsRoleBadge = document.getElementById("userSettingsRoleBadge");
  const userSettingsPhone = document.getElementById("userSettingsPhone");
  const userSettingsAddress = document.getElementById("userSettingsAddress");
  const userSettingsAvatarSettings = document.getElementById("userSettingsAvatarSettings");
  const userSettingsNameSettings = document.getElementById("userSettingsNameSettings");
  const userSettingsEmailDetailSettings = document.getElementById("userSettingsEmailDetailSettings");
  const userSettingsRoleSettings = document.getElementById("userSettingsRoleSettings");
  const userSettingsPhoneSettings = document.getElementById("userSettingsPhoneSettings");
  const userRoleSwitcher = document.getElementById("userRoleSwitcher");
  const userSettingsPhotoInput = document.getElementById("userSettingsPhotoInput");
  const userSettingsPhoneInput = document.getElementById("userSettingsPhoneInput");
  const userSettingsUsernameInput = document.getElementById("userSettingsUsernameInput");
  const userSettingsEmailInput = document.getElementById("userSettingsEmailInput");
  const userSettingsAddressInput = document.getElementById("userSettingsAddressInput");
  const userSettingsContactSave = document.getElementById("userSettingsContactSave");
  const userSettingsContactMessage = document.getElementById("userSettingsContactMessage");
  const settingsSubnavLinks = document.querySelectorAll(".settings-subnav-link");
  const userSettingsGeneral = document.getElementById("userSettingsGeneral");
  const userSettingsNotifications = document.getElementById("userSettingsNotifications");
  const userSettingsSecurity = document.getElementById("userSettingsSecurity");
  const userNavLinks = document.querySelectorAll(".user-nav-link");
  const userDashboardView = document.getElementById("userDashboardView");
  const userDashboardName = document.getElementById("userDashboardName");
  const userWelcomeNames = document.querySelectorAll(".user-welcome-name");
  const userCarList = document.getElementById("userCarList");
  const userDashboardCarReg = document.getElementById("userDashboardCarReg");
  const userAddVehicleBtn = document.getElementById("userAddVehicleBtn");
  const userDashboardCarError = document.getElementById("userDashboardCarError");
  const userQuickQuoteReg = document.getElementById("userQuickQuoteReg");
  const userQuickQuoteProduct = document.getElementById("userQuickQuoteProduct");
  const userQuickQuoteBtn = document.getElementById("userQuickQuoteBtn");
  const userAccountView = document.getElementById("userAccountView");
  const userVehicleView = document.getElementById("userVehicleView");
  const userVehicleTitle = document.getElementById("userVehicleTitle");
  const userVehicleRegBadge = document.getElementById("userVehicleRegBadge");
  const userVehicleDropdownBtn = document.getElementById("userVehicleDropdownBtn");
  const userVehicleDropdownMenu = document.getElementById("userVehicleDropdownMenu");
  const userVehicleFuel = document.getElementById("userVehicleFuel");
  const userVehicleAge = document.getElementById("userVehicleAge");
  const userVehicleMileage = document.getElementById("userVehicleMileage");
  const userVehicleMotStatus = document.getElementById("userVehicleMotStatus");
  const userVehicleTaxStatus = document.getElementById("userVehicleTaxStatus");
  const userVehicleMileageStatus = document.getElementById("userVehicleMileageStatus");
  const userBookingsView = document.getElementById("userBookingsView");
  const userBookingsList = document.getElementById("userBookingsList");
  const userBookingsPhotos = document.getElementById("userBookingsPhotos");
  const userBookingsPhotosEmpty = document.getElementById("userBookingsPhotosEmpty");
  const userSettingsView = document.getElementById("userSettingsView");

  const getInitials = (name) => {
    if (!name) return "NA";
    const parts = name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((part) => part[0]).join("");
    return initials.toUpperCase();
  };

  const getUserProfile = () => {
    const stored = sessionStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : null;
  };

  const clearUserSession = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userProfile");
    sessionStorage.removeItem("activeRole");
  };

  const setAvatar = (el, initials, url) => {
    if (!el) return;
    el.innerHTML = "";
    if (url) {
      const resolvedUrl = url.startsWith("/uploads") ? `http://localhost:3000${url}` : url;
      const img = document.createElement("img");
      img.src = resolvedUrl;
      img.alt = "";
      el.appendChild(img);
      return;
    }
    el.textContent = initials;
  };

  const resolveActiveRole = (roles) => {
    const stored = sessionStorage.getItem("activeRole");
    if (stored && roles.includes(stored)) return stored;
    if (roles.includes("CUSTOMER")) return "CUSTOMER";
    return roles[0] || "CUSTOMER";
  };

  const setUserHeader = (user) => {
    const joinedName = [user?.name, user?.lastname].filter(Boolean).join(" ").trim();
    const displayName = user?.full_name || joinedName || user?.email || "User";
    const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : [user?.role_name || "CUSTOMER"];
    const activeRole = resolveActiveRole(roles);
    const initials = getInitials(displayName);
    setAvatar(userProfileAvatar, initials, user?.avatar_url);
    userProfileName.textContent = displayName;
    userProfileRole.textContent = activeRole;
    setAvatar(userSettingsAvatar, initials, user?.avatar_url);
    userSettingsName.textContent = displayName;
    if (userSettingsEmail) userSettingsEmail.textContent = user?.email || "-";
    userSettingsEmailDetail.textContent = `Email: ${user?.email || "-"}`;
    if (userSettingsUsername) userSettingsUsername.textContent = `Username: ${user?.username || "-"}`;
    userSettingsRole.textContent = activeRole;
    if (userSettingsRoleBadge) userSettingsRoleBadge.textContent = activeRole;
    userSettingsPhone.textContent = `Phone: ${user?.phone || "-"}`;
    if (userSettingsAddress) userSettingsAddress.textContent = `Address: ${user?.address || "-"}`;
    if (userSettingsAvatarSettings) setAvatar(userSettingsAvatarSettings, initials, user?.avatar_url);
    if (userSettingsNameSettings) userSettingsNameSettings.textContent = displayName;
    if (userSettingsEmailDetailSettings)
      userSettingsEmailDetailSettings.textContent = `Email: ${user?.email || "-"}`;
    if (userSettingsRoleSettings) userSettingsRoleSettings.textContent = activeRole;
    if (userSettingsPhoneSettings)
      userSettingsPhoneSettings.textContent = `Phone: ${user?.phone || "-"}`;
    if (userDashboardName) userDashboardName.textContent = displayName;
    userWelcomeNames.forEach((element) => {
      element.textContent = displayName;
    });
    if (userSettingsPhoneInput) userSettingsPhoneInput.value = user?.phone || "";
    if (userSettingsUsernameInput) userSettingsUsernameInput.value = user?.username || "";
    if (userSettingsEmailInput) userSettingsEmailInput.value = user?.email || "";
    if (userSettingsAddressInput) userSettingsAddressInput.value = user?.address || "";

    if (userRoleSwitcher) {
      userRoleSwitcher.innerHTML = "";
      roles.forEach((role) => {
        const option = document.createElement("option");
        option.value = role;
        option.textContent = role;
        if (role === activeRole) option.selected = true;
        userRoleSwitcher.appendChild(option);
      });
      userRoleSwitcher.classList.toggle("is-hidden", roles.length <= 1);
      userRoleSwitcher.onchange = () => {
        sessionStorage.setItem("activeRole", userRoleSwitcher.value);
        const selectedRole = userRoleSwitcher.value;
        setUserHeader({ ...user, roles });
        if (selectedRole === "MECHANIC") {
          window.location.href = "/mechanic/dashboard";
        } else if (selectedRole === "CUSTOMER") {
          window.location.href = "/user/dashboard";
        }
      };
    }
  };

  const profile = getUserProfile();
  const userToken = sessionStorage.getItem("userToken");
  if (profile) {
    sessionStorage.setItem("activeRole", "CUSTOMER");
    setUserHeader(profile);
  } else {
    window.location.href = "/";
  }

  const setUserView = (view) => {
    userDashboardView.classList.toggle("is-hidden", view !== "dashboard");
    userAccountView.classList.toggle("is-hidden", view !== "account");
    userVehicleView.classList.toggle("is-hidden", view !== "vehicle");
    userBookingsView.classList.toggle("is-hidden", view !== "bookings");
    userSettingsView.classList.toggle("is-hidden", view !== "settings");
  };

  const defaultDashboardVehicle = {
    registrationNumber: "KL05USC",
    make: "COROLLA",
    model: "COLOUR COL-N VVTI",
    fuelType: "Petrol",
    yearOfManufacture: new Date().getFullYear() - 21,
    mileage: "39,580 miles",
    motStatus: "Due in 28 weeks",
    taxStatus: "Due in 24 weeks",
    favorite: false
  };

  const normaliseDashboardVehicle = (vehicle) => {
    if (!vehicle) return null;
    return {
      id: vehicle.id || null,
      uuid_public: vehicle.uuid_public || null,
      registrationNumber: vehicle.registrationNumber || "-",
      make: vehicle.make || "",
      model: vehicle.model || "",
      fuelType: vehicle.fuelType || "-",
      yearOfManufacture: vehicle.yearOfManufacture || null,
      mileage: vehicle.mileage || "-",
      motStatus: vehicle.motStatus || "MOT status not available",
      taxStatus: vehicle.taxStatus || "Tax status not available",
      favorite: Boolean(vehicle.favorite)
    };
  };

  const saveDashboardVehicles = (vehicles) => {
    sessionStorage.setItem("userDashboardVehicles", JSON.stringify(vehicles));
  };

  const saveSelectedVehicleReg = (registrationNumber) => {
    sessionStorage.setItem("userSelectedVehicleReg", registrationNumber);
  };

  const getSelectedVehicleReg = () => sessionStorage.getItem("userSelectedVehicleReg");

  const formatBookingStatus = (status, paymentStatus) => {
    if (paymentStatus === "authorized" || paymentStatus === "auth_captured") return "PAID";
    return String(status || "requested").replace(/_/g, " ").toUpperCase();
  };

  const formatBookingDateTime = (slot) => {
    if (!slot?.start_at || !slot?.end_at) return "Date and time not assigned yet";
    const start = new Date(slot.start_at);
    const end = new Date(slot.end_at);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Date and time not assigned yet";
    const time = `${start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
    const date = start.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    return `${time} on ${date}`;
  };

  const formatCurrency = (amount, currency = "EUR") => {
    const normalizedCurrency = String(currency || "EUR").toUpperCase();
    const value = Number(amount || 0);
    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: normalizedCurrency
      }).format(value);
    } catch (_err) {
      return `${normalizedCurrency} ${value.toFixed(2)}`;
    }
  };

  const getDashboardVehicles = () => {
    const storedList = sessionStorage.getItem("userDashboardVehicles");
    if (storedList) {
      try {
        const parsed = JSON.parse(storedList);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed.map(normaliseDashboardVehicle).filter(Boolean);
        }
      } catch (_err) {
        sessionStorage.removeItem("userDashboardVehicles");
      }
    }

    const legacyVehicle = sessionStorage.getItem("userDashboardVehicle");
    if (legacyVehicle) {
      try {
        const parsed = normaliseDashboardVehicle(JSON.parse(legacyVehicle));
        if (parsed) {
          sessionStorage.setItem("userDashboardVehicles", JSON.stringify([parsed]));
          sessionStorage.removeItem("userDashboardVehicle");
          return [parsed];
        }
      } catch (_err) {
        sessionStorage.removeItem("userDashboardVehicle");
      }
    }

    return [];
  };

  const mergeDashboardVehicles = (storedVehicles, remoteVehicles) => {
    if (!Array.isArray(remoteVehicles)) {
      return storedVehicles;
    }

    if (!remoteVehicles.length) {
      return [];
    }

    const storedMap = new Map(storedVehicles.map((vehicle) => [vehicle.registrationNumber, vehicle]));
    return remoteVehicles.map((vehicle) => ({
      ...vehicle,
      ...(storedMap.get(vehicle.registrationNumber) || {})
    }));
  };

  const renderDashboardVehicles = (vehicles) => {
    const closeVehicleMenus = () => {
      document.querySelectorAll(".user-car-menu-panel").forEach((panel) => panel.classList.add("is-hidden"));
    };

    const buildVehicleCard = (vehicle) => {
      const reg = vehicle.registrationNumber || "-";
      const make = String(vehicle.make || "").trim();
      const model = String(vehicle.model || "").trim();
      const fuel = vehicle.fuelType || "-";
      const year = Number(vehicle.yearOfManufacture);
      const age = Number.isFinite(year) ? `${Math.max(new Date().getFullYear() - year, 0)} years old` : "-";
      const mileage =
        typeof vehicle.mileage === "number"
          ? `${vehicle.mileage.toLocaleString()} miles`
          : String(vehicle.mileage || "-");

      const card = document.createElement("div");
      card.className = "user-car-summary";
      card.innerHTML = `
        <div class="user-car-top">
          <div class="user-car-headline">
            <span class="user-reg-badge">${reg}</span>
            <div class="user-car-title-block">
              <strong>${make || reg}</strong>
              <span>${model || "Vehicle details loaded"}</span>
            </div>
          </div>
          <div class="user-car-actions">
            <button class="user-car-star${vehicle.favorite ? " is-favorite" : ""}" type="button" data-action="favorite" data-reg="${reg}" aria-label="Toggle favourite">★</button>
            <div class="user-car-menu-wrap">
              <button class="user-car-menu" type="button" data-action="menu" data-reg="${reg}" aria-label="Open vehicle menu">⋮</button>
              <div class="user-car-menu-panel is-hidden" data-menu-for="${reg}">
                <button type="button" data-action="edit" data-reg="${reg}">Edit</button>
                <button type="button" data-action="remove" data-reg="${reg}" class="danger">Remove</button>
              </div>
            </div>
          </div>
        </div>
        <div class="user-car-meta">
          <span>${fuel}</span>
          <span>${age}</span>
          <span>${mileage}</span>
        </div>
        <div class="user-car-status">
          <div class="user-car-status-item">
            <span class="user-car-status-icon">△</span>
            <div>
              <strong>Your MOT is valid</strong>
              <p>${vehicle.motStatus || "MOT status not available"}</p>
            </div>
            <span class="user-car-status-arrow">›</span>
          </div>
          <div class="user-car-status-item">
            <span class="user-car-status-icon">✓</span>
            <div>
              <strong>Taxed</strong>
              <p>${vehicle.taxStatus || "Tax status not available"}</p>
            </div>
            <span class="user-car-status-arrow">›</span>
          </div>
        </div>
      `;
      return card;
    };

    [userCarList].forEach((listEl) => {
      if (!listEl) return;
      listEl.innerHTML = "";
      if (!vehicles.length) {
        const emptyState = document.createElement("div");
        emptyState.className = "user-empty-state";
        emptyState.innerHTML = `
          <strong>No vehicles added yet.</strong>
          <span>Add a registration above to save a vehicle to your account.</span>
        `;
        listEl.appendChild(emptyState);
        return;
      }
      vehicles.forEach((vehicle) => {
        listEl.appendChild(buildVehicleCard(vehicle));
      });
    });

    const latestVehicle = vehicles[vehicles.length - 1];
    if (userQuickQuoteReg) userQuickQuoteReg.value = latestVehicle ? latestVehicle.registrationNumber || "" : "";
  };

  const renderVehicleDetail = (vehicles, preferredReg) => {
    if (!userVehicleDropdownMenu) return;

    const selectedReg = preferredReg || getSelectedVehicleReg() || vehicles[0]?.registrationNumber;
    const selectedVehicle =
      vehicles.find((vehicle) => vehicle.registrationNumber === selectedReg) || vehicles[0] || null;

    userVehicleDropdownMenu.innerHTML = "";
    if (!selectedVehicle) {
      if (userVehicleTitle) userVehicleTitle.textContent = "No vehicle selected";
      if (userVehicleRegBadge) userVehicleRegBadge.textContent = "-";
      if (userVehicleFuel) userVehicleFuel.textContent = "-";
      if (userVehicleAge) userVehicleAge.textContent = "-";
      if (userVehicleMileage) userVehicleMileage.textContent = "-";
      if (userVehicleMotStatus) userVehicleMotStatus.textContent = "MOT status not available";
      if (userVehicleTaxStatus) userVehicleTaxStatus.textContent = "Tax status not available";
      if (userVehicleMileageStatus) userVehicleMileageStatus.textContent = "-";
      return;
    }

    vehicles.forEach((vehicle) => {
      if (selectedVehicle && vehicle.registrationNumber === selectedVehicle.registrationNumber) return;
      const item = document.createElement("button");
      item.type = "button";
      item.className = "user-vehicle-dropdown-item";
      item.dataset.reg = vehicle.registrationNumber;
      item.innerHTML = `
        <span class="user-vehicle-dropdown-title">${[vehicle.make, vehicle.model].filter(Boolean).join(" ") || vehicle.registrationNumber}</span>
        <span class="user-reg-badge">${vehicle.registrationNumber}</span>
      `;
      userVehicleDropdownMenu.appendChild(item);
    });

    if (!selectedVehicle) return;

    const make = String(selectedVehicle.make || "").trim();
    const model = String(selectedVehicle.model || "").trim();
    const year = Number(selectedVehicle.yearOfManufacture);
    const age = Number.isFinite(year) ? `${Math.max(new Date().getFullYear() - year, 0)} years old` : "-";
    const mileage =
      typeof selectedVehicle.mileage === "number"
        ? `${selectedVehicle.mileage.toLocaleString()} miles`
        : String(selectedVehicle.mileage || "-");

    if (userVehicleTitle) userVehicleTitle.textContent = [make, model].filter(Boolean).join(" ") || selectedVehicle.registrationNumber;
    if (userVehicleRegBadge) userVehicleRegBadge.textContent = selectedVehicle.registrationNumber || "-";
    if (userVehicleFuel) userVehicleFuel.textContent = selectedVehicle.fuelType || "-";
    if (userVehicleAge) userVehicleAge.textContent = age;
    if (userVehicleMileage) userVehicleMileage.textContent = mileage;
    if (userVehicleMotStatus) userVehicleMotStatus.textContent = selectedVehicle.motStatus || "MOT status not available";
    if (userVehicleTaxStatus) userVehicleTaxStatus.textContent = selectedVehicle.taxStatus || "Tax status not available";
    if (userVehicleMileageStatus) userVehicleMileageStatus.textContent = mileage;

    saveSelectedVehicleReg(selectedVehicle.registrationNumber);
  };

  const renderUserBookings = (bookings) => {
    if (!userBookingsList) return;
    const user = getUserProfile() || {};
    userBookingsList.innerHTML = "";

    if (!Array.isArray(bookings) || !bookings.length) {
      const emptyState = document.createElement("p");
      emptyState.className = "user-booking-empty";
      emptyState.textContent = "No bookings to show yet.";
      userBookingsList.appendChild(emptyState);
      if (userBookingsPhotos) userBookingsPhotos.classList.add("is-hidden");
      return;
    }

    if (userBookingsPhotos) userBookingsPhotos.classList.remove("is-hidden");
    if (userBookingsPhotosEmpty) userBookingsPhotosEmpty.textContent = "No booking photos available.";

    bookings.forEach((booking) => {
      const addressLines = [booking.address?.line1, booking.address?.line2, booking.address?.city, booking.address?.postal_code].filter(Boolean);
      const mechanicName = booking.mechanic || "Unassigned";
      const vehicleLabel = [booking.vehicle?.make, booking.vehicle?.model, booking.vehicle?.yearOfManufacture].filter(Boolean).join(" ");
      const parts = booking.items.flatMap((item) => (Array.isArray(item.parts) ? item.parts : []));

      const card = document.createElement("article");
      card.className = "user-booking-card";
      card.innerHTML = `
        <div class="user-booking-toolbar">
          <span class="user-booking-status">${formatBookingStatus(booking.status, booking.payment?.status)}</span>
          <strong class="user-booking-reference">Reference: ${booking.reference}</strong>
          <button class="primary user-booking-actions" type="button">Actions</button>
        </div>
        <div class="user-booking-grid">
          <div class="user-booking-column">
            <h4>Date & Time</h4>
            <p>${formatBookingDateTime(booking.slot)}</p>
            <h4>Location</h4>
            ${addressLines.map((line) => `<p>${line}</p>`).join("") || "<p>Address not available</p>"}
            <h4>Contact Details</h4>
            <p>${[user.name, user.lastname].filter(Boolean).join(" ") || user.email || "-"}</p>
            <p>${user.email || "-"}</p>
            <p>${user.phone || "-"}</p>
          </div>
          <div class="user-booking-column">
            <h4>Vehicle</h4>
            <p>${vehicleLabel || booking.vehicle?.registrationNumber || "-"}</p>
            <p>${booking.vehicle?.registrationNumber || "-"}</p>
            <h4>Mechanic</h4>
            <p>${mechanicName}</p>
            <h4>Total Price</h4>
            <p class="user-booking-price">${formatCurrency(booking.totals?.total_eur, booking.payment?.currency)}</p>
            <h4>Amount Paid</h4>
            <p class="user-booking-price">${formatCurrency(booking.payment?.amount_eur ?? booking.totals?.total_eur, booking.payment?.currency)}</p>
          </div>
          <div class="user-booking-column">
            <h4>Services</h4>
            <ul>${booking.items.map((item) => `<li>${item.name}</li>`).join("") || "<li>No services attached</li>"}</ul>
            <h4>Parts</h4>
            <ul>${parts.map((part) => `<li>${typeof part === "string" ? part : part?.name || JSON.stringify(part)}</li>`).join("") || "<li>No parts recorded</li>"}</ul>
            <h4>Documents</h4>
            <p>${booking.payment?.provider_ref ? `Payment ref: ${booking.payment.provider_ref}` : "No documents available"}</p>
          </div>
        </div>
      `;
      userBookingsList.appendChild(card);
    });
  };

  let dashboardVehicles = getDashboardVehicles();
  renderDashboardVehicles(dashboardVehicles);
  renderVehicleDetail(dashboardVehicles);

  const syncDashboardVehiclesFromApi = async () => {
    if (!userToken) return;

    try {
      const vehicles = await apiAuth("/api/users/me/vehicles", userToken);
      dashboardVehicles = mergeDashboardVehicles(getDashboardVehicles(), vehicles.map(normaliseDashboardVehicle));
      saveDashboardVehicles(dashboardVehicles);
      renderDashboardVehicles(dashboardVehicles);
      renderVehicleDetail(dashboardVehicles);
    } catch (_err) {
      // Keep local fallback when the API is not available.
    }
  };

  const syncUserBookingsFromApi = async () => {
    if (!userToken || !userBookingsList) return;
    try {
      const bookings = await apiAuth("/api/users/me/bookings", userToken);
      renderUserBookings(bookings);
    } catch (_err) {
      renderUserBookings([]);
    }
  };

  const handleVehicleCardAction = async (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const reg = actionEl.dataset.reg;
    if (!reg) return;

    if (action === "menu") {
      const panel = actionEl.parentElement?.querySelector(".user-car-menu-panel");
      const shouldOpen = panel?.classList.contains("is-hidden");
      document.querySelectorAll(".user-car-menu-panel").forEach((menu) => menu.classList.add("is-hidden"));
      if (panel && shouldOpen) panel.classList.remove("is-hidden");
      return;
    }

    if (action === "favorite") {
      dashboardVehicles = dashboardVehicles.map((vehicle) =>
        vehicle.registrationNumber === reg ? { ...vehicle, favorite: !vehicle.favorite } : vehicle
      );
      saveDashboardVehicles(dashboardVehicles);
      renderDashboardVehicles(dashboardVehicles);
      renderVehicleDetail(dashboardVehicles, reg);
      return;
    }

    if (action === "edit") {
      if (userDashboardCarReg) {
        userDashboardCarReg.value = reg;
        userDashboardCarReg.focus();
      }
      if (userQuickQuoteReg) userQuickQuoteReg.value = reg;
      renderVehicleDetail(dashboardVehicles, reg);
      setUserView("vehicle");
      userNavLinks.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === "vehicle"));
      document.querySelectorAll(".user-car-menu-panel").forEach((menu) => menu.classList.add("is-hidden"));
      return;
    }

    if (action === "remove") {
      const confirmed = window.confirm(`Are you sure you want to remove ${reg} from your account?`);
      if (!confirmed) return;

      if (userToken) {
        try {
          await apiAuth(`/api/users/me/vehicles/${encodeURIComponent(reg)}`, userToken, {
            method: "DELETE"
          });
        } catch (_err) {
          return;
        }
      }

      dashboardVehicles = dashboardVehicles.filter((vehicle) => vehicle.registrationNumber !== reg);
      saveDashboardVehicles(dashboardVehicles);
      renderDashboardVehicles(dashboardVehicles);
      renderVehicleDetail(dashboardVehicles);
    }
  };

  [userCarList].forEach((listEl) => {
    listEl?.addEventListener("click", handleVehicleCardAction);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".user-car-menu-wrap")) {
      document.querySelectorAll(".user-car-menu-panel").forEach((menu) => menu.classList.add("is-hidden"));
    }

    if (!event.target.closest(".user-vehicle-dropdown")) {
      userVehicleDropdownMenu?.classList.add("is-hidden");
    }
  });

  userVehicleDropdownBtn?.addEventListener("click", () => {
    userVehicleDropdownMenu?.classList.toggle("is-hidden");
  });

  userVehicleDropdownMenu?.addEventListener("click", (event) => {
    const item = event.target.closest(".user-vehicle-dropdown-item");
    if (!item) return;
    renderVehicleDetail(dashboardVehicles, item.dataset.reg);
    userVehicleDropdownMenu.classList.add("is-hidden");
  });

  const setSettingsSubview = (view) => {
    userSettingsGeneral.classList.toggle("is-hidden", view !== "general");
    userSettingsNotifications.classList.toggle("is-hidden", view !== "notifications");
    userSettingsSecurity.classList.toggle("is-hidden", view !== "security");
  };

  userNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.view;
      userNavLinks.forEach((btn) => btn.classList.toggle("active", btn === link));
      setUserView(view);
    });
  });

  const handleAddVehicle = async (registrationInput, errorOutput) => {
    const registrationNumber = registrationInput?.value?.trim().toUpperCase().replace(/\s+/g, "") || "";
    if (!registrationNumber) {
      if (errorOutput) errorOutput.textContent = "Please enter a registration number.";
      return;
    }

    if (errorOutput) errorOutput.textContent = "";

    try {
      const result = await api("/api/vehicle-enquiry", {
        method: "POST",
        body: JSON.stringify({ registrationNumber })
      });

      const vehicleData = {
        registrationNumber: result.registrationNumber || registrationNumber,
        make: result.make || "",
        model: result.model || "",
        fuelType: result.fuelType || "",
        yearOfManufacture: result.yearOfManufacture || null,
        mileage: result.motTests?.[0]?.odometerValue || result.mileage || "-",
        motStatus: "MOT details loaded",
        taxStatus: "Tax details loaded"
      };

      if (dashboardVehicles.some((vehicle) => vehicle.registrationNumber === vehicleData.registrationNumber)) {
        if (errorOutput) errorOutput.textContent = "This vehicle is already in your dashboard.";
        return;
      }

      if (userToken) {
        const persisted = await apiAuth("/api/users/me/vehicles", userToken, {
          method: "POST",
          body: JSON.stringify(vehicleData)
        });
        vehicleData.id = persisted?.id || null;
        vehicleData.uuid_public = persisted?.uuid_public || null;
      }

      dashboardVehicles = [...dashboardVehicles, normaliseDashboardVehicle(vehicleData)];
      saveDashboardVehicles(dashboardVehicles);
      renderDashboardVehicles(dashboardVehicles);
      if (registrationInput) registrationInput.value = "";
    } catch (err) {
      if (errorOutput) {
        errorOutput.textContent = err?.error?.message || err?.message || "Unable to look up vehicle details.";
      }
    }
  };

  userAddVehicleBtn?.addEventListener("click", async () => {
    await handleAddVehicle(userDashboardCarReg, userDashboardCarError);
  });

  syncDashboardVehiclesFromApi();
  syncUserBookingsFromApi();

  userQuickQuoteBtn?.addEventListener("click", () => {
    const selectedType = userQuickQuoteProduct?.value || "repair";
    window.location.href = `/bookings/work/?type=${encodeURIComponent(selectedType)}`;
  });

  settingsSubnavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.subview;
      settingsSubnavLinks.forEach((btn) => btn.classList.toggle("active", btn === link));
      setSettingsSubview(view);
    });
  });

  userSettingsContactSave?.addEventListener("click", async () => {
    if (!userSettingsPhoneInput || !userSettingsEmailInput || !userSettingsAddressInput) return;
    const token = sessionStorage.getItem("userToken");
    if (!token) return;

    const phone = userSettingsPhoneInput.value.trim();
    const username = userSettingsUsernameInput?.value?.trim() || "";
    const email = userSettingsEmailInput.value.trim();
    const address = userSettingsAddressInput.value.trim();

    userSettingsContactMessage.textContent = "";
    try {
      const profile = getUserProfile() || {};
      if (phone !== (profile.phone || "") || address !== (profile.address || "") || username !== (profile.username || "")) {
        const response = await fetch("http://localhost:3000/api/users/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ phone, address, username })
        });
        const payload = await response.json();
        if (!response.ok) throw payload;
        sessionStorage.setItem("userProfile", JSON.stringify(payload));
        setUserHeader(payload);
      }

      if (email && email !== (profile.email || "")) {
        const response = await fetch("http://localhost:3000/api/users/me/email-change", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ email })
        });
        const payload = await response.json();
        if (!response.ok) throw payload;
        userSettingsContactMessage.textContent = "Check your email to confirm the change.";
      } else if (!email) {
        userSettingsContactMessage.textContent = "Email is required.";
      }
    } catch (err) {
      userSettingsContactMessage.textContent =
        err?.error?.message || err?.message || "Unable to update contact details.";
    }
  });

  userSettingsPhotoInput?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const token = sessionStorage.getItem("userToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:3000/api/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const payload = await response.json();
      if (!response.ok) {
        throw payload;
      }
      sessionStorage.setItem("userProfile", JSON.stringify(payload));
      setUserHeader(payload);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      event.target.value = "";
    }
  });

  userLogoutBtn?.addEventListener("click", () => {
    clearUserSession();
    window.location.replace("/");
  });
}

const mechanicDashboard = document.getElementById("mechanicPage") || document.querySelector(".mechanic-shell");
if (mechanicDashboard) {
  const mechanicLogoutBtn = document.getElementById("mechanicLogoutBtn");
  const nameEl = document.getElementById("mechanicWelcomeName");
  const idEl = document.getElementById("mechanicId");
  const mechanicAccountAvatar = document.getElementById("mechanicAccountAvatar");
  const mechanicAccountPhone = document.getElementById("mechanicAccountPhone");
  const mechanicAccountEmail = document.getElementById("mechanicAccountEmail");
  const mechanicAccountUsername = document.getElementById("mechanicAccountUsername");
  const mechanicAccountAddress = document.getElementById("mechanicAccountAddress");
  const mechanicAccountRole = document.getElementById("mechanicAccountRole");
  const editLink = document.getElementById("mechanicEditProfile");
  const viewLink = document.getElementById("mechanicViewProfile");
  const passwordCard = document.getElementById("mechanicSetPasswordCard");
  const passwordForm = document.getElementById("setMechanicPasswordForm");
  const passwordEmail = document.getElementById("mechanicPasswordEmail");
  const passwordError = document.getElementById("mechanicPasswordError");
  const profile = sessionStorage.getItem("userProfile");
  if (profile) {
    try {
      const user = JSON.parse(profile);
      const name = [user.name, user.lastname].filter(Boolean).join(" ") || user.email || "Mechanic";
      const initials = name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] || "")
        .join("")
        .toUpperCase() || "ME";
      const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : [user?.role_name || "MECHANIC"];
      const activeRole = roles.includes("MECHANIC") ? "MECHANIC" : roles[0];
      if (nameEl) nameEl.textContent = name;
      if (idEl) {
        const base = (user.uuid_public || user.id || "0000").toString().slice(-4).toUpperCase();
        idEl.textContent = `AG${base}`;
      }
      if (mechanicAccountAvatar) mechanicAccountAvatar.textContent = initials;
      if (mechanicAccountPhone) mechanicAccountPhone.textContent = `Phone: ${user?.phone || "-"}`;
      if (mechanicAccountEmail) mechanicAccountEmail.textContent = `Email: ${user?.email || "-"}`;
      if (mechanicAccountUsername) mechanicAccountUsername.textContent = `Username: ${user?.username || "-"}`;
      if (mechanicAccountAddress) mechanicAccountAddress.textContent = `Address: ${user?.address || "-"}`;
      if (mechanicAccountRole) mechanicAccountRole.textContent = activeRole;
      if (editLink) {
        const userId = user.id || "0";
        editLink.href = `/mechanic/${userId}/profile`;
      }
      if (viewLink) {
        const userId = user.id || "0";
        viewLink.href = `/mechanic/${userId}`;
      }
    } catch {}
  }

  const lead = sessionStorage.getItem("mechanicLead");
  if (lead) {
    try {
      const leadData = JSON.parse(lead);
      if (passwordEmail) passwordEmail.value = leadData.email || "";
      if (passwordCard) passwordCard.classList.remove("is-hidden");
    } catch {}
  }

  if (passwordForm) {
    passwordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (passwordError) passwordError.textContent = "";
      const payload = {
        email: passwordEmail?.value || "",
        password: document.getElementById("mechanicPasswordValue")?.value || "",
        confirm: document.getElementById("mechanicPasswordConfirm")?.value || ""
      };
      try {
        await api("/mechanic/set-password", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        if (passwordError) passwordError.textContent = "Password saved.";
        sessionStorage.removeItem("mechanicLead");
        if (passwordCard) passwordCard.classList.add("is-hidden");
      } catch (err) {
        if (passwordError) {
          passwordError.textContent = err?.error?.message || err?.message || "Unable to set password.";
        }
      }
    });
  }

  mechanicLogoutBtn?.addEventListener("click", () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userProfile");
    sessionStorage.removeItem("activeRole");
    window.location.replace("/");
  });
}

const mechanicEditNav = document.querySelector(".mechanic-edit-nav");
if (mechanicEditNav) {
  const profile = sessionStorage.getItem("userProfile");
  if (profile) {
    try {
      const user = JSON.parse(profile);
      const userId = user.id || "0";
      mechanicEditNav.querySelectorAll("a").forEach((link) => {
        if (link.href.includes("/mechanic/0/") || link.href.includes("/mechanic/null/")) {
          link.href = link.href.replace("/mechanic/0/", `/mechanic/${userId}/`);
          link.href = link.href.replace("/mechanic/null/", `/mechanic/${userId}/`);
        }
      });
    } catch {}
  }
}

const documentsShell = document.getElementById("mechanicDocumentsShell");
if (documentsShell) {
  const fromApply = sessionStorage.getItem("fromApplication") === "1";
  if (fromApply) {
    const nav = document.getElementById("mechanicEditNav");
    if (nav) nav.classList.add("is-hidden");
    documentsShell.classList.add("is-single");
    sessionStorage.removeItem("fromApplication");
  }
  const stored = sessionStorage.getItem("mechanicLead");
  if (stored) {
    try {
      const lead = JSON.parse(stored);
      const emailInput = document.getElementById("docsEmail");
      if (emailInput) emailInput.value = lead.email || "";
    } catch {}
  }
}

const confirmEmailPage = document.getElementById("confirmEmailPage");
if (confirmEmailPage) {
  const statusEl = document.getElementById("confirmEmailStatus");
  const detailsEl = document.getElementById("confirmEmailDetails");
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const setStatus = (text, isError = false) => {
    if (statusEl) statusEl.textContent = text;
    if (detailsEl) detailsEl.textContent = isError ? "Please request a new email change." : "";
  };

  if (!token) {
    setStatus("Missing confirmation token.", true);
  } else {
    fetch(`http://localhost:3000/api/users/confirm-email?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw payload;
        }
        if (payload.user) {
          sessionStorage.setItem("userProfile", JSON.stringify(payload.user));
        }
        setStatus("Email confirmed. You can sign in with the new email.");
      })
      .catch((err) => {
        setStatus(err?.error?.message || err?.message || "Unable to confirm email.", true);
      });
  }
}
