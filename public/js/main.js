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

const homeTopLink = document.querySelector('.home-nav a[href="#top"]');
if (homeTopLink) {
  homeTopLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
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

const addServiceToDraft = async (serviceId) => {
  const sessionId = getSessionId();
  const draft = await api("/api/bookings/draft/items", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, service_id: Number(serviceId) })
  });
  renderWorkSummary(draft);
  renderDraftSummary(draft);
};

const removeServiceFromDraft = async (serviceId) => {
  const sessionId = getSessionId();
  const draft = await api(`/api/bookings/draft/items/${serviceId}?session_id=${encodeURIComponent(sessionId)}`, {
    method: "DELETE"
  });
  renderWorkSummary(draft);
  renderDraftSummary(draft);
};

document.addEventListener("click", (event) => {
  const addBtn = event.target.closest("button.service-add");
  if (addBtn && addBtn.dataset.serviceId) {
    addServiceToDraft(addBtn.dataset.serviceId).catch(() => {});
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

  list.innerHTML = "";
  if (!services || services.length === 0) {
    if (empty) empty.classList.remove("is-hidden");
    return;
  }
  if (empty) empty.classList.add("is-hidden");

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

    if (service.price !== null && service.price !== undefined) {
      const price = document.createElement("div");
      price.className = "work-price";
      price.textContent = `£${Number(service.price).toFixed(2)}`;
      main.appendChild(price);
    }

    const actions = document.createElement("div");
    actions.className = "work-actions";

    const more = document.createElement("a");
    more.href = "#";
    more.textContent = "More info";
    actions.appendChild(more);

    const add = document.createElement("button");
    add.type = "button";
    add.className = "primary service-add";
    add.textContent = "Add";
    add.dataset.serviceId = service.id;
    actions.appendChild(add);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "ghost service-remove";
    remove.textContent = "Remove";
    remove.dataset.serviceId = service.id;
    actions.appendChild(remove);

    li.appendChild(main);
    li.appendChild(actions);
    list.appendChild(li);
  });
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
  const list = document.getElementById("selectedWorkList");
  const empty = document.getElementById("selectedWorkEmpty");
  const subtotalEl = document.getElementById("summarySubtotal");
  const vatEl = document.getElementById("summaryVat");
  const totalEl = document.getElementById("summaryTotal");
  const notesEl = document.getElementById("summaryNotes");
  const drivableEl = document.getElementById("summaryDrivable");
  const availabilityEl = document.getElementById("summaryAvailability");

  if (!list) return;
  list.innerHTML = "";

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
      list.appendChild(row);
    });
  }

  if (subtotalEl) subtotalEl.textContent = `£${Number(draft.subtotal || 0).toFixed(2)}`;
  if (vatEl) vatEl.textContent = `£${Number(draft.vat || 0).toFixed(2)}`;
  if (totalEl) totalEl.textContent = `£${Number(draft.total || 0).toFixed(2)}`;
  if (notesEl) notesEl.textContent = draft.notes ? `Notes: ${draft.notes}` : "No notes yet.";
  if (drivableEl)
    drivableEl.textContent = `Vehicle drivable: ${draft.vehicle_drivable ? draft.vehicle_drivable : "-"}`;
  if (availabilityEl) {
    const slots = (draft.availability || [])
      .filter((day) => day.slots && day.slots.length)
      .map((day) => `${day.day} (${day.weekday}): ${day.slots.join(", ")}`);
    availabilityEl.textContent = slots.length ? slots.join(" | ") : "No availability selected yet.";
  }
};

