const BOOKING_SESSION_STORAGE_KEY = "bookingSessionId";
const BOOKING_TYPE_STORAGE_KEY = "bookingWorkType";

const getStoredBookingType = () => sessionStorage.getItem(BOOKING_TYPE_STORAGE_KEY) || "repair";

const getSessionId = () => {
  let value = sessionStorage.getItem(BOOKING_SESSION_STORAGE_KEY);
  if (!value) {
    value = (crypto?.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)) + Date.now();
    sessionStorage.setItem(BOOKING_SESSION_STORAGE_KEY, value);
  }
  return value;
};

let bookingDraftWork = { items: [], total: 0 };
let bookingCatalogServices = [];
let bookingCatalogSearchTerm = "";
const serviceInfoModal = document.getElementById("serviceInfoModal");
const serviceInfoModalTitle = document.getElementById("serviceInfoModalTitle");
const serviceInfoModalLead = document.getElementById("serviceInfoModalLead");
const serviceInfoModalBody = document.getElementById("serviceInfoModalBody");
const paymentCardBrand = document.getElementById("paymentCardBrand");
const paymentCardBrandValue = document.getElementById("paymentCardBrandValue");
const paymentExpiryHint = document.getElementById("paymentExpiryHint");
const paymentCvcHint = document.getElementById("paymentCvcHint");

const currentBookingType = new URLSearchParams(window.location.search).get("type");
if (currentBookingType) {
  sessionStorage.setItem(BOOKING_TYPE_STORAGE_KEY, currentBookingType);
}

