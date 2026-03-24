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

const AUTH_STORAGE_KEYS = ["userToken", "userProfile", "activeRole"];

const syncAuthStateFromLocalStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => {
    const localValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);
    if (localValue !== null && sessionValue !== localValue) {
      sessionStorage.setItem(key, localValue);
    }
  });
};

const getStoredAuthValue = (key) => {
  const localValue = localStorage.getItem(key);
  if (localValue !== null) {
    if (sessionStorage.getItem(key) !== localValue) {
      sessionStorage.setItem(key, localValue);
    }
    return localValue;
  }
  return sessionStorage.getItem(key);
};

const setStoredAuthValue = (key, value) => {
  localStorage.setItem(key, value);
  sessionStorage.setItem(key, value);
};

const removeStoredAuthValue = (key) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

syncAuthStateFromLocalStorage();

const clearStoredSessionData = () => {
  AUTH_STORAGE_KEYS.forEach(removeStoredAuthValue);
};

let sessionExpiryTimer = null;

const isProtectedAppPage = () => /^\/(user|mechanic|admin)(\/|$)/.test(window.location.pathname);

const decodeJwtPayload = (tokenValue) => {
  try {
    const segment = String(tokenValue || "").split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const isTokenExpired = (tokenValue) => {
  const payload = decodeJwtPayload(tokenValue);
  const exp = Number(payload?.exp || 0);
  if (!exp) return false;
  return Date.now() >= exp * 1000;
};

const handleExpiredSession = () => {
  clearStoredSessionData();
  if (isProtectedAppPage()) {
    window.location.replace("/auth/login");
    return;
  }
  window.location.reload();
};

const scheduleSessionExpiry = (tokenValue) => {
  if (sessionExpiryTimer) {
    clearTimeout(sessionExpiryTimer);
    sessionExpiryTimer = null;
  }

  const payload = decodeJwtPayload(tokenValue);
  const exp = Number(payload?.exp || 0);
  if (!exp) return;

  const delay = exp * 1000 - Date.now();
  if (delay <= 0) {
    handleExpiredSession();
    return;
  }

  sessionExpiryTimer = window.setTimeout(() => {
    handleExpiredSession();
  }, delay);
};

const apiAuth = async (path, tokenValue, options = {}) => {
  if (!tokenValue || isTokenExpired(tokenValue)) {
    clearStoredSessionData();
    if (isProtectedAppPage()) {
      window.location.replace("/auth/login");
    }
    throw { error: { code: "AUTH_INVALID", message: "Invalid or expired token" } };
  }

  try {
    return await api(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${tokenValue}`
      }
    });
  } catch (err) {
    const authCode = err?.error?.code;
    if (authCode === "AUTH_INVALID" || authCode === "AUTH_REQUIRED") {
      clearStoredSessionData();
      if (isProtectedAppPage()) {
        window.location.replace("/auth/login");
      }
    }
    throw err;
  }
};

const getStoredUserSession = () => {
  const tokenValue = getStoredAuthValue("userToken");
  if (tokenValue && isTokenExpired(tokenValue)) {
    clearStoredSessionData();
    return null;
  }
  const rawProfile = getStoredAuthValue("userProfile");
  if (!rawProfile) return null;
  try {
    const user = JSON.parse(rawProfile);
    const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : [user?.role_name || user?.role || "CUSTOMER"];
    const activeRole = getStoredAuthValue("activeRole") || (roles.includes("MECHANIC") ? "MECHANIC" : roles.includes("ADMIN") ? "ADMIN" : "CUSTOMER");
    const firstName = String(user?.name || "").trim() || String(user?.email || "Account").trim().split("@")[0];
    return { user, activeRole, firstName };
  } catch {
    return null;
  }
};

const syncStoredProfileFromToken = async () => {
  const tokenValue = getStoredAuthValue("userToken");
  if (!tokenValue) return null;
  if (isTokenExpired(tokenValue)) {
    clearStoredSessionData();
    return null;
  }
  scheduleSessionExpiry(tokenValue);
  try {
    const user = await apiAuth("/api/users/me", tokenValue);
    setStoredAuthValue("userProfile", JSON.stringify(user));
    const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : [user?.role_name || user?.role || "CUSTOMER"];
    const storedRole = getStoredAuthValue("activeRole");
    const normalizedRoles = roles.map((role) => String(role || "").toUpperCase());
    const resolvedRole =
      storedRole && normalizedRoles.includes(storedRole)
        ? storedRole
        : normalizedRoles.includes("MECHANIC")
          ? "MECHANIC"
          : normalizedRoles.includes("ADMIN")
            ? "ADMIN"
            : "CUSTOMER";
    setStoredAuthValue("activeRole", resolvedRole);
    return getStoredUserSession();
  } catch (_err) {
    return null;
  }
};

scheduleSessionExpiry(getStoredAuthValue("userToken"));

window.addEventListener("storage", (event) => {
  if (!AUTH_STORAGE_KEYS.includes(event.key)) return;

  syncAuthStateFromLocalStorage();
  const tokenValue = getStoredAuthValue("userToken");
  if (tokenValue && !isTokenExpired(tokenValue)) {
    scheduleSessionExpiry(tokenValue);
    return;
  }

  if (sessionExpiryTimer) {
    clearTimeout(sessionExpiryTimer);
    sessionExpiryTimer = null;
  }

  if (!tokenValue) {
    if (isProtectedAppPage()) {
      window.location.replace("/auth/login");
      return;
    }
    window.location.reload();
  }
});

const resolveDashboardHref = (activeRole) =>
  activeRole === "MECHANIC"
    ? "/mechanic/dashboard"
    : activeRole === "ADMIN"
      ? "/admin/dashboard"
      : "/user";

const buildMechanicHeaderMenuMarkup = () => `
  <div class="mechanic-header-menu generated-session-menu">
    <button class="mechanic-header-menu-btn" type="button" aria-expanded="false">
      <span class="mechanic-header-first-name"></span>
      <span class="mechanic-header-menu-arrow">▾</span>
    </button>
    <div class="mechanic-header-menu-panel is-hidden">
      <button class="mechanic-header-menu-item" type="button" data-target-view="dashboard">Dashboard</button>
      <button class="mechanic-header-menu-item" type="button" data-target-view="procedure">Procedures</button>
      <button class="mechanic-header-menu-item" type="button" data-target-view="payments">Payments</button>
      <button class="mechanic-header-menu-item" type="button" data-href="/mechanic/dashboard">ClickMechanic app</button>
      <button class="mechanic-header-menu-item" type="button" data-href="/mechanic/dashboard">App guide</button>
      <button class="mechanic-header-menu-item" type="button" data-target-page="profile">Your profile</button>
      <button class="mechanic-header-menu-item" type="button" data-target-page="preferences">Service schedules</button>
      <button class="mechanic-header-menu-item" type="button" data-target-view="settings">Account settings</button>
      <button class="mechanic-header-menu-item" type="button" data-action="logout">Logout</button>
    </div>
  </div>
`;

const buildCustomerHeaderMenuMarkup = () => `
  <div class="customer-header-menu generated-session-menu">
    <button class="customer-header-menu-btn" type="button" aria-expanded="false">
      <span class="customer-header-first-name"></span>
      <span class="customer-header-menu-arrow">▾</span>
    </button>
    <div class="customer-header-menu-panel is-hidden">
      <button class="customer-header-menu-item" type="button" data-view="dashboard">Dashboard</button>
      <button class="customer-header-menu-item" type="button" data-view="account">Account</button>
      <button class="customer-header-menu-item" type="button" data-view="vehicle">Vehicle</button>
      <button class="customer-header-menu-item" type="button" data-view="bookings">Bookings</button>
      <button class="customer-header-menu-item" type="button" data-view="settings">Settings</button>
      <button class="customer-header-menu-item" type="button" data-action="logout">Logout</button>
    </div>
  </div>
`;

const syncGeneralHeaderSessionMenus = () => document.querySelectorAll(".main-header.general-header").forEach((header) => {
  const container = header.querySelector(".body-content, .header-content");
  if (!container) return;
  container.querySelectorAll(".generated-session-menu, .header-session-link.generated-session-link").forEach((node) => node.remove());
  const session = getStoredUserSession();
  if (!session) return;
  if (session.activeRole === "MECHANIC") {
    if (!container.querySelector(".mechanic-header-menu")) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = buildMechanicHeaderMenuMarkup();
      const menu = wrapper.firstElementChild;
      menu.querySelector(".mechanic-header-first-name").textContent = session.firstName.toUpperCase();
      container.appendChild(menu);
    }
    return;
  }
  if (session.activeRole === "CUSTOMER") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildCustomerHeaderMenuMarkup();
    const menu = wrapper.firstElementChild;
    menu.querySelector(".customer-header-first-name").textContent = session.firstName.toUpperCase();
    container.appendChild(menu);
    return;
  }
  const link = document.createElement("a");
  link.className = "header-session-link generated-session-link";
  link.href = resolveDashboardHref(session.activeRole);
  link.textContent = session.firstName;
  container.appendChild(link);
});

const clearStoredSessionAndGoHome = () => {
  clearStoredSessionData();
  window.location.replace("/");
};

const openMechanicTargetPage = (page, user) => {
  const mechanicId = user?.id || "0";
  if (page === "profile") {
    window.location.href = `/mechanic/${mechanicId}/profile`;
    return;
  }
  if (page === "preferences") {
    window.location.href = `/mechanic/${mechanicId}/preferences`;
  }
};

const bindMechanicHeaderMenus = () => document.querySelectorAll(".mechanic-header-menu").forEach((menu) => {
  if (menu.dataset.bound === "true") return;
  menu.dataset.bound = "true";
  const session = getStoredUserSession();
  if (!session || session.activeRole !== "MECHANIC") return;
  const button = menu.querySelector(".mechanic-header-menu-btn");
  const panel = menu.querySelector(".mechanic-header-menu-panel");
  const nameEl = menu.querySelector(".mechanic-header-first-name");
  const items = menu.querySelectorAll(".mechanic-header-menu-item");
  if (nameEl && !nameEl.textContent.trim()) {
    nameEl.textContent = session.firstName.toUpperCase();
  }
  button?.addEventListener("click", () => {
    const isHidden = panel?.classList.contains("is-hidden");
    panel?.classList.toggle("is-hidden", !isHidden);
    button.setAttribute("aria-expanded", isHidden ? "true" : "false");
  });
  items.forEach((item) => {
    item.addEventListener("click", () => {
      panel?.classList.add("is-hidden");
      button?.setAttribute("aria-expanded", "false");
      const action = item.dataset.action || "";
      const href = item.dataset.href || "";
      const targetView = item.dataset.targetView || "";
      const targetPage = item.dataset.targetPage || "";
      if (action === "logout") {
        clearStoredSessionAndGoHome();
        return;
      }
      if (targetPage) {
        openMechanicTargetPage(targetPage, session.user);
        return;
      }
      if (targetView) {
        sessionStorage.setItem("mechanicHeaderTargetView", targetView);
        window.location.href = "/mechanic/dashboard";
        return;
      }
      if (href) {
        window.location.href = href;
      }
    });
  });
  document.addEventListener("click", (event) => {
    if (!panel || !button) return;
    if (menu.contains(event.target)) return;
    panel.classList.add("is-hidden");
    button.setAttribute("aria-expanded", "false");
  });
});

const bindCustomerHeaderMenus = () => document.querySelectorAll(".customer-header-menu").forEach((menu) => {
  if (menu.dataset.bound === "true") return;
  menu.dataset.bound = "true";
  const session = getStoredUserSession();
  if (!session || session.activeRole !== "CUSTOMER") return;
  const button = menu.querySelector(".customer-header-menu-btn");
  const panel = menu.querySelector(".customer-header-menu-panel");
  const nameEl = menu.querySelector(".customer-header-first-name");
  const items = menu.querySelectorAll(".customer-header-menu-item");
  if (nameEl && !nameEl.textContent.trim()) {
    nameEl.textContent = session.firstName.toUpperCase();
  }
  button?.addEventListener("click", () => {
    const isHidden = panel?.classList.contains("is-hidden");
    panel?.classList.toggle("is-hidden", !isHidden);
    button.setAttribute("aria-expanded", isHidden ? "true" : "false");
  });
  items.forEach((item) => {
    item.addEventListener("click", () => {
      panel?.classList.add("is-hidden");
      button?.setAttribute("aria-expanded", "false");
      const action = item.dataset.action || "";
      if (action === "logout") {
        clearStoredSessionAndGoHome();
        return;
      }
      const targetView = item.dataset.view || "dashboard";
      sessionStorage.setItem("userHeaderTargetView", targetView);
      window.location.href = "/user";
    });
  });
  document.addEventListener("click", (event) => {
    if (!panel || !button) return;
    if (menu.contains(event.target)) return;
    panel.classList.add("is-hidden");
    button.setAttribute("aria-expanded", "false");
  });
});

const initHeaderSessionMenus = () => {
  syncGeneralHeaderSessionMenus();
  bindMechanicHeaderMenus();
  bindCustomerHeaderMenus();
};

initHeaderSessionMenus();
const sessionRefreshPromise = syncStoredProfileFromToken().then(() => {
  initHeaderSessionMenus();
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
  const homeSessionLink = document.getElementById("homeSessionLink");
  const homeSessionMenu = document.getElementById("homeSessionMenu");
  const homeSessionMenuBtn = document.getElementById("homeSessionMenuBtn");
  const homeSessionMenuPanel = document.getElementById("homeSessionMenuPanel");
  const homeSessionMenuName = document.getElementById("homeSessionMenuName");
  const applyHeaderState = (isHero) => {
    homeHeader.classList.toggle("is-hero", isHero);
    homeHeader.classList.toggle("is-light", !isHero);
  };

  const syncHomeSessionControls = () => {
    const session = getStoredUserSession();
    if (!homeSessionLink) return;
    if (!session) {
      homeSessionLink.classList.remove("is-hidden");
      if (homeSessionMenu) homeSessionMenu.classList.add("is-hidden");
      homeSessionLink.textContent = "Sign in";
      homeSessionLink.href = "/auth/login";
      return;
    }
    if (session.activeRole === "CUSTOMER" && homeSessionMenu) {
      homeSessionLink.classList.add("is-hidden");
      homeSessionMenu.classList.remove("is-hidden");
      if (homeSessionMenuName) homeSessionMenuName.textContent = session.firstName.toUpperCase();
    } else {
      homeSessionLink.classList.remove("is-hidden");
      if (homeSessionMenu) homeSessionMenu.classList.add("is-hidden");
      homeSessionLink.textContent = session.firstName;
      homeSessionLink.href = resolveDashboardHref(session.activeRole);
    }
  };

  if (homeSessionMenuBtn && !homeSessionMenuBtn.dataset.bound) {
    homeSessionMenuBtn.dataset.bound = "true";
    homeSessionMenuBtn.addEventListener("click", () => {
      const isHidden = homeSessionMenuPanel?.classList.contains("is-hidden");
      homeSessionMenuPanel?.classList.toggle("is-hidden", !isHidden);
      homeSessionMenuBtn.setAttribute("aria-expanded", isHidden ? "true" : "false");
    });
  }

  if (homeSessionMenu && !homeSessionMenu.dataset.bound) {
    homeSessionMenu.dataset.bound = "true";
    homeSessionMenu.querySelectorAll(".home-session-menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        const action = item.dataset.action || "";
        if (action === "logout") {
          homeSessionMenuPanel?.classList.add("is-hidden");
          homeSessionMenuBtn?.setAttribute("aria-expanded", "false");
          clearStoredSessionData();
          window.location.replace("/");
          return;
        }
        const targetView = item.dataset.view || "dashboard";
        homeSessionMenuPanel?.classList.add("is-hidden");
        homeSessionMenuBtn?.setAttribute("aria-expanded", "false");
        homeSessionMenu
          .querySelectorAll(".home-session-menu-item")
          .forEach((btn) => btn.classList.toggle("is-active", btn === item));
        sessionStorage.setItem("homeUserTargetView", targetView);
        window.location.href = "/user";
      });
    });
    document.addEventListener("click", (event) => {
      if (!homeSessionMenu.contains(event.target)) {
        homeSessionMenuPanel?.classList.add("is-hidden");
        homeSessionMenuBtn?.setAttribute("aria-expanded", "false");
      }
    });
  }

  syncHomeSessionControls();
  sessionRefreshPromise.then(syncHomeSessionControls);

  if (homeSessionMenu) {
    homeSessionMenu.querySelectorAll(".home-session-menu-item").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.view === "dashboard");
    });
  }

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

  try {
    const storedVehicle = sessionStorage.getItem("vehicleEnquiry");
    const storedData = storedVehicle ? JSON.parse(storedVehicle) : null;
    const params = new URLSearchParams(window.location.search);
    const storedReg = storedData?.registrationNumber || params.get("reg") || "";
    const storedPostcode = storedData?.postcode || params.get("postcode") || "";

    if (regInput && storedReg && !regInput.value) {
      regInput.value = String(storedReg).toUpperCase();
    }
    if (postcodeInput && storedPostcode && !postcodeInput.value) {
      postcodeInput.value = String(storedPostcode).toUpperCase();
    }
  } catch (_error) {
    // Ignore malformed stored vehicle data and let the user enter details manually.
  }

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
    window.location.href = "/bookings/vehicle";
  });
}

renderVehicleSummary();

const applicationJoin = document.getElementById("applicationJoin");
if (applicationJoin) {
  const formWrap = document.getElementById("applicationForm");
  const hero = document.querySelector(".applicationJoin-layout");
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
      formWrap?.scrollIntoView({ behavior: "smooth", block: "center" });
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

const applicationForm = document.querySelector(".applicationForm-layout2");
if (applicationForm) {
  const websiteRadios = applicationForm.querySelectorAll('input[name="has_website"]');
  const websiteField = applicationForm.querySelector(".business-website-field");
  const businessTypeRadios = applicationForm.querySelectorAll('input[name="business_type"]');
  const serviceCheckboxes = applicationForm.querySelectorAll('input[name="services"]');
  const specialistCheckboxes = applicationForm.querySelectorAll('input[name="specialist_services"]');
  const premisesField = applicationForm.querySelector(".business-premises");
  const specialistOtherField = applicationForm.querySelector(".business-specialist-other");
  const syncWebsiteField = () => {
    const selected = applicationForm.querySelector('input[name="has_website"]:checked')?.value;
    websiteField?.classList.toggle("is-hidden", selected !== "yes");
  };
  const syncPremisesField = () => {
    const selectedBusinessType = applicationForm.querySelector('input[name="business_type"]:checked')?.value;
    const selectedServices = Array.from(serviceCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const hasGarageType =
      selectedBusinessType === "garage_based_mechanic" ||
      selectedBusinessType === "garage_and_mobile_mechanic";
    const hasPremisesService =
      selectedServices.includes("customer_drop") ||
      selectedServices.includes("collection_delivery");
    const shouldShow = hasGarageType || hasPremisesService;
    premisesField?.classList.toggle("is-hidden", !shouldShow);
  };
  const syncSpecialistOtherField = () => {
    const hasOther = Array.from(specialistCheckboxes).some((checkbox) => checkbox.checked && checkbox.value === "other");
    specialistOtherField?.classList.toggle("is-hidden", !hasOther);
  };
  websiteRadios.forEach((radio) => radio.addEventListener("change", syncWebsiteField));
  businessTypeRadios.forEach((radio) => radio.addEventListener("change", syncPremisesField));
  serviceCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", syncPremisesField));
  specialistCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", syncSpecialistOtherField));
  syncWebsiteField();
  syncPremisesField();
  syncSpecialistOtherField();

  applicationForm.addEventListener("submit", () => {
    sessionStorage.setItem("fromApplication", "1");
    const ensureHiddenInput = (name, value) => {
      let input = applicationForm.querySelector(`input[type="hidden"][name="${name}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        applicationForm.prepend(input);
      }
      input.value = value || "";
    };
    const stored = sessionStorage.getItem("mechanicLead");
    if (stored) {
      try {
        const lead = JSON.parse(stored);
        ensureHiddenInput("first_name", lead.first_name);
        ensureHiddenInput("last_name", lead.last_name);
        ensureHiddenInput("email", lead.email);
        ensureHiddenInput("phone", lead.phone);
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
let bookingCatalogSearchTerm = "";

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

const workLayout = document.querySelector(".workType-layout2[data-service-category]");
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

  cardNumberInput?.addEventListener("input", () => {
    const digitsOnly = String(cardNumberInput.value || "").replace(/\D+/g, "").slice(0, 16);
    const grouped = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
    cardNumberInput.value = grouped;
  });

  cardNameInput?.addEventListener("input", () => {
    const lettersOnly = String(cardNameInput.value || "").replace(/[^A-Za-z\s]/g, "");
    cardNameInput.value = lettersOnly.replace(/\s{2,}/g, " ");
  });

  expiryInput?.addEventListener("input", () => {
    const digitsOnly = String(expiryInput.value || "").replace(/\D+/g, "").slice(0, 4);
    if (digitsOnly.length <= 2) {
      expiryInput.value = digitsOnly;
      return;
    }
    expiryInput.value = `${digitsOnly.slice(0, 2)} / ${digitsOnly.slice(2)}`;
  });

  cvcInput?.addEventListener("input", () => {
    cvcInput.value = String(cvcInput.value || "").replace(/\D+/g, "").slice(0, 4);
  });

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

    if (!/^\d{16}$/.test(cardNumber)) {
      if (paymentFormError) paymentFormError.textContent = "Please enter a valid card number.";
      return;
    }

    if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry)) {
      if (paymentFormError) paymentFormError.textContent = "Please enter expiry date as MM / YY.";
      return;
    }

    const [monthText] = expiry.split("/").map((value) => value.trim());
    const month = Number(monthText);
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      if (paymentFormError) paymentFormError.textContent = "Please enter a valid expiry month.";
      return;
    }

    if (!/^\d{3,4}$/.test(cvc)) {
      if (paymentFormError) paymentFormError.textContent = "Please enter a 3 or 4 digit security code.";
      return;
    }

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
  minimumAvailabilityDate.setDate(minimumAvailabilityDate.getDate() + 1);
  let currentAvailabilityStartDate = new Date(minimumAvailabilityDate);
  const availabilitySelections = new Map();

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

  const getAdminToken = () => getStoredAuthValue("userToken");
  const getAdminProfile = () => {
    const stored = getStoredAuthValue("userProfile");
    return stored ? JSON.parse(stored) : null;
  };
  const clearAdminSession = () => {
    clearStoredSessionData();
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
      setStoredAuthValue("userToken", result.token);
      setStoredAuthValue("userProfile", JSON.stringify(result.user));
      const rawRoles = Array.isArray(result.user?.roles) && result.user.roles.length
        ? result.user.roles
        : [result.user?.role_name || "CUSTOMER"];
      const roles = rawRoles.map((role) => String(role || "").toUpperCase());
      const hasCustomerRole = roles.includes("CUSTOMER") || roles.includes("USER");
      const hasMechanicRole = roles.includes("MECHANIC");

      if (roles.includes("ADMIN")) {
        setStoredAuthValue("activeRole", "ADMIN");
        window.location.href = "/admin";
        return;
      }
      if (hasMechanicRole && hasCustomerRole) {
        window.location.href = "/auth/select-role";
        return;
      }
      if (hasMechanicRole) {
        setStoredAuthValue("activeRole", "MECHANIC");
        window.location.href = "/mechanic/dashboard";
        return;
      }
      setStoredAuthValue("activeRole", "CUSTOMER");
      window.location.href = "/user/dashboard";
    } catch (err) {
      signInError.textContent = err?.error?.message || "Login failed. Check your credentials.";
    }
  });
}

