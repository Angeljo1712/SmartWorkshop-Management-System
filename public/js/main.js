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

const getInstantQuotes = document.getElementById("getInstantQuotes");
if (getInstantQuotes) {
  getInstantQuotes.addEventListener("click", () => {
    window.location.href = "/bookings/work/";
  });
}

renderVehicleSummary();

const bookingDetailsForm = document.getElementById("bookingDetailsForm");
if (bookingDetailsForm) {
  const errorEl = document.getElementById("bookingDetailsError");

  bookingDetailsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (errorEl) errorEl.textContent = "";

    const payload = {
      first_name: document.getElementById("detailsFirstName").value.trim(),
      last_name: document.getElementById("detailsLastName").value.trim(),
      email: document.getElementById("detailsEmail").value.trim(),
      address1: document.getElementById("detailsAddress1").value.trim(),
      address2: document.getElementById("detailsAddress2").value.trim(),
      city: document.getElementById("detailsCity").value.trim(),
      postcode: document.getElementById("detailsPostcode").value.trim(),
      phone: document.getElementById("detailsPhone").value.trim()
    };

    try {
      await api("/api/bookings/details", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (errorEl) errorEl.textContent = "Booking details saved.";
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
  const getStatus = (user, index) => user.status || statusCycle[index % statusCycle.length];
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
      adminUsers = (result || []).map((user, index) => ({
        ...user,
        status: statusCycle[index % statusCycle.length]
      }));
      applyFilters();
    } catch (err) {
      adminLoginError.textContent = "Access denied. Please sign in with an admin account.";
      setAdminVisibility(false);
    }
  };

  const exportUsers = () => {
    if (!adminUsers.length) return;
    const rows = [
      ["Full name", "Email", "Role", "Status", "Joined date"],
      ...adminUsers.map((user) => [user.full_name, user.email, user.role_name, getStatus(user), formatDate(user.created_at)])
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

    const email = signInEmail.value.trim();
    const password = signInPassword.value;

    if (!email || !password) {
      signInError.textContent = "Please enter your email and password.";
      return;
    }

    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      sessionStorage.setItem("userToken", result.token);
      sessionStorage.setItem("userProfile", JSON.stringify(result.user));
      if (result.user.role_name === "ADMIN") {
        window.location.href = "/admin";
        return;
      }
      window.location.href = "/user";
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
  const userSettingsRole = document.getElementById("userSettingsRole");
  const userSettingsPhone = document.getElementById("userSettingsPhone");
  const userSettingsAddress = document.getElementById("userSettingsAddress");
  const userSettingsAvatarSettings = document.getElementById("userSettingsAvatarSettings");
  const userSettingsNameSettings = document.getElementById("userSettingsNameSettings");
  const userSettingsEmailDetailSettings = document.getElementById("userSettingsEmailDetailSettings");
  const userSettingsRoleSettings = document.getElementById("userSettingsRoleSettings");
  const userSettingsPhoneSettings = document.getElementById("userSettingsPhoneSettings");
  const userSettingsPhotoInput = document.getElementById("userSettingsPhotoInput");
  const userSettingsPhoneInput = document.getElementById("userSettingsPhoneInput");
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

  const setUserHeader = (user) => {
    const displayName = user?.full_name || user?.email || "User";
    const role = user?.role_name || "CUSTOMER";
    const initials = getInitials(displayName);
    setAvatar(userProfileAvatar, initials, user?.avatar_url);
    userProfileName.textContent = displayName;
    userProfileRole.textContent = role;
    setAvatar(userSettingsAvatar, initials, user?.avatar_url);
    userSettingsName.textContent = displayName;
    if (userSettingsEmail) userSettingsEmail.textContent = user?.email || "-";
    userSettingsEmailDetail.textContent = `Email: ${user?.email || "-"}`;
    userSettingsRole.textContent = role;
    userSettingsPhone.textContent = `Phone: ${user?.phone || "-"}`;
    if (userSettingsAddress) userSettingsAddress.textContent = `Address: ${user?.address || "-"}`;
    if (userSettingsAvatarSettings) setAvatar(userSettingsAvatarSettings, initials, user?.avatar_url);
    if (userSettingsNameSettings) userSettingsNameSettings.textContent = displayName;
    if (userSettingsEmailDetailSettings)
      userSettingsEmailDetailSettings.textContent = `Email: ${user?.email || "-"}`;
    if (userSettingsRoleSettings) userSettingsRoleSettings.textContent = role;
    if (userSettingsPhoneSettings)
      userSettingsPhoneSettings.textContent = `Phone: ${user?.phone || "-"}`;

    if (userSettingsPhoneInput) userSettingsPhoneInput.value = user?.phone || "";
    if (userSettingsEmailInput) userSettingsEmailInput.value = user?.email || "";
    if (userSettingsAddressInput) userSettingsAddressInput.value = user?.address || "";
  };

  const profile = getUserProfile();
  if (profile) {
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
    const email = userSettingsEmailInput.value.trim();
    const address = userSettingsAddressInput.value.trim();

    userSettingsContactMessage.textContent = "";
    try {
      const profile = getUserProfile() || {};
      if (phone !== (profile.phone || "") || address !== (profile.address || "")) {
        const response = await fetch("http://localhost:3000/api/users/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ phone, address })
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