document.querySelectorAll(".bookings-stepper .stepper").forEach((stepper) => {
  const steps = Array.from(stepper.querySelectorAll(".step"));
  if (!steps.length) return;

  const storedType = getStoredBookingType();
  const routes = [
    "/bookings/vehicle",
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

const detectCardBrand = (cardNumber) => {
  const digits = String(cardNumber || "").replace(/\D+/g, "");
  if (!digits) return "Unknown";
  if (digits.startsWith("4")) return "Visa";
  if (digits.startsWith("5")) return "Mastercard";
  if (digits.startsWith("1")) return "American Express";
  return "Unknown";
};

const getExpectedCvcLength = (cardNumberInputElement) => {
  return detectCardBrand(cardNumberInputElement?.value) === "American Express" ? 4 : 3;
};

const updatePaymentCardBrand = (cardNumberInputElement) => {
  if (!paymentCardBrand || !paymentCardBrandValue || !cardNumberInputElement) return;
  const brand = detectCardBrand(cardNumberInputElement.value);
  paymentCardBrand.dataset.brand = brand.toLowerCase().replace(/\s+/g, "-");
  paymentCardBrandValue.textContent = brand;
};

const syncPaymentCvcConstraints = (cardNumberInputElement, cvcInputElement = document.getElementById("paymentCvc")) => {
  const expectedLength = getExpectedCvcLength(cardNumberInputElement);
  if (!cvcInputElement) return expectedLength;

  cvcInputElement.maxLength = String(expectedLength);
  const digitsOnly = String(cvcInputElement.value || "").replace(/\D+/g, "").slice(0, expectedLength);
  cvcInputElement.value = digitsOnly;

  if (paymentCvcHint && !paymentCvcHint.classList.contains("is-error")) {
    paymentCvcHint.textContent = expectedLength === 4
      ? "Enter 4 digits on the card"
      : "Enter the 3 digits on the card";
  }

  return expectedLength;
};

const isExpiryInPast = (expiry) => {
  const match = String(expiry || "").trim().match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = Number(match[2]);
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;
  if (year < currentYear) return true;
  if (year > currentYear) return false;
  return month < currentMonth;
};

const setFieldHint = (element, text, isError = false) => {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle("is-error", Boolean(isError));
};

const closeServiceInfoModal = () => {
  if (!serviceInfoModal) return;
  serviceInfoModal.classList.add("is-hidden");
  serviceInfoModal.hidden = true;
};

const openServiceInfoModal = (service) => {
  if (!serviceInfoModal || !serviceInfoModalTitle || !serviceInfoModalLead || !serviceInfoModalBody) return;
  const name = String(service?.name || "Service details").trim();
  const description = String(service?.description || "").trim();
  const labourTime = formatLabourTime(service?.base_labour_minutes);

  serviceInfoModalTitle.textContent = name;
  serviceInfoModalLead.textContent = labourTime
    ? `Estimated labour time: ${labourTime.replace(" labour time", "")}`
    : "";
  serviceInfoModalBody.textContent = description || "No description is available for this service.";

  serviceInfoModal.hidden = false;
  serviceInfoModal.classList.remove("is-hidden");
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
  const serviceInfoTrigger = event.target.closest("[data-service-more-info]");
  if (serviceInfoTrigger) {
    const service = bookingCatalogServices.find((entry) => String(entry.id) === String(serviceInfoTrigger.dataset.serviceMoreInfo));
    openServiceInfoModal(service);
    return;
  }

  const serviceInfoClose = event.target.closest('[data-action="close-service-info-modal"]');
  if (serviceInfoClose) {
    closeServiceInfoModal();
    return;
  }

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeServiceInfoModal();
  }
});

const renderServices = (category, services) => {
  const list = document.getElementById("serviceList");
  const empty = document.getElementById("serviceListEmpty");
  if (!list) return;

  if (Array.isArray(services)) {
    bookingCatalogServices = services;
  }

  const normalizedSearch = bookingCatalogSearchTerm.trim().toLowerCase();
  const sortedServices = [...(services || bookingCatalogServices || [])].sort((a, b) =>
    String(a?.name || "").localeCompare(String(b?.name || ""))
  );
  const filteredServices = normalizedSearch
    ? sortedServices.filter((service) => String(service?.name || "").toLowerCase().includes(normalizedSearch))
    : sortedServices;

  list.innerHTML = "";
  if (!filteredServices || filteredServices.length === 0) {
    if (empty) empty.classList.remove("is-hidden");
    return;
  }
  if (empty) empty.classList.add("is-hidden");

  const selectedIds = getSelectedServiceIds();

  filteredServices.forEach((service) => {
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

    const more = document.createElement("button");
    more.type = "button";
    more.className = "work-more-info";
    more.textContent = "More info";
    more.dataset.serviceMoreInfo = String(service.id);
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

const workLayout = document.querySelector(".work-type-layout-2[data-service-category]");
if (workLayout) {
  const category = workLayout.dataset.serviceCategory;
  const searchInput = document.getElementById("serviceSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      bookingCatalogSearchTerm = String(event.target.value || "");
      renderServices(null, bookingCatalogServices);
    });
  }
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
  const cardNameInput = document.getElementById("paymentCardName");
  const cardNumberInput = document.getElementById("paymentCardNumber");
  const expiryInput = document.getElementById("paymentExpiry");
  const cvcInput = document.getElementById("paymentCvc");
  const paymentFormError = document.getElementById("paymentFormError");
  const setExpiryFieldValidity = (message = "") => {
    if (!expiryInput) return;
    expiryInput.setCustomValidity(message);
  };

  cardNumberInput?.addEventListener("input", () => {
    const digitsOnly = String(cardNumberInput.value || "").replace(/\D+/g, "").slice(0, 16);
    const grouped = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
    cardNumberInput.value = grouped;
    updatePaymentCardBrand(cardNumberInput);
    syncPaymentCvcConstraints(cardNumberInput, cvcInput);
  });

  cardNumberInput?.addEventListener("keyup", () => {
    updatePaymentCardBrand(cardNumberInput);
    syncPaymentCvcConstraints(cardNumberInput, cvcInput);
  });
  cardNumberInput?.addEventListener("change", () => {
    updatePaymentCardBrand(cardNumberInput);
    syncPaymentCvcConstraints(cardNumberInput, cvcInput);
  });
  cardNumberInput?.addEventListener("paste", () => window.setTimeout(() => {
    updatePaymentCardBrand(cardNumberInput);
    syncPaymentCvcConstraints(cardNumberInput, cvcInput);
  }, 0));

  cardNameInput?.addEventListener("input", () => {
    const lettersOnly = String(cardNameInput.value || "").replace(/[^A-Za-z\s]/g, "");
    cardNameInput.value = lettersOnly.replace(/\s{2,}/g, " ");
  });

  expiryInput?.addEventListener("input", () => {
    const digitsOnly = String(expiryInput.value || "").replace(/\D+/g, "").slice(0, 4);
    if (digitsOnly.length <= 2) {
      expiryInput.value = digitsOnly;
      setExpiryFieldValidity("");
      return;
    }
    expiryInput.value = `${digitsOnly.slice(0, 2)} / ${digitsOnly.slice(2)}`;
    setExpiryFieldValidity("");
  });

  expiryInput?.addEventListener("blur", () => {
    const value = String(expiryInput.value || "").trim();
    if (!value) {
      setFieldHint(paymentExpiryHint, "Enter a future expiry date", false);
      setExpiryFieldValidity("");
      return;
    }
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(value)) {
      setFieldHint(paymentExpiryHint, "Use MM / YY format", true);
      setExpiryFieldValidity("Use MM / YY format");
      return;
    }
    if (isExpiryInPast(value)) {
      setFieldHint(paymentExpiryHint, "Expiry date cannot be in the past", true);
      setExpiryFieldValidity("Expiry date cannot be in the past");
      return;
    }
    setExpiryFieldValidity("");
    setFieldHint(paymentExpiryHint, "Looks good", false);
  });

  cvcInput?.addEventListener("input", () => {
    const expectedLength = getExpectedCvcLength(cardNumberInput);
    cvcInput.value = String(cvcInput.value || "").replace(/\D+/g, "").slice(0, expectedLength);
  });

  cvcInput?.addEventListener("blur", () => {
    const value = String(cvcInput.value || "").trim();
    const expectedLength = getExpectedCvcLength(cardNumberInput);
    if (!value) {
      setFieldHint(paymentCvcHint, expectedLength === 4 ? "Enter 4 digits on the card" : "Enter the 3 digits on the card", false);
      return;
    }
    if (!new RegExp(`^\\d{${expectedLength}}$`).test(value)) {
      setFieldHint(paymentCvcHint, expectedLength === 4 ? "American Express uses 4 digits" : "CVC must be 3 digits", true);
      return;
    }
    setFieldHint(paymentCvcHint, "Looks good", false);
  });

  updatePaymentCardBrand(cardNumberInput);
  syncPaymentCvcConstraints(cardNumberInput);
  setFieldHint(paymentExpiryHint, "Enter a future expiry date", false);
  setFieldHint(paymentCvcHint, "Enter the 3 digits on the card", false);

  completeBtn?.addEventListener("click", async () => {
    const cardName = String(cardNameInput?.value || "").trim();
    const rawCardNumber = String(cardNumberInput?.value || "");
    const cardNumber = rawCardNumber.replace(/\s+/g, "");
    const expiry = String(expiryInput?.value || "").trim();
    const cvc = String(cvcInput?.value || "").trim();

    if (paymentFormError) paymentFormError.textContent = "";

    if (!cardName || !cardNumber || !expiry || !cvc) {
      if (paymentFormError) paymentFormError.textContent = "Please complete all payment fields.";
      return;
    }

    if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(cardName)) {
      if (paymentFormError) paymentFormError.textContent = "Name on card must contain letters only.";
      return;
    }

    if (!/^\d{15,16}$/.test(cardNumber)) {
      if (paymentFormError) paymentFormError.textContent = "Please enter a valid card number.";
      return;
    }

    if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry)) {
      if (paymentFormError) paymentFormError.textContent = "Please enter expiry date as MM / YY.";
      setFieldHint(paymentExpiryHint, "Use MM / YY format", true);
      setExpiryFieldValidity("Use MM / YY format");
      return;
    }

    const [monthText] = expiry.split("/").map((value) => value.trim());
    const month = Number(monthText);
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      if (paymentFormError) paymentFormError.textContent = "Please enter a valid expiry month.";
      setExpiryFieldValidity("Please enter a valid expiry month.");
      return;
    }

    if (isExpiryInPast(expiry)) {
      if (paymentFormError) paymentFormError.textContent = "Please enter a card expiry date that is not in the past.";
      setFieldHint(paymentExpiryHint, "Expiry date cannot be in the past", true);
      setExpiryFieldValidity("Expiry date cannot be in the past");
      return;
    }

    const expectedCvcLength = detectCardBrand(cardNumber) === "American Express" ? 4 : 3;
    if (!new RegExp(`^\\d{${expectedCvcLength}}$`).test(cvc)) {
      if (paymentFormError) paymentFormError.textContent = expectedCvcLength === 4
        ? "Please enter a 4 digit security code."
        : "Please enter a 3 digit security code.";
      setFieldHint(paymentCvcHint, expectedCvcLength === 4 ? "American Express uses 4 digits" : "CVC must be 3 digits", true);
      return;
    }

    try {
      setExpiryFieldValidity("");
      const paymentMethod = detectCardBrand(cardNumber);
      const cardLast4 = cardNumber.slice(-4);
      const result = await api("/api/bookings/draft/pay", {
        method: "POST",
        body: JSON.stringify({
          session_id: getSessionId(),
          provider: "mock",
          currency: "GBP",
          payment_method: paymentMethod,
          card_last4: cardLast4
        })
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

      setStoredAuthValue("userToken", loginResult.token);
      setStoredAuthValue("userProfile", JSON.stringify(loginResult.user));
      setStoredAuthValue("activeRole", "CUSTOMER");
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
  const detailsFirstNameInput = document.getElementById("detailsFirstName");
  const detailsLastNameInput = document.getElementById("detailsLastName");
  const detailsEmailInput = document.getElementById("detailsEmail");
  const detailsAddress1Input = document.getElementById("detailsAddress1");
  const detailsAddress2Input = document.getElementById("detailsAddress2");
  const detailsCityInput = document.getElementById("detailsCity");
  const detailsPostcodeInput = document.getElementById("detailsPostcode");
  const detailsPhoneInput = document.getElementById("detailsPhone");
  const detailsEmailExistsMessage = document.getElementById("detailsEmailExistsMessage");
  const detailsExistingAccountLink = document.getElementById("detailsExistingAccountLink");
  const detailsAuthModal = document.getElementById("detailsAuthModal");
  const detailsAuthForm = document.getElementById("detailsAuthForm");
  const detailsAuthEmail = document.getElementById("detailsAuthEmail");
  const detailsAuthPassword = document.getElementById("detailsAuthPassword");
  const detailsAuthModalError = document.getElementById("detailsAuthModalError");
  const detailsAuthTwoFactorPanel = document.getElementById("detailsAuthTwoFactorPanel");
  const detailsAuthTwoFactorForm = document.getElementById("detailsAuthTwoFactorForm");
  const detailsAuthTwoFactorCode = document.getElementById("detailsAuthTwoFactorCode");
  const detailsAuthTwoFactorMessage = document.getElementById("detailsAuthTwoFactorMessage");
  const detailsAuthTwoFactorError = document.getElementById("detailsAuthTwoFactorError");
  const detailsAuthResendCode = document.getElementById("detailsAuthResendCode");
  const detailsAuthBackToLogin = document.getElementById("detailsAuthBackToLogin");
  const vehicleDrivableNotice = document.getElementById("bookingVehicleDrivableNotice");
  let pendingDetailsChallengeToken = "";
  let pendingDetailsLoginIdentifier = "";
  const availabilityGrid = bookingDetailsForm.querySelector("#availabilityGrid");
  const availabilityMonthLabel = bookingDetailsForm.querySelector("#availabilityMonthLabel");
  const availabilityPrevMonth = bookingDetailsForm.querySelector("#availabilityPrevMonth");
  const availabilityNextMonth = bookingDetailsForm.querySelector("#availabilityNextMonth");
  const availabilitySlotOptions = ["All day", "8-10 AM", "10-12 AM", "12-2 PM", "2-4 PM", "4-6 PM"];
  const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
  const monthFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const initialAvailabilityDate = new Date();
  initialAvailabilityDate.setHours(0, 0, 0, 0);
  const syncVehicleDrivableNotice = () => {
    if (!vehicleDrivableNotice) return;
    const selected = bookingDetailsForm.querySelector(".toggle.is-active")?.textContent?.trim().toLowerCase();
    vehicleDrivableNotice.classList.toggle("is-hidden", selected !== "no");
  };
  const minimumAvailabilityDate = new Date(initialAvailabilityDate);
  minimumAvailabilityDate.setDate(minimumAvailabilityDate.getDate() + 1);
  let currentAvailabilityStartDate = new Date(minimumAvailabilityDate);
  const availabilitySelections = new Map();
  const getAvailabilityDayCount = () => {
    if (window.matchMedia("(max-width: 480px)").matches) return 1;
    if (window.matchMedia("(min-width: 1440px)").matches) return 5;
    return 3;
  };

  const applyBookingDetailsUserData = (user) => {
    if (!user) return;
    const addressDetails = user.address_details || {};
    if (detailsFirstNameInput && !detailsFirstNameInput.value.trim()) {
      detailsFirstNameInput.value = user.name || "";
    }
    if (detailsLastNameInput && !detailsLastNameInput.value.trim()) {
      detailsLastNameInput.value = user.lastname || "";
    }
    if (detailsEmailInput && !detailsEmailInput.value.trim()) {
      detailsEmailInput.value = user.email || "";
    }
    if (detailsAddress1Input && !detailsAddress1Input.value.trim()) {
      detailsAddress1Input.value = addressDetails.line1 || user.address || "";
    }
    if (detailsAddress2Input && !detailsAddress2Input.value.trim()) {
      detailsAddress2Input.value = addressDetails.line2 || "";
    }
    if (detailsCityInput && !detailsCityInput.value.trim()) {
      detailsCityInput.value = addressDetails.city || user.city || "";
    }
    if (detailsPostcodeInput && !detailsPostcodeInput.value.trim()) {
      detailsPostcodeInput.value = addressDetails.postal_code || user.postcode || "";
    }
    if (detailsPhoneInput && !detailsPhoneInput.value.trim()) {
      detailsPhoneInput.value = user.phone || "";
    }
  };

  const openDetailsAuthModal = () => {
    if (!detailsAuthModal) return;
    detailsAuthModal.hidden = false;
    detailsAuthModal.classList.remove("is-hidden");
    if (detailsAuthModalError) {
      detailsAuthModalError.textContent = "";
      detailsAuthModalError.classList.add("is-hidden");
    }
    if (detailsAuthTwoFactorError) {
      detailsAuthTwoFactorError.textContent = "";
      detailsAuthTwoFactorError.classList.add("is-hidden");
    }
    if (detailsAuthTwoFactorPanel) {
      detailsAuthTwoFactorPanel.hidden = true;
      detailsAuthTwoFactorPanel.classList.add("is-hidden");
    }
    if (detailsAuthForm) {
      detailsAuthForm.hidden = false;
      detailsAuthForm.classList.remove("is-hidden");
    }
    pendingDetailsChallengeToken = "";
    pendingDetailsLoginIdentifier = "";
    if (detailsAuthEmail && !detailsAuthEmail.value.trim() && detailsEmailInput?.value?.trim()) {
      detailsAuthEmail.value = detailsEmailInput.value.trim();
    }
    window.requestAnimationFrame(() => detailsAuthEmail?.focus());
  };

  const closeDetailsAuthModal = () => {
    if (!detailsAuthModal) return;
    detailsAuthModal.hidden = true;
    detailsAuthModal.classList.add("is-hidden");
    if (detailsAuthPassword) detailsAuthPassword.value = "";
    if (detailsAuthModalError) {
      detailsAuthModalError.textContent = "";
      detailsAuthModalError.classList.add("is-hidden");
    }
    if (detailsAuthTwoFactorError) {
      detailsAuthTwoFactorError.textContent = "";
      detailsAuthTwoFactorError.classList.add("is-hidden");
    }
    if (detailsAuthTwoFactorPanel) {
      detailsAuthTwoFactorPanel.hidden = true;
      detailsAuthTwoFactorPanel.classList.add("is-hidden");
    }
    if (detailsAuthForm) {
      detailsAuthForm.hidden = false;
      detailsAuthForm.classList.remove("is-hidden");
    }
    pendingDetailsChallengeToken = "";
    pendingDetailsLoginIdentifier = "";
  };

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

    const daysMarkup = Array.from({ length: getAvailabilityDayCount() }, (_, index) => {
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
      syncVehicleDrivableNotice();
    });
  });
  syncVehicleDrivableNotice();

  detailsEmailInput?.addEventListener("blur", checkBookingDetailsEmail);
  detailsExistingAccountLink?.addEventListener("click", (event) => {
    event.preventDefault();
    openDetailsAuthModal();
  });

  detailsAuthModal?.addEventListener("click", (event) => {
    const closeTrigger = event.target.closest('[data-action="close-details-auth-modal"]');
    if (closeTrigger) {
      closeDetailsAuthModal();
    }
  });

  detailsAuthForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const identifier = String(detailsAuthEmail?.value || "").trim();
    const password = String(detailsAuthPassword?.value || "");

    if (detailsAuthModalError) {
      detailsAuthModalError.textContent = "";
      detailsAuthModalError.classList.add("is-hidden");
    }

    if (!identifier || !password) {
      if (detailsAuthModalError) {
        detailsAuthModalError.textContent = "Enter your email and password.";
        detailsAuthModalError.classList.remove("is-hidden");
      }
      return;
    }

    try {
      const loginResult = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password })
      });

      if (loginResult?.requires_2fa) {
        pendingDetailsChallengeToken = String(loginResult.challenge_token || "");
        pendingDetailsLoginIdentifier = identifier;
        if (detailsAuthTwoFactorMessage) {
          detailsAuthTwoFactorMessage.textContent = loginResult?.message || "Check your email for the verification code.";
        }
        if (detailsAuthModalError) {
          detailsAuthModalError.textContent = "";
          detailsAuthModalError.classList.add("is-hidden");
        }
        if (detailsAuthForm) {
          detailsAuthForm.hidden = true;
          detailsAuthForm.classList.add("is-hidden");
        }
        if (detailsAuthTwoFactorPanel) {
          detailsAuthTwoFactorPanel.hidden = false;
          detailsAuthTwoFactorPanel.classList.remove("is-hidden");
        }
        if (detailsAuthTwoFactorCode) {
          detailsAuthTwoFactorCode.value = "";
          window.requestAnimationFrame(() => detailsAuthTwoFactorCode.focus());
        }
        return;
      }

      setStoredAuthValue("userToken", loginResult.token);
      setStoredAuthValue("userProfile", JSON.stringify(loginResult.user));
      setStoredAuthValue("activeRole", "CUSTOMER");

      const freshUser = await apiAuth("/api/users/me", loginResult.token);
      setStoredAuthValue("userProfile", JSON.stringify(freshUser));
      applyBookingDetailsUserData(freshUser);
      if (detailsEmailInput && !detailsEmailInput.value.trim()) {
        detailsEmailInput.value = identifier;
      }
      closeDetailsAuthModal();
    } catch (err) {
      if (detailsAuthModalError) {
        detailsAuthModalError.textContent =
          err?.error?.message || err?.message || "Unable to sign in with that account.";
        detailsAuthModalError.classList.remove("is-hidden");
      }
    }
  });

  detailsAuthBackToLogin?.addEventListener("click", () => {
    pendingDetailsChallengeToken = "";
    pendingDetailsLoginIdentifier = "";
    if (detailsAuthTwoFactorPanel) {
      detailsAuthTwoFactorPanel.hidden = true;
      detailsAuthTwoFactorPanel.classList.add("is-hidden");
    }
    if (detailsAuthForm) {
      detailsAuthForm.hidden = false;
      detailsAuthForm.classList.remove("is-hidden");
    }
    if (detailsAuthTwoFactorError) {
      detailsAuthTwoFactorError.textContent = "";
      detailsAuthTwoFactorError.classList.add("is-hidden");
    }
    detailsAuthPassword?.focus();
  });

  detailsAuthTwoFactorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = String(detailsAuthTwoFactorCode?.value || "").trim();
    if (!pendingDetailsChallengeToken || !code) {
      if (detailsAuthTwoFactorError) {
        detailsAuthTwoFactorError.textContent = "Enter the verification code sent to your email.";
        detailsAuthTwoFactorError.classList.remove("is-hidden");
      }
      return;
    }

    if (detailsAuthTwoFactorError) {
      detailsAuthTwoFactorError.textContent = "";
      detailsAuthTwoFactorError.classList.add("is-hidden");
    }

    try {
      const loginResult = await api("/api/auth/login/verify-2fa", {
        method: "POST",
        body: JSON.stringify({
          challenge_token: pendingDetailsChallengeToken,
          code
        })
      });

      setStoredAuthValue("userToken", loginResult.token);
      setStoredAuthValue("userProfile", JSON.stringify(loginResult.user));
      setStoredAuthValue("activeRole", "CUSTOMER");

      const freshUser = await apiAuth("/api/users/me", loginResult.token);
      setStoredAuthValue("userProfile", JSON.stringify(freshUser));
      applyBookingDetailsUserData(freshUser);
      if (detailsEmailInput && !detailsEmailInput.value.trim()) {
        detailsEmailInput.value = pendingDetailsLoginIdentifier;
      }
      closeDetailsAuthModal();
    } catch (err) {
      if (detailsAuthTwoFactorError) {
        detailsAuthTwoFactorError.textContent =
          err?.error?.message || err?.message || "Invalid verification code.";
        detailsAuthTwoFactorError.classList.remove("is-hidden");
      }
    }
  });

  detailsAuthResendCode?.addEventListener("click", async () => {
    if (!pendingDetailsChallengeToken) {
      if (detailsAuthTwoFactorError) {
        detailsAuthTwoFactorError.textContent = "No active verification session. Please sign in again.";
        detailsAuthTwoFactorError.classList.remove("is-hidden");
      }
      return;
    }

    detailsAuthResendCode.disabled = true;
    if (detailsAuthTwoFactorError) {
      detailsAuthTwoFactorError.textContent = "";
      detailsAuthTwoFactorError.classList.add("is-hidden");
    }

    try {
      const response = await api("/api/auth/login/resend-2fa", {
        method: "POST",
        body: JSON.stringify({
          challenge_token: pendingDetailsChallengeToken
        })
      });

      pendingDetailsChallengeToken = String(response.challenge_token || pendingDetailsChallengeToken);
      if (detailsAuthTwoFactorMessage) {
        detailsAuthTwoFactorMessage.textContent =
          response?.message || "A new verification code has been sent to your email.";
      }
    } catch (err) {
      if (detailsAuthTwoFactorError) {
        detailsAuthTwoFactorError.textContent =
          err?.error?.message || err?.message || "Unable to resend code.";
        detailsAuthTwoFactorError.classList.remove("is-hidden");
      }
    } finally {
      detailsAuthResendCode.disabled = false;
    }
  });

  const bookingSession = getStoredUserSession();
  if (bookingSession?.activeRole === "CUSTOMER") {
    applyBookingDetailsUserData(bookingSession.user);
    const bookingUserToken = getStoredAuthValue("userToken");
    if (bookingUserToken) {
      apiAuth("/api/users/me", bookingUserToken)
        .then((freshUser) => {
          const storedProfile = getStoredAuthValue("userProfile");
          if (storedProfile) {
            setStoredAuthValue("userProfile", JSON.stringify(freshUser));
          }
          applyBookingDetailsUserData(freshUser);
        })
        .catch(() => {});
    }
  }

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

  window.addEventListener("resize", () => {
    renderAvailabilityCalendar(currentAvailabilityStartDate);
  });

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