const rolePickerButtons = document.querySelectorAll("[data-role-target]");
if (rolePickerButtons.length) {
  const storedProfile = getStoredAuthValue("userProfile");
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
      setStoredAuthValue("activeRole", "MECHANIC");
      window.location.replace("/mechanic/dashboard");
    } else {
      setStoredAuthValue("activeRole", "CUSTOMER");
      window.location.replace("/user/dashboard");
    }
  }

  rolePickerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetRole = String(button.getAttribute("data-role-target") || "").toUpperCase();
      if (targetRole === "MECHANIC") {
        setStoredAuthValue("activeRole", "MECHANIC");
        window.location.href = "/mechanic/dashboard";
        return;
      }
      setStoredAuthValue("activeRole", "CUSTOMER");
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
  const userSettingsPhoneValueSettings = document.getElementById("userSettingsPhoneValueSettings");
  const userSettingsUsernameValueSettings = document.getElementById("userSettingsUsernameValueSettings");
  const userSettingsEmailValueSettings = document.getElementById("userSettingsEmailValueSettings");
  const userSettingsAddressValueSettings = document.getElementById("userSettingsAddressValueSettings");
  const userSettingsEditButtons = document.querySelectorAll("[data-settings-field]");
  const userSettingsEditModal = document.getElementById("userSettingsEditModal");
  const userSettingsEditTitle = document.getElementById("userSettingsEditTitle");
  const userSettingsEditDescription = document.getElementById("userSettingsEditDescription");
  const userSettingsEditLabel = document.getElementById("userSettingsEditLabel");
  const userSettingsEditInput = document.getElementById("userSettingsEditInput");
  const userSettingsNameGrid = document.getElementById("userSettingsNameGrid");
  const userSettingsEditFirstName = document.getElementById("userSettingsEditFirstName");
  const userSettingsEditMiddleName = document.getElementById("userSettingsEditMiddleName");
  const userSettingsEditLastName = document.getElementById("userSettingsEditLastName");
  const userSettingsAddressGrid = document.getElementById("userSettingsAddressGrid");
  const userSettingsEditAddressLine1 = document.getElementById("userSettingsEditAddressLine1");
  const userSettingsEditAddressLine2 = document.getElementById("userSettingsEditAddressLine2");
  const userSettingsEditCity = document.getElementById("userSettingsEditCity");
  const userSettingsEditPostcode = document.getElementById("userSettingsEditPostcode");
  const userSettingsEditMessage = document.getElementById("userSettingsEditMessage");
  const userSettingsEditSave = document.getElementById("userSettingsEditSave");
  const userSettingsEditCancel = document.getElementById("userSettingsEditCancel");
  const userSettingsEditClose = document.getElementById("userSettingsEditClose");
  const userRoleSwitcher = document.getElementById("userRoleSwitcher");
  const userSettingsPhotoButton = document.getElementById("userSettingsPhotoButton");
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
  const userSecurityPasswordForm = document.getElementById("userSecurityPasswordForm");
  const userSecurityOldPassword = document.getElementById("userSecurityOldPassword");
  const userSecurityNewPassword = document.getElementById("userSecurityNewPassword");
  const userSecurityConfirmPassword = document.getElementById("userSecurityConfirmPassword");
  const userSecurityPasswordMessage = document.getElementById("userSecurityPasswordMessage");
  const userSecurity2faEmail = document.getElementById("userSecurity2faEmail");
  const userSecurity2faSms = document.getElementById("userSecurity2faSms");
  const userSecurity2faEnable = document.getElementById("userSecurity2faEnable");
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
  const userResolutionView = document.getElementById("userResolutionView");
  const userBookingsList = document.getElementById("userBookingsList");
  const userBookingsWelcomeSection = document.querySelector("#userBookingsView .bookings-section--welcome");
  const userBookingsCardSection = document.querySelector("#userBookingsView .bookings-section--card");
  const userResolutionOverview = document.getElementById("userResolutionOverview");
  const userResolutionFilterTabs = document.querySelectorAll("#userResolutionOverview [data-user-resolution-filter]");
  const userResolutionCasesTable = document.getElementById("userResolutionCasesTable");
  const userResolutionMessageView = document.getElementById("userResolutionMessageView");
  const userResolutionBackBtn = document.getElementById("userResolutionBackBtn");
  const userResolutionDetailTitle = document.getElementById("userResolutionDetailTitle");
  const userResolutionIssue = document.getElementById("userResolutionIssue");
  const userResolutionNotice = document.getElementById("userResolutionNotice");
  const userResolutionGoToCase = document.getElementById("userResolutionGoToCase");
  const userResolutionComplaintComposer = document.getElementById("userResolutionComplaintComposer");
  const userResolutionComplaintCopy = document.getElementById("userResolutionComplaintCopy");
  const userResolutionComplaintInput = document.getElementById("userResolutionComplaintInput");
  const userResolutionComplaintSendBtn = document.getElementById("userResolutionComplaintSendBtn");
  const userResolutionCaseListTitle = document.getElementById("userResolutionCaseListTitle");
  const userResolutionBookingCasesTable = document.getElementById("userResolutionBookingCasesTable");
  const userResolutionCaseView = document.getElementById("userResolutionCaseView");
  const userResolutionCaseBackBtn = document.getElementById("userResolutionCaseBackBtn");
  const userResolutionCaseTitle = document.getElementById("userResolutionCaseTitle");
  const userResolutionMessages = document.getElementById("userResolutionMessages");
  const userResolutionMessageInput = document.getElementById("userResolutionMessageInput");
  const userResolutionSendBtn = document.getElementById("userResolutionSendBtn");
  const userResolutionSidebarTitle = document.getElementById("userResolutionSidebarTitle");
  const userResolutionSidebarMechanic = document.getElementById("userResolutionSidebarMechanic");
  const userResolutionSidebarCar = document.getElementById("userResolutionSidebarCar");
  const userResolutionSidebarAddress = document.getElementById("userResolutionSidebarAddress");
  const userResolutionSidebarWork = document.getElementById("userResolutionSidebarWork");
  const userResolutionSidebarTotal = document.getElementById("userResolutionSidebarTotal");
  const userSettingsView = document.getElementById("userSettingsView");

  const getInitials = (name) => {
    if (!name) return "NA";
    const parts = name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((part) => part[0]).join("");
    return initials.toUpperCase();
  };

  const getUserProfile = () => {
    const stored = getStoredAuthValue("userProfile");
    return stored ? JSON.parse(stored) : null;
  };

  const clearUserSession = () => {
    clearStoredSessionData();
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
    const stored = getStoredAuthValue("activeRole");
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
    if (userSettingsPhoneValueSettings) userSettingsPhoneValueSettings.textContent = user?.phone || "-";
    if (userSettingsUsernameValueSettings) userSettingsUsernameValueSettings.textContent = user?.username || "-";
    if (userSettingsEmailValueSettings) userSettingsEmailValueSettings.textContent = user?.email || "-";
    if (userSettingsAddressValueSettings) userSettingsAddressValueSettings.textContent = user?.address || "-";
    if (userDashboardName) userDashboardName.textContent = displayName;
    userWelcomeNames.forEach((element) => {
      element.textContent = displayName;
    });
    if (userSettingsPhoneInput) userSettingsPhoneInput.value = "";
    if (userSettingsUsernameInput) userSettingsUsernameInput.value = "";
    if (userSettingsEmailInput) userSettingsEmailInput.value = "";
    if (userSettingsAddressInput) userSettingsAddressInput.value = "";

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
        setStoredAuthValue("activeRole", userRoleSwitcher.value);
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

  const settingsFieldConfig = {
    full_name: {
      label: "Full name",
      description: "Update the full name shown in your profile.",
      type: "text",
      getValue: (user) => user?.full_name || [user?.name, user?.lastname].filter(Boolean).join(" ").trim(),
      isNameField: true
    },
    phone: {
      label: "Phone",
      description: "Update your phone number.",
      type: "text",
      getValue: (user) => user?.phone || ""
    },
    username: {
      label: "Username",
      description: "Update your username.",
      type: "text",
      getValue: (user) => user?.username || ""
    },
    email: {
      label: "Email",
      description: "Request an email change confirmation.",
      type: "email",
      getValue: (user) => user?.email || ""
    },
    address: {
      label: "Address",
      description: "Update your address.",
      type: "text",
      getValue: (user) => user?.address || "",
      isAddressField: true
    }
  };

  let activeSettingsField = "";

  const closeSettingsEditModal = () => {
    activeSettingsField = "";
    userSettingsEditModal?.classList.add("is-hidden");
    if (userSettingsEditMessage) userSettingsEditMessage.textContent = "";
    if (userSettingsEditInput) userSettingsEditInput.value = "";
    if (userSettingsEditFirstName) userSettingsEditFirstName.value = "";
    if (userSettingsEditMiddleName) userSettingsEditMiddleName.value = "";
    if (userSettingsEditLastName) userSettingsEditLastName.value = "";
    if (userSettingsEditAddressLine1) userSettingsEditAddressLine1.value = "";
    if (userSettingsEditAddressLine2) userSettingsEditAddressLine2.value = "";
    if (userSettingsEditCity) userSettingsEditCity.value = "";
    if (userSettingsEditPostcode) userSettingsEditPostcode.value = "";
  };

  const openSettingsEditModal = (field) => {
    const config = settingsFieldConfig[field];
    const profileData = getUserProfile() || {};
    if (!config || !userSettingsEditModal || !userSettingsEditInput) return;
    activeSettingsField = field;
    if (userSettingsEditTitle) userSettingsEditTitle.textContent = `Update ${config.label}`;
    if (userSettingsEditDescription) userSettingsEditDescription.textContent = config.description;
    if (userSettingsNameGrid) userSettingsNameGrid.classList.toggle("is-hidden", !config.isNameField);
    if (userSettingsAddressGrid) userSettingsAddressGrid.classList.toggle("is-hidden", !config.isAddressField);
    if (userSettingsEditInput?.parentElement) userSettingsEditInput.parentElement.classList.toggle("is-hidden", !!config.isNameField);
    if (userSettingsEditInput?.parentElement && config.isAddressField) {
      userSettingsEditInput.parentElement.classList.add("is-hidden");
    }
    if (config.isNameField) {
      if (userSettingsEditFirstName) userSettingsEditFirstName.value = profileData?.name || "";
      const lastNameParts = String(profileData?.lastname || "").trim().split(/\s+/).filter(Boolean);
      if (userSettingsEditLastName) userSettingsEditLastName.value = lastNameParts.pop() || "";
      if (userSettingsEditMiddleName) userSettingsEditMiddleName.value = lastNameParts.join(" ");
    } else if (config.isAddressField) {
      const addressDetails = profileData?.address_details || {};
      if (userSettingsEditAddressLine1) userSettingsEditAddressLine1.value = addressDetails.line1 || "";
      if (userSettingsEditAddressLine2) userSettingsEditAddressLine2.value = addressDetails.line2 || "";
      if (userSettingsEditCity) userSettingsEditCity.value = addressDetails.city || "";
      if (userSettingsEditPostcode) userSettingsEditPostcode.value = addressDetails.postal_code || "";
    } else {
      if (userSettingsEditLabel) userSettingsEditLabel.textContent = config.label;
      userSettingsEditInput.type = config.type || "text";
      userSettingsEditInput.value = config.getValue(profileData) || "";
    }
    if (userSettingsEditMessage) userSettingsEditMessage.textContent = "";
    userSettingsEditModal.classList.remove("is-hidden");
    if (config.isNameField) {
      userSettingsEditFirstName?.focus();
      userSettingsEditFirstName?.select();
    } else if (config.isAddressField) {
      userSettingsEditAddressLine1?.focus();
      userSettingsEditAddressLine1?.select();
    } else {
      userSettingsEditInput.focus();
      userSettingsEditInput.select();
    }
  };

  const profile = getUserProfile();
  const userToken = getStoredAuthValue("userToken");
  if (profile) {
    setStoredAuthValue("activeRole", "CUSTOMER");
    setUserHeader(profile);
    if (userToken) {
      apiAuth("/api/users/me", userToken)
        .then((freshProfile) => {
          setStoredAuthValue("userProfile", JSON.stringify(freshProfile));
          setUserHeader(freshProfile);
        })
        .catch(() => {});
    }
  } else {
    window.location.href = "/";
  }

  const setUserView = (view) => {
    userDashboardView.classList.toggle("is-hidden", view !== "dashboard");
    userAccountView.classList.toggle("is-hidden", view !== "account");
    userVehicleView.classList.toggle("is-hidden", view !== "vehicle");
    userBookingsView.classList.toggle("is-hidden", view !== "bookings");
    userResolutionView?.classList.toggle("is-hidden", view !== "resolution");
    userSettingsView.classList.toggle("is-hidden", view !== "settings");

    if (view === "resolution") {
      setUserResolutionSubview("overview");
    } else if (view === "bookings") {
      userBookingsWelcomeSection?.classList.remove("is-hidden");
      userBookingsCardSection?.classList.remove("is-hidden");
    }
  };

  const setActiveUserNav = (view) => {
    userNavLinks.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
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

    if (userQuickQuoteReg) userQuickQuoteReg.value = "";
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
      return;
    }

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
          <div class="user-booking-actions-wrap">
            <button class="primary user-booking-actions" type="button" data-booking-actions-toggle="${booking.id}">Actions</button>
            <div class="user-booking-actions-panel is-hidden">
              <button class="user-booking-actions-item" type="button" data-user-resolution-message="${booking.id}">
                Resolution center
              </button>
            </div>
          </div>
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
        <div class="user-booking-photos-inline">
          <h4>Photos</h4>
          <p>No booking photos available.</p>
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
      latestUserBookings = Array.isArray(bookings) ? bookings : [];
      await syncUserResolutionOverview();
    } catch (_err) {
      renderUserBookings([]);
      latestUserBookings = [];
      renderUserResolutionCaseRows(userResolutionCasesTable, []);
    }
  };

  const formatBookingReference = (value) => String(Number(value) || 0).padStart(8, "0");
  const formatResolutionReference = (value, bookingId) => {
    if (value) {
      const rawValue = String(value).trim();
      const parts = rawValue.split("/");
      if (parts.length === 2) {
        return `${formatBookingReference(parts[0])}/${parts[1]}`;
      }
      return rawValue;
    }
    if (!bookingId) return "-";
    return `${formatBookingReference(bookingId)}/1`;
  };

  let latestUserBookings = [];
  let latestUserResolutionCases = [];
  let pendingUserResolutionBookingId = null;
  let pendingUserResolutionCaseId = null;
  let pendingUserResolutionOrigin = "bookings";
  let activeUserResolutionFilter = "all";

  const formatUserResolutionDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const getUserResolutionCaseType = () => {
    const selectedOption = userResolutionIssue?.selectedOptions?.[0];
    return selectedOption?.dataset.caseType || "general";
  };

  const getUserResolutionIssueValue = () => String(userResolutionIssue?.value || "message_mechanic");

  const getUserResolutionComplaintCopy = (issueValue, mechanicName) => {
    const safeMechanicName = mechanicName || "your mechanic";
    const messages = {
      mechanic_late: `We're sorry to hear that ${safeMechanicName} is late for the arranged arrival time. Please give us details of any correspondence you have had with ${safeMechanicName} until now.`,
      workmanship_problem: `Please tell us what problem you have experienced with the workmanship and include any details that will help us review the issue.`,
      charged_more_than_agreed: `Please explain why you believe you have been charged more than agreed and include any quote or amount you were originally given.`,
      charged_for_unagreed_work: `Please describe the work you believe was carried out without your agreement and include any relevant details or messages.`,
      mechanic_cancelled: `Please tell us how the mechanic cancelled your booking and include any messages or calls you have received.`,
      other_problem: "Please describe the problem in as much detail as possible so we can review it."
    };
    return messages[issueValue] || "";
  };

  const syncUserResolutionIssueUi = () => {
    const issueValue = getUserResolutionIssueValue();
    const isComplaint = getUserResolutionCaseType() === "complaint";
    const booking = latestUserBookings.find((entry) => Number(entry.id) === Number(pendingUserResolutionBookingId));
    const mechanicName = booking?.mechanic || "your mechanic";
    userResolutionNotice?.classList.toggle("is-hidden", isComplaint);
    userResolutionGoToCase?.classList.toggle("is-hidden", isComplaint);
    userResolutionComplaintComposer?.classList.toggle("is-hidden", !isComplaint);
    if (userResolutionComplaintCopy) {
      userResolutionComplaintCopy.textContent = isComplaint ? getUserResolutionComplaintCopy(issueValue, mechanicName) : "";
    }
  };

  const setUserResolutionSubview = (view) => {
    const isOverview = view === "overview";
    const isMessage = view === "message";
    const isCase = view === "case";
    userBookingsCardSection?.classList.toggle("is-hidden", isMessage || isCase);
    userResolutionOverview?.classList.toggle("is-hidden", !isOverview);
    userResolutionMessageView?.classList.toggle("is-hidden", !isMessage);
    userResolutionCaseView?.classList.toggle("is-hidden", !isCase);
    if (isMessage || isCase) {
      userBookingsView?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const renderUserResolutionCaseRows = (target, cases) => {
    if (!target) return;
    target.innerHTML = "";
    if (!Array.isArray(cases) || !cases.length) return;
    cases.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "mechanic-resolution-table-row";
      row.innerHTML = `
        <span class="mechanic-resolution-status">${String(entry.subject || entry.type || "General enquiry").toUpperCase()}</span>
        <span>${formatResolutionReference(entry.reference, entry.booking_id)}</span>
        <span>${formatUserResolutionDateTime(entry.updated_at)}</span>
        <span>${entry.subject || "-"}</span>
        <button class="mechanic-resolution-link" type="button" data-user-resolution-case-id="${entry.id}">View</button>
      `;
      target.appendChild(row);
    });
  };

  const applyUserResolutionFilter = () => {
    const filteredCases = activeUserResolutionFilter === "all"
      ? latestUserResolutionCases
      : latestUserResolutionCases.filter((entry) => String(entry.type || "").toLowerCase() === activeUserResolutionFilter);
    renderUserResolutionCaseRows(userResolutionCasesTable, filteredCases);
  };

  const syncUserResolutionOverview = async () => {
    if (!userToken || !userResolutionCasesTable) return;
    try {
      const cases = await apiAuth("/api/users/me/resolution-cases", userToken);
      latestUserResolutionCases = Array.isArray(cases) ? cases : [];
      applyUserResolutionFilter();
      userResolutionOverview?.classList.toggle("is-hidden", !latestUserResolutionCases.length);
    } catch (_err) {
      latestUserResolutionCases = [];
      renderUserResolutionCaseRows(userResolutionCasesTable, []);
      userResolutionOverview?.classList.add("is-hidden");
    }
  };

  const openUserResolutionMessage = async (bookingId, type = "general") => {
    pendingUserResolutionOrigin = "bookings";
    pendingUserResolutionBookingId = Number(bookingId);
    pendingUserResolutionCaseId = null;
    if (userResolutionIssue) {
      const matchingOption = Array.from(userResolutionIssue.options).find((option) => (option.dataset.caseType || "general") === type);
      userResolutionIssue.value = matchingOption?.value || userResolutionIssue.value;
    }
    const booking = latestUserBookings.find((entry) => Number(entry.id) === Number(bookingId));
    const reference = booking?.reference || formatBookingReference(bookingId);
    if (userResolutionDetailTitle) {
      userResolutionDetailTitle.textContent = `Message mechanic regarding booking #${reference}`;
    }
    if (userResolutionCaseListTitle) {
      userResolutionCaseListTitle.textContent = `Resolution cases already created for booking #${reference}`;
    }
    const cases = await apiAuth(`/api/users/me/resolution-cases?booking_id=${encodeURIComponent(bookingId)}`, userToken);
    const bookingCases = Array.isArray(cases) ? cases : [];
    renderUserResolutionCaseRows(userResolutionBookingCasesTable, bookingCases);
    if (userResolutionNotice) {
      userResolutionNotice.textContent = bookingCases.some((entry) => entry.type === type && entry.status === "open")
        ? "You already have an open dialog for this issue type."
        : "No case has been created for this booking yet.";
    }
    if (userResolutionComplaintInput) userResolutionComplaintInput.value = "";
    syncUserResolutionIssueUi();
    setUserResolutionSubview("message");
  };

  const renderUserResolutionCaseDetail = (detail) => {
    pendingUserResolutionCaseId = detail?.id || null;
    pendingUserResolutionBookingId = detail?.booking?.id || detail?.booking_id || null;
    if (userResolutionCaseTitle) userResolutionCaseTitle.textContent = detail?.subject || "General Enquiry";
    if (userResolutionSidebarTitle) {
      userResolutionSidebarTitle.textContent = `Current status of booking #${detail?.booking?.reference || (detail?.booking_id ? formatBookingReference(detail.booking_id) : "-")}`;
    }
    if (userResolutionSidebarMechanic) userResolutionSidebarMechanic.textContent = detail?.mechanic?.name || "-";
    if (userResolutionSidebarCar) {
      userResolutionSidebarCar.textContent = [detail?.vehicle?.make, detail?.vehicle?.model, detail?.vehicle?.registrationNumber].filter(Boolean).join(" · ") || "-";
    }
    if (userResolutionSidebarAddress) {
      userResolutionSidebarAddress.textContent = [detail?.address?.line1, detail?.address?.line2, detail?.address?.city, detail?.address?.postal_code].filter(Boolean).join(", ") || "-";
    }
    if (userResolutionSidebarWork) {
      userResolutionSidebarWork.textContent = (detail?.items || []).map((item) => item.name).join(", ") || "-";
    }
    if (userResolutionSidebarTotal) {
      userResolutionSidebarTotal.textContent = formatCurrency(detail?.booking?.total_eur, "GBP");
    }
    if (userResolutionMessages) {
      userResolutionMessages.innerHTML = "";
      (detail?.messages || []).forEach((message) => {
        const item = document.createElement("div");
        item.className = `mechanic-resolution-message ${message.sender_role === "customer" ? "is-customer" : "is-mechanic"}`;
        item.innerHTML = `
          <div class="mechanic-resolution-bubble">${String(message.body || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</div>
          <span class="mechanic-resolution-message-meta">${message.sender_name || "User"}, ${formatUserResolutionDateTime(message.created_at)}</span>
        `;
        userResolutionMessages.appendChild(item);
      });
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

  userBookingsList?.addEventListener("click", async (event) => {
    const toggle = event.target.closest("[data-booking-actions-toggle]");
    if (toggle) {
      const panel = toggle.parentElement?.querySelector(".user-booking-actions-panel");
      const shouldOpen = panel?.classList.contains("is-hidden");
      userBookingsList.querySelectorAll(".user-booking-actions-panel").forEach((item) => item.classList.add("is-hidden"));
      if (panel && shouldOpen) panel.classList.remove("is-hidden");
      return;
    }

    const resolutionMessage = event.target.closest("[data-user-resolution-message]");
    if (resolutionMessage) {
      const bookingId = Number(resolutionMessage.dataset.userResolutionMessage);
      if (!bookingId) return;
      userBookingsList.querySelectorAll(".user-booking-actions-panel").forEach((item) => item.classList.add("is-hidden"));
      pendingUserResolutionOrigin = "resolution";
      setUserView("resolution");
      setActiveUserNav("resolution");
      await openUserResolutionMessage(bookingId, "general");
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".user-car-menu-wrap")) {
      document.querySelectorAll(".user-car-menu-panel").forEach((menu) => menu.classList.add("is-hidden"));
    }

    if (!event.target.closest(".user-booking-actions-wrap")) {
      userBookingsList?.querySelectorAll(".user-booking-actions-panel").forEach((menu) => menu.classList.add("is-hidden"));
    }

    if (!event.target.closest(".user-vehicle-heading")) {
      userVehicleDropdownMenu?.classList.add("is-hidden");
    }
  });

  userVehicleDropdownBtn?.addEventListener("click", () => {
    userVehicleDropdownMenu?.classList.toggle("is-hidden");
  });

  userVehicleTitle?.addEventListener("click", () => {
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

  setUserResolutionSubview("overview");

  userNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.view;
      setActiveUserNav(view);
      setUserView(view);
    });
  });

  const initialUserView = sessionStorage.getItem("userHeaderTargetView") || sessionStorage.getItem("homeUserTargetView");
  if (initialUserView && ["dashboard", "account", "vehicle", "bookings", "resolution", "settings"].includes(initialUserView)) {
    setUserView(initialUserView);
    setActiveUserNav(initialUserView);
    sessionStorage.removeItem("userHeaderTargetView");
    sessionStorage.removeItem("homeUserTargetView");
  }

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

  userResolutionBackBtn?.addEventListener("click", () => {
    if (pendingUserResolutionOrigin === "resolution") {
      setUserView("resolution");
      setActiveUserNav("resolution");
      setUserResolutionSubview("overview");
      return;
    }
    setUserResolutionSubview("overview");
  });

  userResolutionCaseBackBtn?.addEventListener("click", async () => {
    if (pendingUserResolutionOrigin === "resolution") {
      setUserView("resolution");
      setActiveUserNav("resolution");
      setUserResolutionSubview("overview");
      return;
    }
    if (pendingUserResolutionBookingId) {
      await openUserResolutionMessage(pendingUserResolutionBookingId, getUserResolutionCaseType());
      return;
    }
    setUserResolutionSubview("overview");
  });

  userResolutionGoToCase?.addEventListener("click", async () => {
    if (!pendingUserResolutionBookingId || !userToken) return;
    const detail = await apiAuth("/api/users/me/resolution-cases", userToken, {
      method: "POST",
      body: JSON.stringify({
        booking_id: pendingUserResolutionBookingId,
        type: getUserResolutionCaseType()
      })
    });
    await syncUserResolutionOverview();
    renderUserResolutionCaseDetail(detail);
    setUserResolutionSubview("case");
  });

  userResolutionIssue?.addEventListener("change", () => {
    syncUserResolutionIssueUi();
  });

  userResolutionComplaintSendBtn?.addEventListener("click", async () => {
    const body = String(userResolutionComplaintInput?.value || "").trim();
    if (!body || !pendingUserResolutionBookingId || !userToken) return;
    const detail = await apiAuth("/api/users/me/resolution-cases", userToken, {
      method: "POST",
      body: JSON.stringify({
        booking_id: pendingUserResolutionBookingId,
        type: getUserResolutionCaseType()
      })
    });
    const updatedDetail = await apiAuth(`/api/users/me/resolution-cases/${encodeURIComponent(detail.id)}/messages`, userToken, {
      method: "POST",
      body: JSON.stringify({ body })
    });
    if (userResolutionComplaintInput) userResolutionComplaintInput.value = "";
    await syncUserResolutionOverview();
    renderUserResolutionCaseDetail(updatedDetail);
    setUserResolutionSubview("case");
  });

  userResolutionCasesTable?.addEventListener("click", async (event) => {
    const viewButton = event.target.closest("[data-user-resolution-case-id]");
    if (!viewButton || !userToken) return;
    const detail = await apiAuth(`/api/users/me/resolution-cases/${encodeURIComponent(viewButton.dataset.userResolutionCaseId)}`, userToken);
    pendingUserResolutionOrigin = "resolution";
    setUserView("resolution");
    setActiveUserNav("resolution");
    renderUserResolutionCaseDetail(detail);
    setUserResolutionSubview("case");
  });

  userResolutionFilterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeUserResolutionFilter = tab.dataset.userResolutionFilter || "all";
      userResolutionFilterTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      applyUserResolutionFilter();
    });
  });

  userResolutionBookingCasesTable?.addEventListener("click", async (event) => {
    const viewButton = event.target.closest("[data-user-resolution-case-id]");
    if (!viewButton || !userToken) return;
    const detail = await apiAuth(`/api/users/me/resolution-cases/${encodeURIComponent(viewButton.dataset.userResolutionCaseId)}`, userToken);
    renderUserResolutionCaseDetail(detail);
    setUserResolutionSubview("case");
  });

  userResolutionSendBtn?.addEventListener("click", async () => {
    const body = String(userResolutionMessageInput?.value || "").trim();
    if (!pendingUserResolutionCaseId || !body || !userToken) return;
    const detail = await apiAuth(`/api/users/me/resolution-cases/${encodeURIComponent(pendingUserResolutionCaseId)}/messages`, userToken, {
      method: "POST",
      body: JSON.stringify({ body })
    });
    if (userResolutionMessageInput) userResolutionMessageInput.value = "";
    renderUserResolutionCaseDetail(detail);
    await syncUserResolutionOverview();
  });

  userQuickQuoteBtn?.addEventListener("click", () => {
    const selectedType = userQuickQuoteProduct?.value || "";
    if (!selectedType) {
      return;
    }
    window.location.href = `/bookings/work/?type=${encodeURIComponent(selectedType)}`;
  });

  settingsSubnavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.subview;
      settingsSubnavLinks.forEach((btn) => btn.classList.toggle("active", btn === link));
      setSettingsSubview(view);
    });
  });

  const syncSecurity2faButton = () => {
    const hasSelection = Boolean(userSecurity2faEmail?.checked || userSecurity2faSms?.checked);
    userSecurity2faEnable?.classList.toggle("is-active", hasSelection);
    if (userSecurity2faEnable) userSecurity2faEnable.disabled = !hasSelection;
  };

  userSecurity2faEmail?.addEventListener("change", syncSecurity2faButton);
  userSecurity2faSms?.addEventListener("change", syncSecurity2faButton);
  syncSecurity2faButton();

  userSecurityPasswordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = getStoredAuthValue("userToken");
    const oldPassword = userSecurityOldPassword?.value || "";
    const newPassword = userSecurityNewPassword?.value || "";
    const confirmPassword = userSecurityConfirmPassword?.value || "";
    if (userSecurityPasswordMessage) userSecurityPasswordMessage.textContent = "";

    if (!oldPassword || !newPassword || !confirmPassword) {
      if (userSecurityPasswordMessage) {
        userSecurityPasswordMessage.textContent = "Please complete all password fields.";
      }
      return;
    }
    if (newPassword !== confirmPassword) {
      if (userSecurityPasswordMessage) {
        userSecurityPasswordMessage.textContent = "New password and confirmation must match.";
      }
      return;
    }

    try {
      const result = await apiAuth("/api/users/me/change-password", token, {
        method: "POST",
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });
      if (userSecurityPasswordMessage) {
        userSecurityPasswordMessage.textContent = result?.message || "Password updated.";
      }
      if (userSecurityOldPassword) userSecurityOldPassword.value = "";
      if (userSecurityNewPassword) userSecurityNewPassword.value = "";
      if (userSecurityConfirmPassword) userSecurityConfirmPassword.value = "";
    } catch (err) {
      if (userSecurityPasswordMessage) {
        userSecurityPasswordMessage.textContent =
          err?.error?.message || err?.message || "Unable to change password.";
      }
    }
  });

  userSettingsEditButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openSettingsEditModal(button.dataset.settingsField || "");
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeSettingsEditModal);
  });

  userSettingsEditCancel?.addEventListener("click", closeSettingsEditModal);
  userSettingsEditClose?.addEventListener("click", closeSettingsEditModal);

  userSettingsEditSave?.addEventListener("click", async () => {
    const token = getStoredAuthValue("userToken");
    const field = activeSettingsField;
    const config = settingsFieldConfig[field];
    const value = userSettingsEditInput?.value?.trim() || "";
    if (!token || !config) return;
    if (userSettingsEditMessage) userSettingsEditMessage.textContent = "";

    try {
      if (config.isNameField) {
        const firstName = userSettingsEditFirstName?.value?.trim() || "";
        const middleName = userSettingsEditMiddleName?.value?.trim() || "";
        const lastName = userSettingsEditLastName?.value?.trim() || "";
        if (!firstName || !lastName) {
          throw { message: "First name and Last name are required, Middle name is optional" };
        }
        const payload = await apiAuth("/api/users/me", token, {
          method: "PATCH",
          body: JSON.stringify({
            name: firstName,
            lastname: [middleName, lastName].filter(Boolean).join(" ")
          })
        });
        setStoredAuthValue("userProfile", JSON.stringify(payload));
        setUserHeader(payload);
        closeSettingsEditModal();
        return;
      }

      if (config.isAddressField) {
        const line1 = userSettingsEditAddressLine1?.value?.trim() || "";
        const line2 = userSettingsEditAddressLine2?.value?.trim() || "";
        const city = userSettingsEditCity?.value?.trim() || "";
        const postal_code = userSettingsEditPostcode?.value?.trim() || "";
        if (!line1 || !city || !postal_code) {
          throw { message: "Address line 1, City and PostCode are required." };
        }
        const payload = await apiAuth("/api/users/me", token, {
          method: "PATCH",
          body: JSON.stringify({
            address: { line1, line2, city, postal_code }
          })
        });
        setStoredAuthValue("userProfile", JSON.stringify(payload));
        setUserHeader(payload);
        closeSettingsEditModal();
        return;
      }

      if (!value) {
        throw { message: `${config.label} is required.` };
      }

      if (field === "email") {
        const payload = await apiAuth("/api/users/me/email-change", token, {
          method: "POST",
          body: JSON.stringify({ email: value })
        });
        if (userSettingsEditMessage) {
          userSettingsEditMessage.textContent = payload?.message || "Confirmation email sent.";
        }
        return;
      }

      const patchPayload = { [field]: value };
      const payload = await apiAuth("/api/users/me", token, {
        method: "PATCH",
        body: JSON.stringify(patchPayload)
      });
      setStoredAuthValue("userProfile", JSON.stringify(payload));
      setUserHeader(payload);
      closeSettingsEditModal();
    } catch (err) {
      if (userSettingsEditMessage) {
        userSettingsEditMessage.textContent = err?.error?.message || err?.message || "Unable to update this field.";
      }
    }
  });

  userSettingsContactSave?.addEventListener("click", async () => {
    if (!userSettingsPhoneInput || !userSettingsEmailInput || !userSettingsAddressInput) return;
    const token = getStoredAuthValue("userToken");
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
        setStoredAuthValue("userProfile", JSON.stringify(payload));
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
    const token = getStoredAuthValue("userToken");
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
      setStoredAuthValue("userProfile", JSON.stringify(payload));
      setUserHeader(payload);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      event.target.value = "";
    }
  });

  userSettingsPhotoButton?.addEventListener("click", () => {
    userSettingsPhotoInput?.click();
  });

  userLogoutBtn?.addEventListener("click", () => {
    clearUserSession();
    window.location.replace("/");
  });
}

