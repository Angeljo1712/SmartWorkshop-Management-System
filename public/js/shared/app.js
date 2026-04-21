const output = document.getElementById("output");
let token = null;

const write = (data) => {
  if (!output) {
    return;
  }
  output.textContent = JSON.stringify(data, null, 2);
};

const api = (path, options = {}) => {
  const headers = {
    ...(options.headers || {})
  };
  if (!(options.body instanceof FormData) && !Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(path, {
    ...options,
    headers
  }).then(async (response) => {
    const payload = await response.json();
    if (!response.ok) {
      throw payload;
    }
    return payload;
  });
};

const AUTH_STORAGE_KEYS = ["userToken", "userProfile", "activeRole"];

const syncAuthStateFromLocalStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => {
    const localValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);
    if (localValue !== null && sessionValue !== localValue) {
      sessionStorage.setItem(key, localValue);
      return;
    }
    if (localValue === null && sessionValue !== null) {
      sessionStorage.removeItem(key);
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

const getInitials = (name) => {
  if (!name) return "NA";
  const parts = String(name).trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]).join("");
  return initials.toUpperCase();
};

const formatShortDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const formatCurrency = (amount, currency = "GBP") => {
  const normalizedCurrency = String(currency || "GBP").toUpperCase();
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

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

window.SWApp = Object.assign(window.SWApp || {}, {
  getInitials,
  formatShortDate,
  formatCurrency,
  escapeHtml
});

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
      <button class="customer-header-menu-item" type="button" data-view="bookings">Booking information</button>
      <button class="customer-header-menu-item" type="button" data-view="resolution">Resolution center</button>
      <button class="customer-header-menu-item" type="button" data-view="settings">Settings</button>
      <button class="customer-header-menu-item" type="button" data-action="logout">Logout</button>
    </div>
  </div>
`;

const buildAdminHeaderMenuMarkup = () => `
  <div class="admin-header-menu generated-session-menu">
    <button class="admin-header-menu-btn" type="button" aria-expanded="false">
      <span class="admin-header-first-name"></span>
      <span class="admin-header-menu-arrow">▾</span>
    </button>
    <div class="admin-header-menu-panel is-hidden">
      <button class="admin-header-menu-item" type="button" data-view="dashboard">Dashboard</button>
      <button class="admin-header-menu-item" type="button" data-view="account">Account</button>
      <button class="admin-header-menu-item" type="button" data-view="bookings">Booking information</button>
      <button class="admin-header-menu-item" type="button" data-view="users">Users</button>
      <button class="admin-header-menu-item" type="button" data-view="applications">Applications</button>
      <button class="admin-header-menu-item" type="button" data-view="resolution">Resolution</button>
      <button class="admin-header-menu-item" type="button" data-view="payments">Payments</button>
      <button class="admin-header-menu-item" type="button" data-view="catalog">Catalog</button>
      <button class="admin-header-menu-item" type="button" data-view="contact-messages">Contact messages</button>
      <button class="admin-header-menu-item" type="button" data-view="settings">Settings</button>
      <button class="admin-header-menu-item" type="button" data-action="logout">Logout</button>
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
    const existingMenu = container.querySelector(".mechanic-header-menu");
    if (existingMenu) {
      const existingName = existingMenu.querySelector(".mechanic-header-first-name");
      if (existingName) existingName.textContent = session.firstName.toUpperCase();
    } else {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = buildMechanicHeaderMenuMarkup();
      const menu = wrapper.firstElementChild;
      menu.querySelector(".mechanic-header-first-name").textContent = session.firstName.toUpperCase();
      container.appendChild(menu);
    }
    return;
  }
  if (session.activeRole === "ADMIN") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildAdminHeaderMenuMarkup();
    const menu = wrapper.firstElementChild;
    menu.querySelector(".admin-header-first-name").textContent = session.firstName.toUpperCase();
    container.appendChild(menu);
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
  if (nameEl) {
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
  if (nameEl) {
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

const bindAdminHeaderMenus = () => document.querySelectorAll(".admin-header-menu").forEach((menu) => {
  if (menu.dataset.bound === "true") return;
  menu.dataset.bound = "true";
  const session = getStoredUserSession();
  if (!session || session.activeRole !== "ADMIN") return;
  const button = menu.querySelector(".admin-header-menu-btn");
  const panel = menu.querySelector(".admin-header-menu-panel");
  const nameEl = menu.querySelector(".admin-header-first-name");
  const items = menu.querySelectorAll(".admin-header-menu-item");
  if (nameEl) {
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
      sessionStorage.setItem("adminHeaderTargetView", targetView);
      window.location.href = "/admin/dashboard";
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
  bindAdminHeaderMenus();
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
  const homeSessionMenuItems = homeSessionMenu ? Array.from(homeSessionMenu.querySelectorAll(".home-session-menu-item")) : [];
  const homeHeaderMenuToggle = document.getElementById("homeHeaderMobileMenuToggle");
  const homeMobileMenuBackdrop = document.getElementById("homeMobileMenuBackdrop");
  const homeMobileMenu = document.getElementById("homeMobileMenu");
  const homeMobileSessionItems = document.getElementById("homeMobileSessionItems");
  const homeMobileMenuName = document.getElementById("homeMobileMenuName");
  const homeFlashMessage = document.getElementById("homeFlashMessage");
  const applyHeaderState = (isHero) => {
    homeHeader.classList.toggle("is-hero", isHero);
    homeHeader.classList.toggle("is-light", !isHero);
  };

  const getHomeSessionOptions = (role) =>
    role === "ADMIN"
      ? [
          { label: "Dashboard", view: "dashboard" },
          { label: "Users", view: "users" },
          { label: "Applications", view: "applications" },
          { label: "Bookings", view: "bookings" },
          { label: "Resolution", view: "resolution" },
          { label: "Payments", view: "payments" },
          { label: "Catalog", view: "catalog" },
          { label: "Settings", view: "settings" },
          { label: "Logout", action: "logout" }
        ]
      : [
          { label: "Dashboard", view: "dashboard" },
          { label: "Account", view: "account" },
          { label: "Vehicle", view: "vehicle" },
          { label: "Bookings", view: "bookings" },
          { label: "Settings", view: "settings" },
          { label: "Logout", action: "logout" }
        ];

  const configureHomeSessionMenu = (role) => {
    if (!homeSessionMenuItems.length) return;
    const options = getHomeSessionOptions(role);

    homeSessionMenuItems.forEach((item, index) => {
      const option = options[index];
      if (!option) {
        item.classList.add("is-hidden");
        return;
      }
      item.classList.remove("is-hidden");
      item.textContent = option.label;
      if (option.view) {
        item.dataset.view = option.view;
      } else {
        delete item.dataset.view;
      }
      if (option.action) {
        item.dataset.action = option.action;
      } else {
        delete item.dataset.action;
      }
    });
  };

  const configureHomeMobileMenu = (session) => {
    if (!homeMobileSessionItems) return;
    const options = session
      ? getHomeSessionOptions(session.activeRole)
      : [{ label: "Sign in", href: "/auth/login" }];
    homeMobileSessionItems.innerHTML = options
      .map((option) => {
        const attrs = [
          'type="button"',
          'class="home-mobile-menu-link"'
        ];
        if (option.view) attrs.push(`data-view="${option.view}"`);
        if (option.action) attrs.push(`data-action="${option.action}"`);
        if (option.href) attrs.push(`data-href="${option.href}"`);
        return `<button ${attrs.join(" ")}>${option.label}</button>`;
      })
      .join("");
  };

  const closeHomeMobileMenu = () => {
    homeMobileMenu?.classList.remove("is-open");
    homeMobileMenuBackdrop?.classList.remove("is-open");
    homeHeaderMenuToggle?.setAttribute("aria-expanded", "false");
    homeMobileMenu?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("home-mobile-menu-open");
  };

  const openHomeMobileMenu = () => {
    homeMobileMenu?.classList.add("is-open");
    homeMobileMenuBackdrop?.classList.add("is-open");
    homeHeaderMenuToggle?.setAttribute("aria-expanded", "true");
    homeMobileMenu?.setAttribute("aria-hidden", "false");
    document.body.classList.add("home-mobile-menu-open");
  };

  const syncHomeSessionControls = () => {
    const session = getStoredUserSession();
    if (!homeSessionLink) return;
    configureHomeMobileMenu(session);
    if (!session) {
      homeSessionLink.classList.remove("is-hidden");
      if (homeSessionMenu) homeSessionMenu.classList.add("is-hidden");
      homeSessionLink.textContent = "Sign in";
      homeSessionLink.href = "/auth/login";
      if (homeMobileMenuName) homeMobileMenuName.textContent = "Account";
      return;
    }
    if (homeMobileMenuName) homeMobileMenuName.textContent = session.firstName.toUpperCase();
    if ((session.activeRole === "CUSTOMER" || session.activeRole === "ADMIN") && homeSessionMenu) {
      homeSessionLink.classList.add("is-hidden");
      homeSessionMenu.classList.remove("is-hidden");
      if (homeSessionMenuName) homeSessionMenuName.textContent = session.firstName.toUpperCase();
      configureHomeSessionMenu(session.activeRole);
    } else {
      homeSessionLink.classList.remove("is-hidden");
      if (homeSessionMenu) homeSessionMenu.classList.add("is-hidden");
      homeSessionLink.textContent = session.firstName;
      homeSessionLink.href = resolveDashboardHref(session.activeRole);
    }
  };

  const syncHomeFlashMessage = () => {
    if (!homeFlashMessage) return;
    const message = sessionStorage.getItem("homeFlashMessage");
    if (!message) {
      homeFlashMessage.textContent = "";
      homeFlashMessage.classList.add("is-hidden");
      return;
    }
    homeFlashMessage.textContent = message;
    homeFlashMessage.classList.remove("is-hidden");
    sessionStorage.removeItem("homeFlashMessage");
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
        const session = getStoredUserSession();
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
        if (session?.activeRole === "ADMIN") {
          sessionStorage.setItem("adminHeaderTargetView", targetView);
          window.location.href = "/admin/dashboard";
          return;
        }
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

  if (homeHeaderMenuToggle && !homeHeaderMenuToggle.dataset.bound) {
    homeHeaderMenuToggle.dataset.bound = "true";
    homeHeaderMenuToggle.addEventListener("click", () => {
      const isOpen = homeMobileMenu?.classList.contains("is-open");
      if (isOpen) {
        closeHomeMobileMenu();
      } else {
        openHomeMobileMenu();
      }
    });
  }

  if (homeMobileMenuBackdrop && !homeMobileMenuBackdrop.dataset.bound) {
    homeMobileMenuBackdrop.dataset.bound = "true";
    homeMobileMenuBackdrop.addEventListener("click", closeHomeMobileMenu);
  }

  if (homeMobileMenu && !homeMobileMenu.dataset.bound) {
    homeMobileMenu.dataset.bound = "true";
    homeMobileMenu.addEventListener("click", (event) => {
      const item = event.target.closest(".home-mobile-menu-link");
      if (!item || !homeMobileMenu.contains(item)) return;

      const href = item.dataset.href || "";
      const action = item.dataset.action || "";
      const view = item.dataset.view || "";

      if (action === "logout") {
        closeHomeMobileMenu();
        clearStoredSessionData();
        window.location.replace("/");
        return;
      }

      if (view) {
        const session = getStoredUserSession();
        closeHomeMobileMenu();
        if (session?.activeRole === "ADMIN") {
          sessionStorage.setItem("adminHeaderTargetView", view);
          window.location.href = "/admin/dashboard";
          return;
        }
        if (session) {
          sessionStorage.setItem("homeUserTargetView", view);
          window.location.href = "/user";
          return;
        }
      }

      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        closeHomeMobileMenu();
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", href);
        }
        return;
      }

      if (href) {
        closeHomeMobileMenu();
        window.location.href = href;
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeHomeMobileMenu();
  });

  syncHomeSessionControls();
  syncHomeFlashMessage();
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
  let selectedMechanicType = "";
  if (formWrap) formWrap.classList.add("is-hidden");
  if (hero) hero.classList.remove("is-hidden");
  const links = applicationJoin.querySelectorAll(".application-link");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      selectedMechanicType = String(link.dataset.mechanicType || "").trim();
      sessionStorage.setItem("mechanicApplicationType", selectedMechanicType);
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

const applicationForm = document.querySelector(".application-form-layout-2");
if (applicationForm) {
  const websiteRadios = applicationForm.querySelectorAll('input[name="has_website"]');
  const websiteField = applicationForm.querySelector(".business-website-field");
  const websiteInput = applicationForm.querySelector('input[name="website"]');
  const websiteError = applicationForm.querySelector("#applicationWebsiteError");
  const businessTypeRadios = applicationForm.querySelectorAll('input[name="business_type"]');
  const serviceCheckboxes = applicationForm.querySelectorAll('input[name="services"]');
  const specialistCheckboxes = applicationForm.querySelectorAll('input[name="specialist_services"]');
  const premisesField = applicationForm.querySelector(".business-premises");
  const specialistOtherField = applicationForm.querySelector(".business-specialist-other");
  const clearWebsiteError = () => {
    if (websiteError) websiteError.textContent = "";
    if (websiteInput) websiteInput.setCustomValidity("");
  };
  const validateWebsite = () => {
    const selected = applicationForm.querySelector('input[name="has_website"]:checked')?.value;
    const value = String(websiteInput?.value || "").trim();
    if (selected !== "yes") {
      clearWebsiteError();
      return true;
    }
    if (!value) {
      const message = "Please enter your website address.";
      if (websiteError) websiteError.textContent = message;
      if (websiteInput) websiteInput.setCustomValidity(message);
      return false;
    }
    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      const message = "Please enter a valid website URL, for example https://example.com.";
      if (websiteError) websiteError.textContent = message;
      if (websiteInput) websiteInput.setCustomValidity(message);
      return false;
    }
    clearWebsiteError();
    return true;
  };
  const syncWebsiteField = () => {
    const selected = applicationForm.querySelector('input[name="has_website"]:checked')?.value;
    websiteField?.classList.toggle("is-hidden", selected !== "yes");
    if (selected !== "yes") {
      clearWebsiteError();
    }
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
  websiteInput?.addEventListener("input", clearWebsiteError);
  websiteInput?.addEventListener("blur", validateWebsite);
  businessTypeRadios.forEach((radio) => radio.addEventListener("change", syncPremisesField));
  serviceCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", syncPremisesField));
  specialistCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", syncSpecialistOtherField));
  syncWebsiteField();
  syncPremisesField();
  syncSpecialistOtherField();

  applicationForm.addEventListener("submit", (event) => {
    sessionStorage.setItem("fromApplication", "1");
    if (!validateWebsite()) {
      event.preventDefault();
      websiteInput?.reportValidity?.();
      return;
    }
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
        ensureHiddenInput("postcode", lead.postcode);
      } catch {}
    }
    const mechanicType = selectedMechanicType || sessionStorage.getItem("mechanicApplicationType") || "";
    ensureHiddenInput("application_type", mechanicType);
  });
}