const renderWorkSummary = (draft) => {
  const list = document.getElementById("selectedWorkListWork");
  const empty = document.getElementById("selectedWorkEmptyWork");
  const totalEl = document.getElementById("summaryTotalWork");
  if (!list) return;

  list.innerHTML = "";
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
        </div>
        <span>£${Number(item.line_total_eur).toFixed(2)}</span>
      `;
      list.appendChild(row);
    });
  }
  if (totalEl) totalEl.textContent = `£${Number(draft.total || 0).toFixed(2)}`;
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
    .then((draft) => renderWorkSummary(draft))
    .catch(() => renderWorkSummary({ items: [], subtotal: 0, vat: 0, total: 0 }));
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
      await api("/api/bookings/draft/pay", {
        method: "POST",
        body: JSON.stringify({ session_id: getSessionId(), provider: "mock", currency: "GBP" })
      });
      window.location.href = "/bookings/confirm";
    } catch (err) {
      alert(err?.error?.message || err?.message || "Payment failed.");
    }
  });
}

const confirmPage = document.getElementById("bookingConfirmPage");
if (confirmPage) {
  const sessionId = getSessionId();
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
    })
    .catch(() => {});
}

const bookingDetailsForm = document.getElementById("bookingDetailsForm");
if (bookingDetailsForm) {
  const errorEl = document.getElementById("bookingDetailsError");
  const toggleButtons = bookingDetailsForm.querySelectorAll(".toggle");
  const slotButtons = bookingDetailsForm.querySelectorAll(".slot");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  slotButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-active");
    });
  });

  bookingDetailsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (errorEl) errorEl.textContent = "";

    const isDrivable = bookingDetailsForm.querySelector(".toggle.is-active")?.textContent?.trim() === "Yes";
    const availability = Array.from(document.querySelectorAll(".availability-day")).map((day) => {
      const dayLabel = day.dataset.day;
      const weekday = day.dataset.weekday;
      const slots = Array.from(day.querySelectorAll(".slot.is-active")).map((slot) => slot.dataset.time);
      return { day: dayLabel, weekday, slots };
    });

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
      await api("/api/bookings/details", {
        method: "POST",
        body: JSON.stringify(payload)
      });
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
  const adminRefreshBtn = document.getElementById("adminRefreshBtn");
  const adminNavLinks = document.querySelectorAll(".admin-nav-link");
  const adminProfileView = document.getElementById("adminProfileView");
  const adminUsersView = document.getElementById("adminUsersView");
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
  };

  const setAdminHeader = (user) => {
    const displayName = user?.full_name || user?.email || "Admin";
    const role = user?.role_name || "ADMIN";
    const initials = getInitials(displayName);
    adminProfileAvatar.textContent = initials;
    adminProfileName.textContent = displayName;
    adminProfileRole.textContent = role;
    adminSettingsAvatar.textContent = initials;
    adminSettingsName.textContent = displayName;
    adminSettingsEmail.textContent = user?.email || "admin@smartworkshop.local";
    adminSettingsEmailDetail.textContent = `Email: ${user?.email || "admin@smartworkshop.local"}`;
    adminSettingsRole.textContent = role;
    adminSettingsPhone.textContent = "Phone: -";
  };

  const setAdminVisibility = (loggedIn) => {
    adminGate.classList.toggle("is-hidden", loggedIn);
    adminApp.classList.toggle("is-hidden", !loggedIn);
    adminLogoutBtn.disabled = !loggedIn;
  };

  const statusCycle = ["Active", "Inactive", "Banned", "Pending", "Suspended"];
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
      const matchesTerm =
        !term ||
        user.full_name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.username || "").toLowerCase().includes(term) ||
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
      const status = getStatus(user, index);
      const statusClass = status.toLowerCase();
      const lastActive = getLastActive(user, index);
      const avatarUrl = getAvatarUrl(user.email);
      row.innerHTML = `
        <td class="table-check">
          <input type="checkbox" aria-label="Select ${user.full_name}" disabled />
        </td>
        <td>
          <div class="user-cell">
            <div class="avatar">
              ${avatarUrl ? `<img src="${avatarUrl}" alt="" />` : getInitials(user.full_name)}
            </div>
            <div class="user-meta">
              <strong>${user.full_name}</strong>
              <span>ID ${user.user_id}</span>
            </div>
          </div>
        </td>
        <td>${user.email}</td>
        <td>${user.username || getUsername(user.email)}</td>
        <td><span class="pill ${statusClass}">${status}</span></td>
        <td><span class="role-chip">${user.role_name}</span></td>
        <td>${formatDate(user.created_at)}</td>
        <td>${lastActive}</td>
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
    setAdminHeader(null);
    setAdminVisibility(false);
  });

  adminNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.view;
      adminNavLinks.forEach((btn) => btn.classList.toggle("active", btn === link));
      adminProfileView.classList.toggle("is-hidden", view !== "profile");
      adminUsersView.classList.toggle("is-hidden", view !== "users");
    });
  });

  adminExportBtn?.addEventListener("click", exportUsers);
  adminRefreshBtn?.addEventListener("click", fetchUsers);
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
      if (result.user.role_name === "ADMIN") {
        window.location.href = "/admin";
        return;
      }
      window.location.href = "/user/dashboard";
    } catch (err) {
      signInError.textContent = err?.error?.message || "Login failed. Check your credentials.";
    }
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
  const userAccountView = document.getElementById("userAccountView");
  const userBookingsView = document.getElementById("userBookingsView");
  const userMotView = document.getElementById("userMotView");
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
    const displayName = user?.full_name || user?.email || "User";
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
    userSettingsPhone.textContent = `Phone: ${user?.phone || "-"}`;
    if (userSettingsAddress) userSettingsAddress.textContent = `Address: ${user?.address || "-"}`;
    if (userSettingsAvatarSettings) setAvatar(userSettingsAvatarSettings, initials, user?.avatar_url);
    if (userSettingsNameSettings) userSettingsNameSettings.textContent = displayName;
    if (userSettingsEmailDetailSettings)
      userSettingsEmailDetailSettings.textContent = `Email: ${user?.email || "-"}`;
    if (userSettingsRoleSettings) userSettingsRoleSettings.textContent = activeRole;
    if (userSettingsPhoneSettings)
      userSettingsPhoneSettings.textContent = `Phone: ${user?.phone || "-"}`;

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
  if (profile) {
    sessionStorage.setItem("activeRole", "CUSTOMER");
    setUserHeader(profile);
  } else {
    window.location.href = "/auth";
  }

  const setUserView = (view) => {
    userAccountView.classList.toggle("is-hidden", view !== "account");
    userBookingsView.classList.toggle("is-hidden", view !== "bookings");
    userMotView.classList.toggle("is-hidden", view !== "mot");
    userSettingsView.classList.toggle("is-hidden", view !== "settings");
  };

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
    window.location.href = "/auth";
  });
}

const mechanicDashboard = document.querySelector(".mechanic-shell");
if (mechanicDashboard) {
  const nameEl = document.getElementById("mechanicWelcomeName");
  const idEl = document.getElementById("mechanicId");
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
      if (nameEl) nameEl.textContent = name;
      if (idEl) {
        const base = (user.uuid_public || user.id || "0000").toString().slice(-4).toUpperCase();
        idEl.textContent = `AG${base}`;
      }
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