const mechanicDashboard = document.getElementById("mechanicPage") || document.querySelector(".mechanic-shell");
if (mechanicDashboard) {
  const mechanicBackBtn = document.getElementById("mechanicBackBtn");
  const mechanicLogoutBtn = document.getElementById("mechanicLogoutBtn");
  const mechanicNavLinks = mechanicDashboard.querySelectorAll(".rail-nav .rail-item[data-view]");
  const mechanicSubnavLinks = mechanicDashboard.querySelectorAll(".mechanic-subnav .settings-subnav-link[data-view]");
  const mechanicDashboardView = document.getElementById("mechanicDashboardView");
  const mechanicResolutionCenterView = document.getElementById("mechanicResolutionCenterView");
  const mechanicProcedureView = document.getElementById("mechanicProcedureView");
  const mechanicPaymentsView = document.getElementById("mechanicPaymentsView");
  const mechanicProfileView = document.getElementById("mechanicProfileView");
  const mechanicAccountView = document.getElementById("mechanicAccountView");
  const mechanicPictureView = document.getElementById("mechanicPictureView");
  const mechanicCertificationsView = document.getElementById("mechanicCertificationsView");
  const mechanicTaxView = document.getElementById("mechanicTaxView");
  const mechanicDocumentsView = document.getElementById("mechanicDocumentsView");
  const mechanicPreferencesView = document.getElementById("mechanicPreferencesView");
  const mechanicTypesView = document.getElementById("mechanicTypesView");
  const mechanicSettingsView = document.getElementById("mechanicSettingsView");
  const nameEl = document.getElementById("mechanicWelcomeName");
  const mechanicAccountName = document.getElementById("mechanicAccountName");
  const idEl = document.getElementById("mechanicId");
  const mechanicBookingsList = document.getElementById("mechanicBookingsList");
  const mechanicAccountAvatar = document.getElementById("mechanicAccountAvatar");
  const mechanicAccountAvatarSecondary = document.getElementById("mechanicAccountAvatarSecondary");
  const mechanicAccountPhone = document.getElementById("mechanicAccountPhone");
  const mechanicAccountPhoneSecondary = document.getElementById("mechanicAccountPhoneSecondary");
  const mechanicAccountEmail = document.getElementById("mechanicAccountEmail");
  const mechanicAccountEmailSecondary = document.getElementById("mechanicAccountEmailSecondary");
  const mechanicAccountUsername = document.getElementById("mechanicAccountUsername");
  const mechanicAccountUsernameSecondary = document.getElementById("mechanicAccountUsernameSecondary");
  const mechanicAccountAddress = document.getElementById("mechanicAccountAddress");
  const mechanicAccountAddressSecondary = document.getElementById("mechanicAccountAddressSecondary");
  const mechanicAccountRole = document.getElementById("mechanicAccountRole");
  const mechanicAccountRoleSecondary = document.getElementById("mechanicAccountRoleSecondary");
  const mechanicProfileAvatar = document.getElementById("mechanicProfileAvatar");
  const mechanicProfileHeading = document.getElementById("mechanicProfileHeading");
  const mechanicProfileRatings = document.getElementById("mechanicProfileRatings");
  const mechanicProfileExperience = document.getElementById("mechanicProfileExperience");
  const mechanicProfileActiveSince = document.getElementById("mechanicProfileActiveSince");
  const mechanicProfileJobsCompleted = document.getElementById("mechanicProfileJobsCompleted");
  const mechanicProfileQualifications = document.getElementById("mechanicProfileQualifications");
  const mechanicProfileMemberships = document.getElementById("mechanicProfileMemberships");
  const mechanicProfileBaseLocation = document.getElementById("mechanicProfileBaseLocation");
  const mechanicProfilePostcode = document.getElementById("mechanicProfilePostcode");
  const mechanicProfileRadius = document.getElementById("mechanicProfileRadius");
  const mechanicProfileServiceType = document.getElementById("mechanicProfileServiceType");
  const mechanicProfileMapEl = document.getElementById("mechanicProfileMap");
  const mechanicEditProfileView = document.getElementById("mechanicEditProfileView");
  const mechanicEditYears = document.getElementById("mechanicEditYears");
  const mechanicEditWorkHistory = document.getElementById("mechanicEditWorkHistory");
  const mechanicEditContactLine1 = document.getElementById("mechanicEditContactLine1");
  const mechanicEditContactLine2 = document.getElementById("mechanicEditContactLine2");
  const mechanicEditContactCity = document.getElementById("mechanicEditContactCity");
  const mechanicEditContactPostcode = document.getElementById("mechanicEditContactPostcode");
  const mechanicEditPremisesLine1 = document.getElementById("mechanicEditPremisesLine1");
  const mechanicEditPremisesLine2 = document.getElementById("mechanicEditPremisesLine2");
  const mechanicEditPremisesCity = document.getElementById("mechanicEditPremisesCity");
  const mechanicEditPremisesPostcode = document.getElementById("mechanicEditPremisesPostcode");
  const mechanicEditPremisesFields = document.getElementById("mechanicEditPremisesFields");
  const mechanicEditTravelRadius = document.getElementById("mechanicEditTravelRadius");
  const mechanicEditMobileService = document.getElementById("mechanicEditMobileService");
  const mechanicEditCustomerDropoff = document.getElementById("mechanicEditCustomerDropoff");
  const mechanicEditCollectionDelivery = document.getElementById("mechanicEditCollectionDelivery");
  const mechanicEditSameAddress = document.getElementById("mechanicEditSameAddress");
  const mechanicEditProfileForm = document.getElementById("mechanicEditProfileForm");
  const mechanicEditProfileError = document.getElementById("mechanicEditProfileError");
  const mechanicTypesTree = document.getElementById("mechanicTypesTree");
  const mechanicTypesSaveBtn = document.getElementById("mechanicTypesSaveBtn");
  const mechanicTypesStatus = document.getElementById("mechanicTypesStatus");
  const mechanicSettingsWelcomeName = document.getElementById("mechanicSettingsWelcomeName");
  const mechanicSettingsFullName = document.getElementById("mechanicSettingsFullName");
  const mechanicSettingsPhone = document.getElementById("mechanicSettingsPhone");
  const mechanicSettingsUsername = document.getElementById("mechanicSettingsUsername");
  const mechanicSettingsEmail = document.getElementById("mechanicSettingsEmail");
  const mechanicSettingsAddress = document.getElementById("mechanicSettingsAddress");
  const mechanicResolutionOverview = document.getElementById("mechanicResolutionOverview");
  const mechanicResolutionMessageView = document.getElementById("mechanicResolutionMessageView");
  const mechanicResolutionBackBtn = document.getElementById("mechanicResolutionBackBtn");
  const mechanicResolutionDetailTitle = document.getElementById("mechanicResolutionDetailTitle");
  const mechanicResolutionCasesTable = document.getElementById("mechanicResolutionCasesTable");
  const mechanicResolutionBookings = document.getElementById("mechanicResolutionBookings");
  const mechanicResolutionNotice = document.getElementById("mechanicResolutionNotice");
  const mechanicResolutionGoToCase = document.getElementById("mechanicResolutionGoToCase");
  const mechanicResolutionCaseListTitle = document.getElementById("mechanicResolutionCaseListTitle");
  const mechanicResolutionBookingCasesTable = document.getElementById("mechanicResolutionBookingCasesTable");
  const mechanicResolutionIssue = document.getElementById("mechanicResolutionIssue");
  const mechanicResolutionCaseView = document.getElementById("mechanicResolutionCaseView");
  const mechanicResolutionCaseBackBtn = document.getElementById("mechanicResolutionCaseBackBtn");
  const mechanicResolutionCaseTitle = document.getElementById("mechanicResolutionCaseTitle");
  const mechanicResolutionMessages = document.getElementById("mechanicResolutionMessages");
  const mechanicResolutionMessageInput = document.getElementById("mechanicResolutionMessageInput");
  const mechanicResolutionSendBtn = document.getElementById("mechanicResolutionSendBtn");
  const mechanicResolutionSidebarTitle = document.getElementById("mechanicResolutionSidebarTitle");
  const mechanicResolutionSidebarCustomer = document.getElementById("mechanicResolutionSidebarCustomer");
  const mechanicResolutionSidebarCar = document.getElementById("mechanicResolutionSidebarCar");
  const mechanicResolutionSidebarAddress = document.getElementById("mechanicResolutionSidebarAddress");
  const mechanicResolutionSidebarWork = document.getElementById("mechanicResolutionSidebarWork");
  const mechanicResolutionSidebarTotal = document.getElementById("mechanicResolutionSidebarTotal");
  const mechanicSettingsSubnavLinks = mechanicDashboard.querySelectorAll("[data-mechanic-settings-subview]");
  const mechanicSettingsGeneral = document.getElementById("mechanicSettingsGeneral");
  const mechanicSettingsNotifications = document.getElementById("mechanicSettingsNotifications");
  const mechanicSettingsSecurity = document.getElementById("mechanicSettingsSecurity");
  const mechanicSecurity2faEnable = document.getElementById("mechanicSecurity2faEnable");
  const editLink = document.getElementById("mechanicEditProfile");
  const viewLink = document.getElementById("mechanicViewProfile");
  const passwordCard = document.getElementById("mechanicSetPasswordCard");
  const passwordForm = document.getElementById("setMechanicPasswordForm");
  const passwordEmail = document.getElementById("mechanicPasswordEmail");
  const passwordError = document.getElementById("mechanicPasswordError");
  const profile = getStoredAuthValue("userProfile");
  let latestMechanicCoverage = [];
  let latestMechanicResolutionCases = [];
  let latestMechanicAssignedBookings = [];
  let pendingResolutionBookingId = null;
  let pendingResolutionCaseId = null;
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
      if (mechanicAccountName) mechanicAccountName.textContent = name;
      if (idEl) {
        const base = (user.uuid_public || user.id || "0000").toString().slice(-4).toUpperCase();
        idEl.textContent = `AG${base}`;
      }
      if (mechanicAccountAvatar) mechanicAccountAvatar.textContent = initials;
      if (mechanicAccountAvatarSecondary) mechanicAccountAvatarSecondary.textContent = initials;
      if (mechanicAccountPhone) mechanicAccountPhone.textContent = `Phone: ${user?.phone || "-"}`;
      if (mechanicAccountPhoneSecondary) mechanicAccountPhoneSecondary.textContent = `Phone: ${user?.phone || "-"}`;
      if (mechanicAccountEmail) mechanicAccountEmail.textContent = `Email: ${user?.email || "-"}`;
      if (mechanicAccountEmailSecondary) mechanicAccountEmailSecondary.textContent = `Email: ${user?.email || "-"}`;
      if (mechanicAccountUsername) mechanicAccountUsername.textContent = `Username: ${user?.username || "-"}`;
      if (mechanicAccountUsernameSecondary) mechanicAccountUsernameSecondary.textContent = `Username: ${user?.username || "-"}`;
      if (mechanicAccountAddress) mechanicAccountAddress.textContent = `Address: ${user?.address || "-"}`;
      if (mechanicAccountAddressSecondary) mechanicAccountAddressSecondary.textContent = `Address: ${user?.address || "-"}`;
      if (mechanicAccountRole) mechanicAccountRole.textContent = activeRole;
      if (mechanicAccountRoleSecondary) mechanicAccountRoleSecondary.textContent = activeRole;
      if (mechanicSettingsWelcomeName) mechanicSettingsWelcomeName.textContent = name;
      if (mechanicSettingsFullName) mechanicSettingsFullName.textContent = name;
      if (mechanicSettingsPhone) mechanicSettingsPhone.textContent = user?.phone || "-";
      if (mechanicSettingsUsername) mechanicSettingsUsername.textContent = user?.username || "-";
      if (mechanicSettingsEmail) mechanicSettingsEmail.textContent = user?.email || "-";
      if (mechanicSettingsAddress) mechanicSettingsAddress.textContent = user?.address || "-";
      if (mechanicProfileHeading) {
        const location = user?.address_details?.city || user?.address || "Surrey";
        mechanicProfileHeading.textContent = `${name}, ${location}`;
      }
      if (mechanicProfileRatings) mechanicProfileRatings.textContent = "(0 ratings)";
      if (mechanicProfileExperience) mechanicProfileExperience.textContent = "5 years professional experience";
      if (mechanicProfileActiveSince) mechanicProfileActiveSince.textContent = "Active since February 2026";
      if (mechanicProfileJobsCompleted) mechanicProfileJobsCompleted.textContent = "0 jobs completed";
      if (mechanicProfileBaseLocation) mechanicProfileBaseLocation.textContent = user?.address_details?.city || user?.address || "Surrey";
      if (mechanicProfilePostcode) mechanicProfilePostcode.textContent = user?.address_details?.postal_code || "-";
      if (mechanicProfileRadius) mechanicProfileRadius.textContent = "5 miles";
      if (mechanicProfileServiceType) mechanicProfileServiceType.textContent = "Mobile mechanic";
      if (mechanicProfileAvatar) mechanicProfileAvatar.textContent = initials || "ME";
      if (mechanicProfileQualifications) {
        mechanicProfileQualifications.innerHTML = "<li>NVQ Level 3 Qualified</li>";
      }
      if (mechanicProfileMemberships) {
        mechanicProfileMemberships.innerHTML = "<li>No memberships added yet</li>";
      }
      if (mechanicEditContactCity) mechanicEditContactCity.value = user?.address_details?.city || "";
      if (mechanicEditContactPostcode) mechanicEditContactPostcode.value = user?.address_details?.postal_code || "";
      if (mechanicEditMobileService) mechanicEditMobileService.checked = true;
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

  mechanicBackBtn?.addEventListener("click", () => {
    window.location.href = "/auth/select-role";
  });

  mechanicLogoutBtn?.addEventListener("click", () => {
    clearStoredSessionData();
    window.location.replace("/");
  });

  const mechanicToken = getStoredAuthValue("userToken");
  let mechanicProfileMap = null;
  let latestMechanicProfile = null;
  const formatMonthYear = (value) => {
    if (!value) return "February 2026";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "February 2026";
    return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  };
  const formatMechanicCurrency = (value) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(value || 0));
  const formatMechanicAddress = (address) =>
    [address?.line1, address?.line2, address?.city, address?.postal_code].filter(Boolean).join(", ");
  const formatMechanicLabour = (minutes) => {
    const totalMinutes = Number(minutes || 0);
    if (!totalMinutes) return "Estimated labour not available";
    const hours = totalMinutes / 60;
    return `Estimated labour: ${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`;
  };
  const formatMechanicDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
	  const renderMechanicOffers = (offers) => {
    if (!mechanicBookingsList) return;
    mechanicBookingsList.innerHTML = "";
    if (!Array.isArray(offers) || !offers.length) {
      const empty = document.createElement("p");
      empty.className = "mechanic-bookings-empty";
      empty.textContent = "No booking offers received yet.";
      mechanicBookingsList.appendChild(empty);
      return;
    }

	    offers.forEach((offer) => {
	      const card = document.createElement("article");
	      card.className = "mechanic-booking-card";
	      const topStatus = offer.status === "accepted" ? "ACCEPTED" : offer.status === "pending" ? "PENDING" : String(offer.status || "").toUpperCase();
	      const customerName = offer.customer?.name || "Customer";
	      const itemsMarkup = (offer.items || [])
        .map(
          (item) => `
            <div class="mechanic-booking-item">
              <strong>${item.name}</strong>
              <span>${formatMechanicLabour(item.labour_minutes)}</span>
            </div>
          `
        )
        .join("");
	      const canRespond = offer.status === "pending";
	      card.innerHTML = `
	        <div class="mechanic-booking-topbar">
	          <span class="mechanic-booking-topbar-status" data-status="${offer.status}">${topStatus}</span>
	          <span class="mechanic-booking-topbar-reference">Reference: ${offer.booking?.reference || offer.booking?.id || "-"}</span>
	            <div class="mechanic-booking-topbar-menu">
	              <button class="mechanic-booking-topbar-actions" type="button" data-booking-actions-toggle>Actions</button>
	              <div class="mechanic-booking-actions-panel is-hidden">
	                <button class="mechanic-booking-actions-item" type="button" data-resolution-message="${offer.booking?.reference || offer.booking?.id || "-"}">Message to Customer</button>
	              </div>
	            </div>
	        </div>
	        <div class="mechanic-booking-card-head">
	          <div class="mechanic-booking-meta">
	            <h4>${offer.customer?.name || "Customer"}</h4>
	          </div>
	        </div>
        <div class="mechanic-booking-grid">
          <div><strong>Vehicle</strong><div>${[offer.vehicle?.registrationNumber, offer.vehicle?.make, offer.vehicle?.model].filter(Boolean).join(" · ") || "-"}</div></div>
          <div><strong>Total</strong><div>${formatMechanicCurrency(offer.booking?.total_eur)}</div></div>
          <div><strong>Address</strong><div>${formatMechanicAddress(offer.address) || "-"}</div></div>
          <div><strong>Customer</strong><div>${offer.customer?.email || "-"}</div></div>
        </div>
        <div class="mechanic-booking-items">${itemsMarkup || '<div class="mechanic-booking-item"><strong>No work items</strong></div>'}</div>
        <div class="mechanic-booking-actions">
          ${canRespond ? `<button class="primary" type="button" data-offer-action="accept" data-offer-id="${offer.offer_id}">Accept</button>
          <button class="secondary" type="button" data-offer-action="decline" data-offer-id="${offer.offer_id}">Decline</button>` : ""}
        </div>
      `;
      mechanicBookingsList.appendChild(card);
    });
  };
  const syncMechanicOffers = async () => {
    if (!mechanicToken || !mechanicBookingsList) return;
    try {
      const offers = await apiAuth("/api/users/me/mechanic-offers", mechanicToken);
      renderMechanicOffers(offers);
    } catch {
      renderMechanicOffers([]);
    }
  };

  const renderMechanicProfileMap = (profileData) => {
    if (!mechanicProfileMapEl) return;
    const lat = Number(profileData?.address?.lat);
    const lng = Number(profileData?.address?.lng);
    const radiusMiles = Number(profileData?.travel_radius_miles || 5);
    const geoapifyKey = String(mechanicProfileMapEl.dataset.geoapifyKey || "").trim();
    const geoapifyStyle = String(mechanicProfileMapEl.dataset.geoapifyStyle || "osm-carto").trim() || "osm-carto";

    if (!window.L || !Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) {
      mechanicProfileMapEl.innerHTML =
        '<div class="map-placeholder">Map unavailable. Save a valid address to generate your coverage area.</div>';
      return;
    }

    if (mechanicProfileMap) {
      mechanicProfileMap.remove();
      mechanicProfileMap = null;
    }

    mechanicProfileMapEl.innerHTML = "";
    mechanicProfileMap = window.L.map(mechanicProfileMapEl, {
      zoomControl: true,
      scrollWheelZoom: false
    });

    const tileUrl = geoapifyKey
      ? `https://maps.geoapify.com/v1/tile/${encodeURIComponent(geoapifyStyle)}/{z}/{x}/{y}.png?apiKey=${encodeURIComponent(geoapifyKey)}`
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    const tileOptions = geoapifyKey
      ? {
          attribution: "&copy; OpenStreetMap contributors &copy; Geoapify",
          maxZoom: 20
        }
      : {
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 20
        };
    const tileLayer = window.L.tileLayer(tileUrl, tileOptions);
    tileLayer.on("tileerror", () => {
      mechanicProfileMapEl.insertAdjacentHTML(
        "beforeend",
        '<div class="map-placeholder map-placeholder--overlay">Map tiles failed to load.</div>'
      );
    });
    tileLayer.addTo(mechanicProfileMap);

    const center = [lat, lng];
    const radiusMeters = Math.max(radiusMiles, 1) * 1609.34;
    mechanicProfileMap.setView(center, 11);
    window.L.marker(center).addTo(mechanicProfileMap);
    window.L.circle(center, {
      radius: radiusMeters,
      color: "#4da3ff",
      weight: 2,
      fillColor: "#4da3ff",
      fillOpacity: 0.2
    }).addTo(mechanicProfileMap);
    setTimeout(() => mechanicProfileMap?.invalidateSize(), 80);
  };

  const syncMechanicProfile = async () => {
    if (!mechanicToken) return;
    try {
      const profileData = await apiAuth("/api/users/me/mechanic-profile", mechanicToken);
      latestMechanicProfile = profileData;
      if (mechanicProfileHeading) {
        mechanicProfileHeading.textContent = `${profileData.name || "Mechanic"}, ${profileData.location || "Surrey"}`;
      }
      if (mechanicProfileRatings) {
        const rating = Number(profileData.rating || 0);
        mechanicProfileRatings.textContent = rating > 0 ? `(${rating.toFixed(1)} rating)` : "(0 ratings)";
      }
      if (mechanicProfileExperience) {
        const years = Number(profileData.years_experience || 0);
        mechanicProfileExperience.textContent = years
          ? `${years} ${years === 1 ? "year" : "years"} professional experience`
          : "Professional experience not added yet";
      }
      if (mechanicProfileActiveSince) {
        mechanicProfileActiveSince.textContent = `Active since ${formatMonthYear(profileData.created_at)}`;
      }
      if (mechanicProfileJobsCompleted) {
        const jobsDone = Number(profileData.jobs_done || 0);
        mechanicProfileJobsCompleted.textContent = `${jobsDone} ${jobsDone === 1 ? "job" : "jobs"} completed`;
      }
      if (mechanicProfileBaseLocation) {
        mechanicProfileBaseLocation.textContent = profileData.location || "Surrey";
      }
      if (mechanicProfilePostcode) {
        mechanicProfilePostcode.textContent = profileData.address?.postal_code || "-";
      }
      if (mechanicProfileRadius) {
        const radius = Number(profileData.travel_radius_miles || 0);
        mechanicProfileRadius.textContent = radius ? `${radius} miles` : "Not set";
      }
      if (mechanicProfileServiceType) {
        mechanicProfileServiceType.textContent = profileData.is_mobile ? "Mobile mechanic" : "Workshop service";
      }
      if (mechanicProfileAvatar) {
        if (profileData.avatar_url) {
          mechanicProfileAvatar.innerHTML = `<img src="${profileData.avatar_url}" alt="Profile photo">`;
        } else {
          const initials = String(profileData.name || "ME")
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0] || "")
            .join("")
            .toUpperCase() || "ME";
          mechanicProfileAvatar.textContent = initials;
        }
      }
      if (mechanicProfileQualifications) {
        const qualifications = Array.isArray(profileData.qualifications) && profileData.qualifications.length
          ? profileData.qualifications
          : ["Qualifications not added yet"];
        mechanicProfileQualifications.innerHTML = qualifications.map((item) => `<li>${item}</li>`).join("");
      }
      if (mechanicProfileMemberships) {
        const memberships = Array.isArray(profileData.memberships) && profileData.memberships.length
          ? profileData.memberships
          : ["No memberships added yet"];
        mechanicProfileMemberships.innerHTML = memberships.map((item) => `<li>${item}</li>`).join("");
      }
      if (mechanicEditYears) mechanicEditYears.value = profileData.years_experience || "";
      if (mechanicEditWorkHistory) mechanicEditWorkHistory.value = profileData.work_history || "";
      if (mechanicEditContactLine1) mechanicEditContactLine1.value = profileData.address?.line1 || "";
      if (mechanicEditContactLine2) mechanicEditContactLine2.value = profileData.address?.line2 || "";
      if (mechanicEditContactCity) mechanicEditContactCity.value = profileData.address?.city || "";
      if (mechanicEditContactPostcode) mechanicEditContactPostcode.value = profileData.address?.postal_code || "";
      if (mechanicEditPremisesLine1) mechanicEditPremisesLine1.value = profileData.premises_address?.line1 || "";
      if (mechanicEditPremisesLine2) mechanicEditPremisesLine2.value = profileData.premises_address?.line2 || "";
      if (mechanicEditPremisesCity) mechanicEditPremisesCity.value = profileData.premises_address?.city || "";
      if (mechanicEditPremisesPostcode) mechanicEditPremisesPostcode.value = profileData.premises_address?.postal_code || "";
      if (mechanicEditTravelRadius) mechanicEditTravelRadius.value = profileData.travel_radius_miles || "";
      if (mechanicEditMobileService) mechanicEditMobileService.checked = Boolean(profileData.is_mobile);
      if (mechanicEditCustomerDropoff) {
        mechanicEditCustomerDropoff.checked = (profileData.services_offered || []).includes("customer_drop_off");
      }
      if (mechanicEditCollectionDelivery) {
        mechanicEditCollectionDelivery.checked = (profileData.services_offered || []).includes("collection_and_delivery");
      }
      renderMechanicProfileMap(profileData);
    } catch {}
  };

  const flattenCoverageSelection = () => {
    if (!Array.isArray(latestMechanicCoverage)) return [];
    return latestMechanicCoverage.flatMap((group) =>
      (group.subcategories || []).flatMap((subcategory) =>
        (subcategory.services || []).filter((service) => service.selected).map((service) => service.id)
      )
    );
  };

  const renderMechanicCoverage = (coverageTree) => {
    latestMechanicCoverage = Array.isArray(coverageTree) ? coverageTree : [];
    if (!mechanicTypesTree) return;
    mechanicTypesTree.innerHTML = "";

    latestMechanicCoverage.forEach((group, groupIndex) => {
      const groupSelected = (group.subcategories || []).every((subcategory) =>
        (subcategory.services || []).every((service) => service.selected)
      );

      const details = document.createElement("details");
      details.className = "mechanic-types-group";
      if (groupIndex < 4) details.open = true;

      const summary = document.createElement("summary");
      summary.className = "mechanic-types-row";
      summary.innerHTML = `
        <span class="mechanic-types-row-left">
          <span class="mechanic-types-check">
            <input type="checkbox" ${groupSelected ? "checked" : ""} data-group-key="${group.key}">
          </span>
          <span>${group.label}</span>
        </span>
        <span class="mechanic-types-arrow">›</span>
      `;
      details.appendChild(summary);

      const groupBody = document.createElement("div");
      groupBody.className = "mechanic-types-group-body";

      (group.subcategories || []).forEach((subcategory) => {
        const subWrap = document.createElement("div");
        subWrap.className = "mechanic-types-subcategory";

        const isGeneral = subcategory.key === "general" || subcategory.key === group.key;
        if (!isGeneral) {
          const subSummary = document.createElement("div");
          subSummary.className = "mechanic-types-subtitle";
          subSummary.textContent = subcategory.label;
          subWrap.appendChild(subSummary);
        }

        (subcategory.services || []).forEach((service) => {
          const row = document.createElement("label");
          row.className = "mechanic-types-service";
          row.innerHTML = `
            <input type="checkbox" data-service-id="${service.id}" ${service.selected ? "checked" : ""}>
            <span>${service.name}</span>
          `;
          subWrap.appendChild(row);
        });

        groupBody.appendChild(subWrap);
      });

      details.appendChild(groupBody);
      mechanicTypesTree.appendChild(details);
    });
  };

  const syncMechanicCoverage = async () => {
    if (!mechanicToken || !mechanicTypesTree) return;
    try {
      const coverage = await apiAuth("/api/users/me/mechanic-service-coverage", mechanicToken);
      renderMechanicCoverage(coverage);
    } catch {
      if (mechanicTypesStatus) mechanicTypesStatus.textContent = "Unable to load work types.";
    }
  };

  const renderMechanicResolutionCaseRows = (target, cases) => {
    if (!target) return;
    target.querySelectorAll(".mechanic-resolution-table-row").forEach((row) => row.remove());
    if (!Array.isArray(cases) || !cases.length) {
      const empty = document.createElement("p");
      empty.className = "mechanic-bookings-empty";
      empty.textContent = "No cases created yet.";
      target.appendChild(empty);
      return;
    }
    cases.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "mechanic-resolution-table-row";
      row.innerHTML = `
        <span class="mechanic-resolution-status">${String(entry.subject || entry.type || "General enquiry").toUpperCase()}</span>
        <span>${formatResolutionReference(entry.reference, entry.booking_id)}</span>
        <span>${formatMechanicDateTime(entry.updated_at)}</span>
        <span>${entry.subject || "-"}</span>
        <button class="mechanic-resolution-link" type="button" data-resolution-case-id="${entry.id}">View</button>
      `;
      target.appendChild(row);
    });
  };

  const renderMechanicResolutionBookings = (bookings) => {
    if (!mechanicResolutionBookings) return;
    mechanicResolutionBookings.innerHTML = "";
    if (!Array.isArray(bookings) || !bookings.length) {
      const empty = document.createElement("p");
      empty.className = "mechanic-bookings-empty";
      empty.textContent = "No accepted bookings available.";
      mechanicResolutionBookings.appendChild(empty);
      return;
    }
    bookings.forEach((entry) => {
      const item = (entry.items || [])[0];
      const card = document.createElement("div");
      card.className = "mechanic-resolution-booking";
      card.innerHTML = `
        <div class="mechanic-resolution-booking-head">Booking #${entry.booking?.reference || entry.booking?.id || "-"}</div>
        <div class="mechanic-resolution-booking-body">
          <div class="mechanic-resolution-booking-row">
            <strong>Vehicle</strong>
            <span>${[entry.vehicle?.make, entry.vehicle?.model, entry.vehicle?.yearOfManufacture].filter(Boolean).join(" ") || "-"}</span>
          </div>
          <div class="mechanic-resolution-booking-row">
            <strong>Labour</strong>
            <span>${item?.name || "-"}</span>
          </div>
          <div class="mechanic-resolution-booking-row">
            <strong>Location</strong>
            <span>${formatMechanicAddress(entry.address) || "-"}</span>
          </div>
          <div class="mechanic-resolution-booking-row">
            <strong>Arrival Time</strong>
            <span>${formatMechanicDateTime(entry.booking?.created_at)}</span>
          </div>
        </div>
        <button class="primary" type="button" data-resolution-booking-id="${entry.booking?.id}" data-booking-reference="${entry.booking?.reference || entry.booking?.id}">Send message</button>
      `;
      mechanicResolutionBookings.appendChild(card);
    });
  };

  const syncMechanicResolutionOverview = async () => {
    if (!mechanicToken) return;
    try {
      const [cases, bookings] = await Promise.all([
        apiAuth("/api/users/me/mechanic-resolution-cases", mechanicToken),
        apiAuth("/api/users/me/mechanic-bookings", mechanicToken)
      ]);
      latestMechanicResolutionCases = Array.isArray(cases) ? cases : [];
      latestMechanicAssignedBookings = Array.isArray(bookings) ? bookings : [];
      renderMechanicResolutionCaseRows(mechanicResolutionCasesTable, latestMechanicResolutionCases);
      renderMechanicResolutionBookings(latestMechanicAssignedBookings);
    } catch {
      renderMechanicResolutionCaseRows(mechanicResolutionCasesTable, []);
      renderMechanicResolutionBookings([]);
    }
  };

  const openMechanicResolutionMessage = async (bookingId, type = "general") => {
    if (!bookingId) return;
    pendingResolutionBookingId = Number(bookingId);
    pendingResolutionCaseId = null;
    const bookingEntry = latestMechanicAssignedBookings.find((entry) => Number(entry.booking?.id) === Number(bookingId));
    const bookingReference = bookingEntry?.booking?.reference || bookingId;
    if (mechanicResolutionDetailTitle) {
      mechanicResolutionDetailTitle.textContent = `Message customer regarding Booking #${bookingReference}`;
    }
    if (mechanicResolutionCaseListTitle) {
      mechanicResolutionCaseListTitle.textContent = `Resolution cases already created for booking #${bookingReference}`;
    }
    const bookingCases = latestMechanicResolutionCases.filter((entry) => entry.booking_id === pendingResolutionBookingId);
    renderMechanicResolutionCaseRows(mechanicResolutionBookingCasesTable, bookingCases);
    if (mechanicResolutionNotice) {
      const hasMatching = bookingCases.some((entry) => String(entry.type || "general") === String(type));
      mechanicResolutionNotice.textContent = hasMatching
        ? "You already have an open dialog for this issue type."
        : "No case exists yet for this issue type. Use Go to case to create it.";
    }
    if (mechanicResolutionIssue) {
      mechanicResolutionIssue.value = type;
    }
    setMechanicResolutionSubview("message", bookingReference);
  };
  const renderMechanicResolutionCaseDetail = (detail) => {
    pendingResolutionCaseId = Number(detail?.id || 0) || null;
    pendingResolutionBookingId = Number(detail?.booking_id || detail?.booking?.id || 0) || null;
    if (mechanicResolutionCaseTitle) {
      mechanicResolutionCaseTitle.textContent = detail?.subject || "General Enquiry";
    }
    if (mechanicResolutionSidebarTitle) {
      mechanicResolutionSidebarTitle.textContent = `Current status of booking #${detail?.booking?.reference || detail?.booking_id || "-"}`;
    }
    if (mechanicResolutionSidebarCustomer) {
      mechanicResolutionSidebarCustomer.textContent = detail?.customer?.name || "-";
    }
    if (mechanicResolutionSidebarCar) {
      mechanicResolutionSidebarCar.textContent = [detail?.vehicle?.make, detail?.vehicle?.model, detail?.vehicle?.yearOfManufacture, detail?.vehicle?.registrationNumber]
        .filter(Boolean)
        .join(" ");
    }
    if (mechanicResolutionSidebarAddress) {
      mechanicResolutionSidebarAddress.textContent = formatMechanicAddress(detail?.address) || "-";
    }
    if (mechanicResolutionSidebarWork) {
      mechanicResolutionSidebarWork.textContent = (detail?.items || []).map((item) => item.name).join(", ") || "-";
    }
    if (mechanicResolutionSidebarTotal) {
      mechanicResolutionSidebarTotal.textContent = formatMechanicCurrency(detail?.booking?.total_eur);
    }
    if (mechanicResolutionMessages) {
      mechanicResolutionMessages.innerHTML = "";
      const messages = Array.isArray(detail?.messages) ? detail.messages : [];
      if (!messages.length) {
        mechanicResolutionMessages.innerHTML = '<p class="mechanic-bookings-empty">No messages yet.</p>';
      } else {
        messages.forEach((message) => {
          const item = document.createElement("div");
          item.className = `mechanic-resolution-message ${message.sender_role === "mechanic" ? "is-mechanic" : "is-customer"}`;
          item.innerHTML = `
            <div class="mechanic-resolution-bubble">
              <p>${String(message.body || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>
            <span class="mechanic-resolution-message-meta">${message.sender_name || "User"}, ${formatMechanicDateTime(message.created_at)}</span>
          `;
          mechanicResolutionMessages.appendChild(item);
        });
      }
    }
  };
  mechanicBookingsList?.addEventListener("click", async (event) => {
	    const actionsToggle = event.target.closest("[data-booking-actions-toggle]");
	    if (actionsToggle) {
	      const menu = actionsToggle.closest(".mechanic-booking-topbar-menu");
	      const panel = menu?.querySelector(".mechanic-booking-actions-panel");
	      mechanicBookingsList.querySelectorAll(".mechanic-booking-actions-panel").forEach((item) => {
	        if (item !== panel) item.classList.add("is-hidden");
	      });
	      panel?.classList.toggle("is-hidden");
	      return;
	    }
	    const resolutionMessage = event.target.closest("[data-resolution-message]");
	    if (resolutionMessage) {
	      syncMechanicNavState("resolution");
	      setMechanicView("resolution");
	      const ref = resolutionMessage.dataset.resolutionMessage || "16334274";
	      const bookingEntry = latestMechanicAssignedBookings.find((entry) => String(entry.booking?.reference || entry.booking?.id) === String(ref));
	      await openMechanicResolutionMessage(bookingEntry?.booking?.id, "general");
	      mechanicBookingsList.querySelectorAll(".mechanic-booking-actions-panel").forEach((item) => {
	        item.classList.add("is-hidden");
	      });
	      return;
	    }
	    const button = event.target.closest("[data-offer-action]");
	    if (!button || !mechanicToken) return;
    const offerId = button.dataset.offerId;
    const action = button.dataset.offerAction;
    try {
      button.disabled = true;
      await apiAuth(`/api/users/me/mechanic-offers/${encodeURIComponent(offerId)}/respond`, mechanicToken, {
        method: "POST",
        body: JSON.stringify({ action })
      });
      await syncMechanicOffers();
    } catch {
      button.disabled = false;
    }
  });

  mechanicTypesTree?.addEventListener("change", (event) => {
    const groupToggle = event.target.closest("input[data-group-key]");
    if (groupToggle) {
      const groupKey = groupToggle.dataset.groupKey;
      const group = latestMechanicCoverage.find((item) => item.key === groupKey);
      if (!group) return;
      (group.subcategories || []).forEach((subcategory) => {
        (subcategory.services || []).forEach((service) => {
          service.selected = Boolean(groupToggle.checked);
        });
      });
      renderMechanicCoverage(latestMechanicCoverage);
      return;
    }

    const serviceToggle = event.target.closest("input[data-service-id]");
    if (!serviceToggle) return;
    const serviceId = Number(serviceToggle.dataset.serviceId);
    latestMechanicCoverage.forEach((group) => {
      (group.subcategories || []).forEach((subcategory) => {
        (subcategory.services || []).forEach((service) => {
          if (service.id === serviceId) service.selected = Boolean(serviceToggle.checked);
        });
      });
    });
    renderMechanicCoverage(latestMechanicCoverage);
  });

  mechanicTypesSaveBtn?.addEventListener("click", async () => {
    if (!mechanicToken) return;
    if (mechanicTypesStatus) mechanicTypesStatus.textContent = "";
    try {
      mechanicTypesSaveBtn.disabled = true;
      const coverage = await apiAuth("/api/users/me/mechanic-service-coverage", mechanicToken, {
        method: "PATCH",
        body: JSON.stringify({ service_ids: flattenCoverageSelection() })
      });
      renderMechanicCoverage(coverage);
      if (mechanicTypesStatus) mechanicTypesStatus.textContent = "Types of work updated.";
    } catch {
      if (mechanicTypesStatus) mechanicTypesStatus.textContent = "Unable to save work types.";
    } finally {
      mechanicTypesSaveBtn.disabled = false;
    }
  });

  const setMechanicSettingsSubview = (subview) => {
    mechanicSettingsGeneral?.classList.toggle("is-hidden", subview !== "general");
    mechanicSettingsNotifications?.classList.toggle("is-hidden", subview !== "notifications");
    mechanicSettingsSecurity?.classList.toggle("is-hidden", subview !== "security");
    mechanicSettingsSubnavLinks.forEach((btn) => btn.classList.toggle("active", btn.dataset.mechanicSettingsSubview === subview));
  };

  const setMechanicResolutionSubview = (subview, bookingReference = "16334274") => {
    mechanicResolutionOverview?.classList.toggle("is-hidden", subview !== "overview");
    mechanicResolutionMessageView?.classList.toggle("is-hidden", subview !== "message");
    mechanicResolutionCaseView?.classList.toggle("is-hidden", subview !== "case");
    if (subview === "message" && mechanicResolutionDetailTitle) {
      mechanicResolutionDetailTitle.textContent = `Message customer regarding Booking #${bookingReference}`;
    }
  };

  mechanicSettingsSubnavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMechanicSettingsSubview(link.dataset.mechanicSettingsSubview || "general");
    });
  });

  mechanicSecurity2faEnable?.addEventListener("click", () => {
    mechanicSecurity2faEnable.classList.toggle("is-active");
    mechanicSecurity2faEnable.textContent = mechanicSecurity2faEnable.classList.contains("is-active")
      ? "2FA Enabled"
      : "Enable 2FA";
  });

  mechanicResolutionBackBtn?.addEventListener("click", () => {
    setMechanicResolutionSubview("overview");
  });
  mechanicResolutionCaseBackBtn?.addEventListener("click", () => {
    if (pendingResolutionBookingId) {
      const bookingEntry = latestMechanicAssignedBookings.find((entry) => Number(entry.booking?.id) === pendingResolutionBookingId);
      openMechanicResolutionMessage(pendingResolutionBookingId, "general");
      setMechanicResolutionSubview("message", bookingEntry?.booking?.reference || pendingResolutionBookingId);
      return;
    }
    setMechanicResolutionSubview("overview");
  });

  mechanicResolutionBookings?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-resolution-booking-id]");
    if (!button) return;
    syncMechanicNavState("resolution");
    setMechanicView("resolution");
    await openMechanicResolutionMessage(button.dataset.resolutionBookingId, "general");
  });

  mechanicResolutionBookingCasesTable?.addEventListener("click", async (event) => {
    const viewButton = event.target.closest("[data-resolution-case-id]");
    if (!viewButton || !mechanicToken) return;
    const detail = await apiAuth(`/api/users/me/mechanic-resolution-cases/${encodeURIComponent(viewButton.dataset.resolutionCaseId)}`, mechanicToken);
    renderMechanicResolutionCaseDetail(detail);
    setMechanicResolutionSubview("case", detail.booking?.reference || detail.booking_id);
  });

  mechanicResolutionCasesTable?.addEventListener("click", async (event) => {
    const viewButton = event.target.closest("[data-resolution-case-id]");
    if (!viewButton || !mechanicToken) return;
    const detail = await apiAuth(`/api/users/me/mechanic-resolution-cases/${encodeURIComponent(viewButton.dataset.resolutionCaseId)}`, mechanicToken);
    pendingResolutionBookingId = Number(detail.booking_id);
    renderMechanicResolutionCaseRows(
      mechanicResolutionBookingCasesTable,
      latestMechanicResolutionCases.filter((entry) => entry.booking_id === pendingResolutionBookingId)
    );
    if (mechanicResolutionDetailTitle) {
      mechanicResolutionDetailTitle.textContent = `${detail.subject || "General enquiry"} regarding Booking #${detail.booking?.reference || detail.booking_id}`;
    }
    if (mechanicResolutionCaseListTitle) {
      mechanicResolutionCaseListTitle.textContent = `Resolution cases already created for booking #${detail.booking?.reference || detail.booking_id}`;
    }
    renderMechanicResolutionCaseDetail(detail);
    setMechanicResolutionSubview("case", detail.booking?.reference || detail.booking_id);
  });

  mechanicResolutionGoToCase?.addEventListener("click", async () => {
    if (!pendingResolutionBookingId || !mechanicToken) return;
    const detail = await apiAuth("/api/users/me/mechanic-resolution-cases", mechanicToken, {
      method: "POST",
      body: JSON.stringify({ booking_id: pendingResolutionBookingId, type: mechanicResolutionIssue?.value || "general" })
    });
    await syncMechanicResolutionOverview();
    renderMechanicResolutionCaseDetail(detail);
    setMechanicResolutionSubview("case", detail.booking?.reference || detail.booking_id);
  });
  mechanicResolutionSendBtn?.addEventListener("click", async () => {
    if (!pendingResolutionCaseId || !mechanicToken) return;
    const body = mechanicResolutionMessageInput?.value?.trim();
    if (!body) return;
    const detail = await apiAuth(`/api/users/me/mechanic-resolution-cases/${encodeURIComponent(pendingResolutionCaseId)}/messages`, mechanicToken, {
      method: "POST",
      body: JSON.stringify({ body })
    });
    if (mechanicResolutionMessageInput) mechanicResolutionMessageInput.value = "";
    renderMechanicResolutionCaseDetail(detail);
    await syncMechanicResolutionOverview();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".mechanic-booking-topbar-menu")) return;
    mechanicBookingsList?.querySelectorAll(".mechanic-booking-actions-panel").forEach((item) => {
      item.classList.add("is-hidden");
    });
  });

  const setMechanicView = (view) => {
    mechanicDashboardView?.classList.toggle("is-hidden", view !== "dashboard");
    mechanicResolutionCenterView?.classList.toggle("is-hidden", view !== "resolution");
    mechanicProcedureView?.classList.toggle("is-hidden", view !== "procedure");
    mechanicPaymentsView?.classList.toggle("is-hidden", view !== "payments");
    mechanicProfileView?.classList.toggle("is-hidden", view !== "profile");
    mechanicEditProfileView?.classList.toggle("is-hidden", view !== "edit-profile");
    mechanicAccountView?.classList.toggle("is-hidden", view !== "account");
    mechanicPictureView?.classList.toggle("is-hidden", view !== "picture");
    mechanicCertificationsView?.classList.toggle("is-hidden", view !== "certifications");
    mechanicTaxView?.classList.toggle("is-hidden", view !== "tax");
    mechanicDocumentsView?.classList.toggle("is-hidden", view !== "documents");
    mechanicPreferencesView?.classList.toggle("is-hidden", view !== "preferences");
    mechanicTypesView?.classList.toggle("is-hidden", view !== "types");
    mechanicSettingsView?.classList.toggle("is-hidden", view !== "settings");
    if (view === "profile" && latestMechanicProfile) {
      setTimeout(() => renderMechanicProfileMap(latestMechanicProfile), 80);
    }
  };

  const syncMechanicNavState = (view) => {
    const railViews = new Set(["profile", "edit-profile", "picture", "certifications", "tax", "documents", "preferences", "types", "settings"]);
    mechanicNavLinks.forEach((btn) => {
      const isActive = btn.dataset.view === view && railViews.has(view);
      btn.classList.toggle("active", isActive);
    });
    mechanicSubnavLinks.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  };

  mechanicNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.view || "account";
      syncMechanicNavState(view);
      setMechanicView(view);
    });
  });

  mechanicEditSameAddress?.addEventListener("change", () => {
    const isSame = mechanicEditSameAddress.checked;
    if (mechanicEditPremisesFields) {
      mechanicEditPremisesFields.classList.toggle("is-hidden", isSame);
    }
    if (!isSame) return;
    if (mechanicEditPremisesLine1) mechanicEditPremisesLine1.value = mechanicEditContactLine1?.value || "";
    if (mechanicEditPremisesLine2) mechanicEditPremisesLine2.value = mechanicEditContactLine2?.value || "";
    if (mechanicEditPremisesCity) mechanicEditPremisesCity.value = mechanicEditContactCity?.value || "";
    if (mechanicEditPremisesPostcode) mechanicEditPremisesPostcode.value = mechanicEditContactPostcode?.value || "";
  });

  mechanicEditProfileForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!mechanicToken) return;
    if (mechanicEditProfileError) mechanicEditProfileError.textContent = "";
    const payload = {
      years_experience: mechanicEditYears?.value?.trim() || "",
      work_history: mechanicEditWorkHistory?.value?.trim() || "",
      travel_radius_miles: mechanicEditTravelRadius?.value?.trim() || "",
      is_mobile: Boolean(mechanicEditMobileService?.checked),
      same_as_contact_address: Boolean(mechanicEditSameAddress?.checked),
      contact_address: {
        line1: mechanicEditContactLine1?.value?.trim() || "",
        line2: mechanicEditContactLine2?.value?.trim() || "",
        city: mechanicEditContactCity?.value?.trim() || "",
        postal_code: mechanicEditContactPostcode?.value?.trim() || "",
        country: "GB"
      },
      premises_address: {
        line1: mechanicEditPremisesLine1?.value?.trim() || "",
        line2: mechanicEditPremisesLine2?.value?.trim() || "",
        city: mechanicEditPremisesCity?.value?.trim() || "",
        postal_code: mechanicEditPremisesPostcode?.value?.trim() || "",
        country: "GB"
      },
      services_offered: [
        mechanicEditMobileService?.checked ? "mobile_mechanic_service" : "",
        mechanicEditCustomerDropoff?.checked ? "customer_drop_off" : "",
        mechanicEditCollectionDelivery?.checked ? "collection_and_delivery" : ""
      ].filter(Boolean)
    };

    apiAuth("/api/users/me/mechanic-profile", mechanicToken, {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
      .then((profileData) => {
        latestMechanicProfile = profileData;
        if (mechanicEditProfileError) mechanicEditProfileError.textContent = "Profile updated.";
        syncMechanicProfile();
      })
      .catch((err) => {
        if (mechanicEditProfileError) {
          mechanicEditProfileError.textContent =
            err?.error?.message || err?.message || "Unable to save profile.";
        }
      });
  });

  mechanicSubnavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.view || "dashboard";
      syncMechanicNavState(view);
      setMechanicView(view);
    });
  });
  const pendingMechanicView = sessionStorage.getItem("mechanicHeaderTargetView");
  const initialMechanicView =
    pendingMechanicView && ["dashboard", "resolution", "procedure", "payments", "profile", "account", "settings"].includes(pendingMechanicView)
      ? pendingMechanicView
      : "dashboard";
  sessionStorage.removeItem("mechanicHeaderTargetView");
  syncMechanicNavState(initialMechanicView);
  setMechanicView(initialMechanicView);
  syncMechanicOffers();
  syncMechanicProfile();
  syncMechanicCoverage();
  syncMechanicResolutionOverview();
  setMechanicSettingsSubview("general");
  setMechanicResolutionSubview("overview");
}

const mechanicEditNav = document.querySelector(".mechanic-edit-nav");
if (mechanicEditNav) {
  const profile = getStoredAuthValue("userProfile");
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
      const uploadEmailInput = document.getElementById("docsUploadEmail");
      if (emailInput) emailInput.value = lead.email || "";
      if (uploadEmailInput) uploadEmailInput.value = lead.email || "";
    } catch {}
  }

  const uploadForm = document.getElementById("documentsUploadForm");
  const uploadInput = document.getElementById("documentsUploadInput");
  const uploadList = document.getElementById("documentsUploadList");
  let uploadFiles = [];

  const syncUploadInputFiles = () => {
    if (!uploadInput) return;
    const dataTransfer = new DataTransfer();
    uploadFiles.forEach((file) => dataTransfer.items.add(file));
    uploadInput.files = dataTransfer.files;
  };

  const renderUploadList = () => {
    if (!uploadList) return;
    uploadList.innerHTML = "";
    uploadFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "documents-upload-item";

      const name = document.createElement("span");
      name.className = "documents-upload-name";
      name.textContent = file.name;

      const state = document.createElement("span");
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      state.className = `documents-upload-state ${isPdf ? "is-valid" : "is-invalid"}`;
      state.textContent = isPdf ? "Formato correcto" : "Formato incorrecto";

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "documents-upload-remove";
      remove.setAttribute("aria-label", `Remove ${file.name}`);
      remove.textContent = "X";
      remove.addEventListener("click", () => {
        uploadFiles = uploadFiles.filter((_, currentIndex) => currentIndex !== index);
        syncUploadInputFiles();
        renderUploadList();
      });

      item.append(name, state, remove);
      uploadList.appendChild(item);
    });
  };

  uploadInput?.addEventListener("change", () => {
    uploadFiles = Array.from(uploadInput.files || []);
    renderUploadList();
  });

  uploadForm?.addEventListener("submit", (event) => {
    const hasInvalidFile = uploadFiles.some((file) => !(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")));
    if (hasInvalidFile || !uploadFiles.length) {
      event.preventDefault();
      renderUploadList();
    }
  });
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
          setStoredAuthValue("userProfile", JSON.stringify(payload.user));
        }
        setStatus("Email confirmed. You can sign in with the new email.");
      })
      .catch((err) => {
        setStatus(err?.error?.message || err?.message || "Unable to confirm email.", true);
      });
  }
}

