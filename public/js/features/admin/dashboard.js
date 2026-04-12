const adminPage = document.getElementById("adminPage");
if (adminPage) {
  const adminApp = adminPage;
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  const adminSideTitle = document.getElementById("adminSideTitle");
  const adminSearchSection = document.getElementById("adminSearchSection");
  const adminSearchLabel = document.getElementById("adminSearchLabel");
  const adminSearch = document.getElementById("adminSearch");
  const adminRoleSection = document.getElementById("adminRoleSection");
  const adminRoleLabel = document.getElementById("adminRoleLabel");
  const adminRoleFilter = document.getElementById("adminRoleFilter");
  const adminStatusSection = document.getElementById("adminStatusSection");
  const adminStatusLabel = document.getElementById("adminStatusLabel");
  const adminStatusFilter = document.getElementById("adminStatusFilter");
  const adminDateSection = document.getElementById("adminDateSection");
  const adminDateLabel = document.getElementById("adminDateLabel");
  const adminDateFilter = document.getElementById("adminDateFilter");
  const adminUserRows = document.getElementById("adminUserRows");
  const adminUserSortHeaders = document.querySelectorAll("#adminUsersView [data-sort-key]");
  const adminUsersSelectAll = document.getElementById("adminUsersSelectAll");
  const adminApplicationsSelectAll = document.getElementById("adminApplicationsSelectAll");
  const adminBookingsSelectAll = document.getElementById("adminBookingsSelectAll");
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
  const adminSettingsEditModal = document.getElementById("adminSettingsEditModal");
  const adminSettingsEditTitle = document.getElementById("adminSettingsEditTitle");
  const adminSettingsEditDescription = document.getElementById("adminSettingsEditDescription");
  const adminSettingsEditLabel = document.getElementById("adminSettingsEditLabel");
  const adminSettingsEditInput = document.getElementById("adminSettingsEditInput");
  const adminSettingsEditNameGrid = document.getElementById("adminSettingsEditNameGrid");
  const adminSettingsEditFirstName = document.getElementById("adminSettingsEditFirstName");
  const adminSettingsEditMiddleName = document.getElementById("adminSettingsEditMiddleName");
  const adminSettingsEditLastName = document.getElementById("adminSettingsEditLastName");
  const adminSettingsEditAddressGrid = document.getElementById("adminSettingsEditAddressGrid");
  const adminSettingsEditAddressLine1 = document.getElementById("adminSettingsEditAddressLine1");
  const adminSettingsEditAddressLine2 = document.getElementById("adminSettingsEditAddressLine2");
  const adminSettingsEditCity = document.getElementById("adminSettingsEditCity");
  const adminSettingsEditPostcode = document.getElementById("adminSettingsEditPostcode");
  const adminSettingsEditSelectField = document.getElementById("adminSettingsEditSelectField");
  const adminSettingsEditSelectLabel = document.getElementById("adminSettingsEditSelectLabel");
  const adminSettingsEditSelect = document.getElementById("adminSettingsEditSelect");
  const adminSettingsEditMessage = document.getElementById("adminSettingsEditMessage");
  const adminSettingsEditCancel = document.getElementById("adminSettingsEditCancel");
  const adminSettingsEditSave = document.getElementById("adminSettingsEditSave");
  const adminDeleteModal = document.getElementById("adminDeleteModal");
  const adminDeleteDescription = document.getElementById("adminDeleteDescription");
  const adminDeleteCancel = document.getElementById("adminDeleteCancel");
  const adminDeleteConfirm = document.getElementById("adminDeleteConfirm");
  const filterSections = document.querySelectorAll("[data-filter-section]");
  const railNavLinks = document.querySelectorAll(".rail-nav-link");
  const adminDashboardView = document.getElementById("adminDashboardView");
  const adminApplicationsView = document.getElementById("adminApplicationsView");
  const adminBookingsView = document.getElementById("adminBookingsView");
  const adminResolutionView = document.getElementById("adminResolutionView");
  const adminPaymentsView = document.getElementById("adminPaymentsView");
  const adminCatalogView = document.getElementById("adminCatalogView");
  const adminContactMessagesView = document.getElementById("adminContactMessagesView");
  const adminProfileView = document.getElementById("adminProfileView");
  const adminUsersView = document.getElementById("adminUsersView");
  const adminSettingsView = document.getElementById("adminSettingsView");
  const adminApplicationsSearch = document.getElementById("adminApplicationsSearch");
  const adminApplicationsRows = document.getElementById("adminApplicationsRows");
  const adminApplicationsCount = document.getElementById("adminApplicationsCount");
  const adminApplicationsRowsMeta = document.getElementById("adminApplicationsRowsMeta");
  const adminApplicationsTypeFilter = document.getElementById("adminApplicationsTypeFilter");
  const adminApplicationsStatusFilter = document.getElementById("adminApplicationsStatusFilter");
  const adminApplicationsDateFilter = document.getElementById("adminApplicationsDateFilter");
  const adminApplicationsRowsPerPage = document.getElementById("adminApplicationsRowsPerPage");
  const adminApplicationsPagination = document.getElementById("adminApplicationsPagination");
  const adminApplicationSortHeaders = document.querySelectorAll("#adminApplicationsView [data-app-sort-key]");
  const adminApplicationsEmptyState = document.getElementById("adminApplicationsEmptyState");
  const adminMetricBookingsToday = document.getElementById("adminMetricBookingsToday");
  const adminMetricOpenCases = document.getElementById("adminMetricOpenCases");
  const adminMetricPendingApplications = document.getElementById("adminMetricPendingApplications");
  const adminMetricPendingPayouts = document.getElementById("adminMetricPendingPayouts");
  const adminHeroSectionTitle = document.getElementById("adminHeroSectionTitle");
  const adminHeroSectionSubtitle = document.getElementById("adminHeroSectionSubtitle");
  const adminDashboardHeroName = document.getElementById("adminDashboardHeroName");
  const adminDashboardHeroRole = document.getElementById("adminDashboardHeroRole");
  const adminDashboardHeroAvatar = document.getElementById("adminDashboardHeroAvatar");
  const adminMetricBookingsTodayCard = document.getElementById("adminMetricBookingsTodayCard");
  const adminMetricOpenCasesCard = document.getElementById("adminMetricOpenCasesCard");
  const adminMetricPendingApplicationsCard = document.getElementById("adminMetricPendingApplicationsCard");
  const adminMetricPendingPayoutsCard = document.getElementById("adminMetricPendingPayoutsCard");
  const adminQueueApplications = document.getElementById("adminQueueApplications");
  const adminQueueResolution = document.getElementById("adminQueueResolution");
  const adminQueuePayments = document.getElementById("adminQueuePayments");
  const adminQueueBookings = document.getElementById("adminQueueBookings");
  const adminDashboardRecentBookings = document.getElementById("adminDashboardRecentBookings");
  const adminDashboardRecentApplications = document.getElementById("adminDashboardRecentApplications");
  const adminDashboardRecentCases = document.getElementById("adminDashboardRecentCases");
  const adminDashboardContactMessages = document.getElementById("adminDashboardContactMessages");
  const adminBookingsSearch = document.getElementById("adminBookingsSearch");
  const adminBookingsTypeFilter = document.getElementById("adminBookingsTypeFilter");
  const adminBookingsStatusFilter = document.getElementById("adminBookingsStatusFilter");
  const adminBookingsDateFilter = document.getElementById("adminBookingsDateFilter");
  const adminBookingsRows = document.getElementById("adminBookingsRows");
  const adminBookingsCount = document.getElementById("adminBookingsCount");
  const adminBookingsRowsMeta = document.getElementById("adminBookingsRowsMeta");
  const adminBookingsRowsPerPage = document.getElementById("adminBookingsRowsPerPage");
  const adminBookingsPagination = document.getElementById("adminBookingsPagination");
  const adminBookingsExportBtn = document.getElementById("adminBookingsExportBtn");
  const adminBookingSortHeaders = document.querySelectorAll("#adminBookingsView [data-booking-sort-key]");
  const adminBookingsEmptyState = document.getElementById("adminBookingsEmptyState");
  const adminResolutionSearch = document.getElementById("adminResolutionSearch");
  const adminResolutionTypeFilter = document.getElementById("adminResolutionTypeFilter");
  const adminResolutionStatusFilter = document.getElementById("adminResolutionStatusFilter");
  const adminResolutionDateFilter = document.getElementById("adminResolutionDateFilter");
  const adminResolutionRows = document.getElementById("adminResolutionRows");
  const adminResolutionSelectAll = document.getElementById("adminResolutionSelectAll");
  const adminResolutionCount = document.getElementById("adminResolutionCount");
  const adminResolutionRowsMeta = document.getElementById("adminResolutionRowsMeta");
  const adminResolutionRowsPerPage = document.getElementById("adminResolutionRowsPerPage");
  const adminResolutionPagination = document.getElementById("adminResolutionPagination");
  const adminResolutionEmptyState = document.getElementById("adminResolutionEmptyState");
  const adminResolutionExportBtn = document.getElementById("adminResolutionExportBtn");
  const adminPaymentsSearch = document.getElementById("adminPaymentsSearch");
  const adminPaymentsKindFilter = document.getElementById("adminPaymentsKindFilter");
  const adminPaymentsStatusFilter = document.getElementById("adminPaymentsStatusFilter");
  const adminPaymentsDateFilter = document.getElementById("adminPaymentsDateFilter");
  const adminPaymentsRows = document.getElementById("adminPaymentsRows");
  const adminPaymentsSelectAll = document.getElementById("adminPaymentsSelectAll");
  const adminPaymentsCount = document.getElementById("adminPaymentsCount");
  const adminPaymentsRowsMeta = document.getElementById("adminPaymentsRowsMeta");
  const adminPaymentsRowsPerPage = document.getElementById("adminPaymentsRowsPerPage");
  const adminPaymentsPagination = document.getElementById("adminPaymentsPagination");
  const adminPaymentsEmptyState = document.getElementById("adminPaymentsEmptyState");
  const adminPaymentsExportBtn = document.getElementById("adminPaymentsExportBtn");
  const adminCatalogSearch = document.getElementById("adminCatalogSearch");
  const adminCatalogGroupFilter = document.getElementById("adminCatalogGroupFilter");
  const adminCatalogSubcategoryFilter = document.getElementById("adminCatalogSubcategoryFilter");
  const adminCatalogRows = document.getElementById("adminCatalogRows");
  const adminCatalogCount = document.getElementById("adminCatalogCount");
  const adminCatalogRowsMeta = document.getElementById("adminCatalogRowsMeta");
  const adminCatalogRowsPerPage = document.getElementById("adminCatalogRowsPerPage");
  const adminCatalogPagination = document.getElementById("adminCatalogPagination");
  const adminCatalogEmptyState = document.getElementById("adminCatalogEmptyState");
  const adminCatalogAddGroupBtn = document.getElementById("adminCatalogAddGroupBtn");
  const adminCatalogExportBtn = document.getElementById("adminCatalogExportBtn");
  const adminContactMessagesSearch = document.getElementById("adminContactMessagesSearch");
  const adminContactMessagesStatusFilter = document.getElementById("adminContactMessagesStatusFilter");
  const adminContactMessagesDateFilter = document.getElementById("adminContactMessagesDateFilter");
  const adminContactMessagesRows = document.getElementById("adminContactMessagesRows");
  const adminContactMessagesCount = document.getElementById("adminContactMessagesCount");
  const adminContactMessagesRowsMeta = document.getElementById("adminContactMessagesRowsMeta");
  const adminContactMessagesRowsPerPage = document.getElementById("adminContactMessagesRowsPerPage");
  const adminContactMessagesPagination = document.getElementById("adminContactMessagesPagination");
  const adminContactMessagesEmptyState = document.getElementById("adminContactMessagesEmptyState");
  const adminContactMessagesExportBtn = document.getElementById("adminContactMessagesExportBtn");
  const adminActionFeedback = document.getElementById("adminActionFeedback");
  const adminProfileAvatar = document.getElementById("adminProfileAvatar");
  const adminProfileName = document.getElementById("adminProfileName");
  const adminProfileRole = document.getElementById("adminProfileRole");
  const adminSettingsAvatar = document.getElementById("adminSettingsAvatar");
  const adminSettingsName = document.getElementById("adminSettingsName");
  const adminSettingsEmail = document.getElementById("adminSettingsEmail");
  const adminSettingsEmailDetail = document.getElementById("adminSettingsEmailDetail");
  const adminSettingsRole = document.getElementById("adminSettingsRole");
  const adminSettingsPhone = document.getElementById("adminSettingsPhone");
  const adminSettingsUsername = document.getElementById("adminSettingsUsername");
  const adminSettingsAddress = document.getElementById("adminSettingsAddress");
  const adminSettingsWelcomeName = document.getElementById("adminSettingsWelcomeName");
  const adminSettingsViewAvatar = document.getElementById("adminSettingsViewAvatar");
  const adminSettingsPhotoInput = document.getElementById("adminSettingsPhotoInput");
  const adminSettingsPhotoBtn = document.getElementById("adminSettingsPhotoBtn");
  const adminSettingsViewName = document.getElementById("adminSettingsViewName");
  const adminSettingsViewPhone = document.getElementById("adminSettingsViewPhone");
  const adminSettingsViewUsername = document.getElementById("adminSettingsViewUsername");
  const adminSettingsViewEmail = document.getElementById("adminSettingsViewEmail");
  const adminSettingsViewAddress = document.getElementById("adminSettingsViewAddress");
  const adminSettingsThemeValue = document.getElementById("adminSettingsThemeValue");
  const adminSettingsThemeBtn = document.getElementById("adminSettingsThemeBtn");
  const adminSettingsSubviewTitle = document.getElementById("adminSettingsSubviewTitle");
  const adminSettingsSubnavLinks = document.querySelectorAll("[data-admin-settings-subview]");
  const adminSettingsActionButtons = document.querySelectorAll("[data-admin-settings-field]");
  const adminSettingsGeneralSubview = document.getElementById("adminSettingsGeneral");
  const adminSettingsNotificationsSubview = document.getElementById("adminSettingsNotifications");
  const adminSettingsSecuritySubview = document.getElementById("adminSettingsSecurity");
  const adminNotificationsMarketing = document.getElementById("adminNotificationsMarketing");
  const adminSecurity2faEmail = document.getElementById("adminSecurity2faEmail");
  const adminSecurity2faSms = document.getElementById("adminSecurity2faSms");
  const adminSecurity2faEnable = document.getElementById("adminSecurity2faEnable");
  const adminSecurity2faMessage = document.getElementById("adminSecurity2faMessage");


  let adminUsers = [];
  let filteredUsers = [];
  let adminApplications = [];
  let adminBookings = [];
  let adminResolutionCases = [];
  let adminContactMessages = [];
  let adminPayments = [];
  let adminCatalog = [];
  let pageSize = Number(adminRowsPerPage?.value || 10);
  let currentPage = 1;
  let activeAdminView = "dashboard";
  let adminFeedbackTimer = null;
  const selectedAdminUsers = new Set();
  const selectedAdminApplications = new Set();
  const selectedAdminBookings = new Set();
  const selectedAdminResolutionCases = new Set();
  const selectedAdminPayments = new Set();
  let activeAdminEditField = null;
  let activeAdminEditUserId = null;
  let pendingAdminDeleteUser = null;
  let adminUserSort = { key: "joined_date", direction: "desc" };
  let adminApplicationsPageSize = Number(adminApplicationsRowsPerPage?.value || 10);
  let adminApplicationsPage = 1;
  let adminApplicationSort = { key: "created_at", direction: "desc" };
  let adminBookingsPage = 1;
  let adminBookingsPageSize = Number(adminBookingsRowsPerPage?.value || 10);
  let adminBookingSort = { key: "created_at", direction: "desc" };
  let adminResolutionPage = 1;
  let adminResolutionPageSize = Number(adminResolutionRowsPerPage?.value || 10);
  let adminCatalogPage = 1;
  let adminCatalogPageSize = Number(adminCatalogRowsPerPage?.value || 10);
  let activeAdminCatalogGroup = null;
  let adminPaymentsPage = 1;
  let adminPaymentsPageSize = Number(adminPaymentsRowsPerPage?.value || 10);
  let adminContactMessagesPage = 1;
  let adminContactMessagesPageSize = Number(adminContactMessagesRowsPerPage?.value || 10);

  const getAdminToken = () => getStoredAuthValue("userToken");
  const getAdminProfile = () => {
    const stored = getStoredAuthValue("userProfile");
    return stored ? JSON.parse(stored) : null;
  };
  const clearAdminSession = () => {
    clearStoredSessionData();
  };

  const setAdminHeader = (user) => {
    const joinedName = [user?.name, user?.lastname].filter(Boolean).join(" ").trim();
    const displayName = user?.full_name || joinedName || user?.email || "Admin";
    const heroDisplayName = joinedName || displayName;
    const role = "ADMINISTRATOR";
    const initials = getInitials(displayName);
    const addressText = user?.address
      || user?.full_address
      || user?.formatted_address
      || user?.address_text
      || [
        user?.address_details?.line1,
        user?.address_details?.line2,
        user?.address_details?.city,
        user?.address_details?.postal_code,
        user?.address_details?.country
      ].filter(Boolean).join(", ")
      || [
        user?.address_line_1,
        user?.address_line_2,
        user?.city || user?.town,
        user?.postcode || user?.postal_code,
        user?.country
      ].filter(Boolean).join(", ")
      || [
        user?.premises_address,
        user?.contact_address
      ].filter(Boolean).join(", ")
      || String(user?.location || "").trim();
    const setAdminAvatar = (el, fallbackInitials, url) => {
      if (!el) return;
      el.innerHTML = "";
      if (url) {
        const resolvedUrl = String(url).startsWith("/uploads") ? `http://localhost:3000${url}` : url;
        const img = document.createElement("img");
        img.src = resolvedUrl;
        img.alt = "";
        el.appendChild(img);
        return;
      }
      el.textContent = fallbackInitials;
    };
    setAdminAvatar(adminProfileAvatar, initials, user?.avatar_url);
    if (adminProfileName) adminProfileName.textContent = displayName;
    if (adminDashboardHeroName) adminDashboardHeroName.textContent = heroDisplayName;
    if (adminDashboardHeroRole) adminDashboardHeroRole.textContent = role;
    setAdminAvatar(adminDashboardHeroAvatar, initials, user?.avatar_url);
    if (adminProfileRole) adminProfileRole.textContent = role;
    setAdminAvatar(adminSettingsAvatar, initials, user?.avatar_url);
    if (adminSettingsName) adminSettingsName.textContent = displayName;
    if (adminSettingsEmail) setAdminLabeledText(adminSettingsEmail, "Email:", user?.email || "admin@smartworkshop.local");
    if (adminSettingsEmailDetail) {
      setAdminLabeledText(adminSettingsEmailDetail, "Email:", user?.email || "admin@smartworkshop.local");
    }
    if (adminSettingsRole) adminSettingsRole.textContent = role;
    if (adminSettingsPhone) setAdminLabeledText(adminSettingsPhone, "Phone:", user?.phone);
    if (adminSettingsUsername) setAdminLabeledText(adminSettingsUsername, "Username:", user?.username);
    if (adminSettingsAddress) setAdminLabeledText(adminSettingsAddress, "Address:", addressText);
    if (adminSettingsWelcomeName) adminSettingsWelcomeName.textContent = displayName;
    setAdminAvatar(adminSettingsViewAvatar, initials, user?.avatar_url);
    if (adminSettingsViewName) adminSettingsViewName.textContent = displayName;
    if (adminSettingsViewPhone) adminSettingsViewPhone.textContent = user?.phone || "-";
    if (adminSettingsViewUsername) adminSettingsViewUsername.textContent = user?.username || "-";
    if (adminSettingsViewEmail) adminSettingsViewEmail.textContent = user?.email || "admin@smartworkshop.local";
    if (adminSettingsViewAddress) adminSettingsViewAddress.textContent = addressText || "-";
    if (adminSecurity2faEmail) adminSecurity2faEmail.checked = Boolean(user?.two_factor_email_enabled);
    if (adminSecurity2faSms) adminSecurity2faSms.checked = false;
    syncAdminSecurity2faButton();
  };

  const setAdminSettingsSubview = (subview) => {
    const titles = {
      general: "General",
      notifications: "Notifications",
      security: "Login & security"
    };
    adminSettingsGeneralSubview?.classList.toggle("is-hidden", subview !== "general");
    adminSettingsNotificationsSubview?.classList.toggle("is-hidden", subview !== "notifications");
    adminSettingsSecuritySubview?.classList.toggle("is-hidden", subview !== "security");
    if (adminSettingsSubviewTitle) {
      adminSettingsSubviewTitle.textContent = titles[subview] || "General";
    }
    adminSettingsSubnavLinks.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.adminSettingsSubview === subview);
    });
  };

  const syncAdminSecurity2faButton = () => {
    if (!adminSecurity2faEnable) return;
    const hasSelection = Boolean(adminSecurity2faEmail?.checked || adminSecurity2faSms?.checked);
    adminSecurity2faEnable.disabled = false;
    adminSecurity2faEnable.classList.toggle("is-active", hasSelection);
  };

  const setAdminVisibility = (loggedIn) => {
    adminApp?.classList.toggle("is-hidden", !loggedIn);
    if (adminLogoutBtn) adminLogoutBtn.disabled = !loggedIn;
  };

  const setAdminHeroByView = (view) => {
    const heroConfig = {
      dashboard: { title: "Dashboard", subtitle: "General information" },
      users: { title: "Users", subtitle: "Users overview" },
      applications: { title: "Applications", subtitle: "Mechanic applications" },
      bookings: { title: "Bookings", subtitle: "Bookings overview" },
      resolution: { title: "Resolution", subtitle: "Resolution cases" },
      payments: { title: "Payments", subtitle: "Payments overview" },
      catalog: { title: "Catalog", subtitle: "Service catalog" },
      "contact-messages": { title: "Contact messages", subtitle: "Messages sent from the homepage" },
      account: { title: "Account", subtitle: "Review your profile information" },
      profile: { title: "Profile", subtitle: "Profile information" },
      settings: { title: "Settings", subtitle: "Workspace settings" }
    };
    const current = heroConfig[view] || heroConfig.dashboard;
    if (adminHeroSectionTitle) adminHeroSectionTitle.textContent = current.title;
    if (adminHeroSectionSubtitle) adminHeroSectionSubtitle.textContent = current.subtitle;
  };

  const statusCycle = ["Active", "Pending", "Suspended", "Banned"];
  const toStatusLabel = (value) => {
    if (!value) return null;
    const lower = String(value).toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  const getStatus = (user, index) => {
    const baseStatus = toStatusLabel(user.status) || statusCycle[index % statusCycle.length];
    const normalizedRole = String(user.role_name || "").trim().toUpperCase();
    const eligibleForAutoInactive = normalizedRole === "CUSTOMER" || normalizedRole === "MECHANIC";
    const normalizedBaseStatus = String(baseStatus || "").trim().toLowerCase();

    if (!eligibleForAutoInactive) return baseStatus;
    if (normalizedBaseStatus && normalizedBaseStatus !== "active") return baseStatus;

    const referenceValue = user.last_active || user.created_at;
    if (!referenceValue) return baseStatus;

    const referenceDate = new Date(referenceValue);
    if (Number.isNaN(referenceDate.getTime())) return baseStatus;

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - referenceDate.getTime() > THIRTY_DAYS_MS) {
      return "Inactive";
    }

    return baseStatus;
  };
  const getLastActive = (user, index) => {
    const formatRelativeTime = (date) => {
      const diffMs = Date.now() - date.getTime();
      if (diffMs <= 0) return "Just now";
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      const week = 7 * day;
      const month = 30 * day;

      if (diffMs < hour) {
        const minutes = Math.max(1, Math.floor(diffMs / minute));
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
      }
      if (diffMs < day) {
        const hours = Math.floor(diffMs / hour);
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
      }
      if (diffMs < week) {
        const days = Math.floor(diffMs / day);
        return `${days} day${days === 1 ? "" : "s"} ago`;
      }
      if (diffMs < month) {
        const weeks = Math.floor(diffMs / week);
        return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
      }
      const months = Math.floor(diffMs / month);
      return `${months} month${months === 1 ? "" : "s"} ago`;
    };

    if (user.last_active) {
      const date = new Date(user.last_active);
      if (!Number.isNaN(date.getTime())) {
        return formatRelativeTime(date);
      }
    }
    const options = ["1 minute ago", "4 hours ago", "4 days ago", "1 week ago", "1 month ago"];
    return options[index % options.length];
  };
  const getAvatarUrl = (user) => {
    const avatarUrl = String(user?.avatar_url || "").trim();
    if (!avatarUrl) return "";
    return avatarUrl.startsWith("/uploads") ? `http://localhost:3000${avatarUrl}` : avatarUrl;
  };
  const getLocation = (user) => {
    const fullAddress = String(user?.address || "").trim();
    if (fullAddress) {
      return fullAddress;
    }

    const addressParts = [
      user?.address_line_1,
      user?.address_line_2,
      user?.city || user?.town,
      user?.postcode || user?.postal_code,
      user?.country
    ]
      .map((value) => String(value || "").trim())
      .filter(Boolean);

    if (addressParts.length) {
      return addressParts.join(", ");
    }

    if (user?.location) {
      return String(user.location).trim();
    }

    return "-";
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

  const formatDate = window.SWApp?.formatShortDate || ((value) => String(value || "-"));
  const getInitials = window.SWApp?.getInitials || ((name) => String(name || "NA"));
  const escapeHtml = window.SWApp?.escapeHtml || ((value) => String(value ?? ""));

  const renderAdminDashboardList = (container, items, formatter) => {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = `<div class="admin-dashboard-list-item"><strong>No data yet</strong><span>Nothing to review right now.</span></div>`;
      return;
    }
    container.innerHTML = items.map(formatter).join("");
  };

  const renderAdminDashboard = () => {
    const pendingApplications = adminApplications.filter((item) => String(item.application_status || "").toLowerCase() !== "approved").length;
    const openCases = adminResolutionCases.filter((item) => String(item.status || "").toLowerCase() === "open").length;
    const pendingPayouts = adminPayments.filter((item) => item.kind === "mechanic_payout" && ["requested", "processing"].includes(String(item.status || "").toLowerCase())).length;
    const bookingsAtRisk = adminBookings.filter((item) => ["cancelled", "disputed"].includes(String(item.status || "").toLowerCase())).length;

    if (adminQueueApplications) adminQueueApplications.textContent = String(pendingApplications);
    if (adminQueueResolution) adminQueueResolution.textContent = String(openCases);
    if (adminQueuePayments) adminQueuePayments.textContent = String(pendingPayouts);
    if (adminQueueBookings) adminQueueBookings.textContent = String(bookingsAtRisk);

    renderAdminDashboardList(
      adminDashboardRecentBookings,
      adminBookings.slice(0, 5),
      (item) => `
        <div class="admin-dashboard-list-item">
          <strong>${escapeHtml(item.reference)} · ${escapeHtml(item.customer_name)}</strong>
          <span>${escapeHtml(item.vehicle)} · ${escapeHtml(titleCase(item.status))}</span>
          <span class="label">${escapeHtml(formatDate(item.created_at))}</span>
        </div>`
    );

    renderAdminDashboardList(
      adminDashboardRecentApplications,
      adminApplications.slice(0, 5),
      (item) => `
        <div class="admin-dashboard-list-item">
          <strong>${escapeHtml(item.full_name)}</strong>
          <span>${escapeHtml(titleCase(item.application_type || item.business_type || "application"))} · ${escapeHtml(item.lead_postcode || "-")}</span>
          <span class="label">${escapeHtml(titleCase(item.application_status || "unknown"))} · ${escapeHtml(formatDate(item.created_at))}</span>
        </div>`
    );

    renderAdminDashboardList(
      adminDashboardRecentCases,
      adminResolutionCases.slice(0, 5),
      (item) => `
        <div class="admin-dashboard-list-item">
          <strong>${escapeHtml(item.reference)} · ${escapeHtml(item.subject)}</strong>
          <span>${escapeHtml(item.customer_name)} / ${escapeHtml(item.mechanic_name)}</span>
          <span class="label">${escapeHtml(titleCase(item.status))} · ${escapeHtml(formatDate(item.updated_at))}</span>
        </div>`
    );

    renderAdminDashboardList(
      adminDashboardContactMessages,
      adminContactMessages.slice(0, 5),
      (item) => `
        <div class="admin-dashboard-list-item">
          <strong>${escapeHtml(item.name || item.email || "Contact message")}</strong>
          <span>${escapeHtml(item.subject || "No subject")} · ${escapeHtml(item.email || "-")}</span>
          <span class="label">${escapeHtml(formatDate(item.created_at))}</span>
        </div>`
    );
  };

  const normaliseFilterToken = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const getUniqueOptions = (items, selector) => {
    const seen = new Map();
    items.forEach((item) => {
      const rawValue = selector(item);
      if (rawValue == null || rawValue === "") return;
      const value = String(rawValue);
      const key = normaliseFilterToken(value);
      if (!seen.has(key)) {
        seen.set(key, value);
      }
    });
    return Array.from(seen.values()).sort((a, b) => String(a).localeCompare(String(b)));
  };

  const setFilterOptions = (select, options, selectedValue = "all") => {
    if (!select) return;
    const allLabel = select.dataset.allLabel || "All";
    const values = options.some((option) => option.value === "all")
      ? options
      : [{ value: "all", label: allLabel }, ...options];
    const normalisedValues = values.map((option) =>
      option.value === "all" ? { ...option, label: option.label || allLabel } : option
    );
    const safeSelected = normalisedValues.some((option) => option.value === selectedValue) ? selectedValue : "all";
    select.innerHTML = normalisedValues
      .map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
      .join("");
    select.value = safeSelected;
  };

  const getUserSortValue = (user, index, key) => {
    switch (key) {
      case "full_name":
        return String(user.full_name || "").toLowerCase();
      case "email":
        return String(user.email || "").toLowerCase();
      case "username":
        return String(user.username || "").toLowerCase();
      case "status":
        return String(getStatus(user, index) || "").toLowerCase();
      case "role":
        return String(user.role_name || "").toLowerCase();
      case "experience":
        return Number.parseFloat(String(getExperience(user) || "0").replace(/[^\d.]/g, "")) || 0;
      case "joined_date":
        return new Date(user.created_at || 0).getTime() || 0;
      case "last_active": {
        const direct = new Date(user.last_active || 0).getTime();
        return Number.isNaN(direct) ? 0 : direct;
      }
      default:
        return "";
    }
  };

  const sortAdminUsers = (users) => {
    const sorted = [...users];
    const direction = adminUserSort.direction === "asc" ? 1 : -1;
    sorted.sort((left, right) => {
      const leftIndex = adminUsers.findIndex((item) => Number(item.user_id) === Number(left.user_id));
      const rightIndex = adminUsers.findIndex((item) => Number(item.user_id) === Number(right.user_id));
      const leftValue = getUserSortValue(left, leftIndex, adminUserSort.key);
      const rightValue = getUserSortValue(right, rightIndex, adminUserSort.key);
      if (leftValue < rightValue) return -1 * direction;
      if (leftValue > rightValue) return 1 * direction;
      return 0;
    });
    return sorted;
  };

  const getApplicationSortValue = (item, key) => {
    switch (key) {
      case "full_name":
        return String(item.full_name || "").toLowerCase();
      case "application_type":
        return String(item.application_type || item.business_type || "").toLowerCase();
      case "lead_postcode":
        return String(item.lead_postcode || "").toLowerCase();
      case "documents_count":
        return Number(item.documents_count || 0);
      case "application_status":
        return String(item.application_status || "").toLowerCase();
      case "account_status":
        return String(item.account_status || "").toLowerCase();
      case "created_at":
        return new Date(item.created_at || 0).getTime() || 0;
      default:
        return "";
    }
  };

  const sortAdminApplications = (items) => {
    const sorted = [...items];
    const direction = adminApplicationSort.direction === "asc" ? 1 : -1;
    sorted.sort((left, right) => {
      const leftValue = getApplicationSortValue(left, adminApplicationSort.key);
      const rightValue = getApplicationSortValue(right, adminApplicationSort.key);
      if (leftValue < rightValue) return -1 * direction;
      if (leftValue > rightValue) return 1 * direction;
      return 0;
    });
    return sorted;
  };

  const syncAdminApplicationSortUi = () => {
    adminApplicationSortHeaders.forEach((header) => {
      const isActive = header.dataset.appSortKey === adminApplicationSort.key;
      header.dataset.sortDirection = isActive ? adminApplicationSort.direction : "";
      header.classList.toggle("is-active", isActive);
    });
  };

  const getBookingSortValue = (item, key) => {
    switch (key) {
      case "reference":
        return String(item.reference || "").toLowerCase();
      case "status":
        return String(item.status || "").toLowerCase();
      case "customer_name":
        return String(item.customer_name || "").toLowerCase();
      case "mechanic_name":
        return String(item.mechanic_name || "").toLowerCase();
      case "vehicle":
        return String(item.vehicle || "").toLowerCase();
      case "location":
        return String(item.location || "").toLowerCase();
      case "total":
        return Number(item.total || 0);
      case "created_at":
        return new Date(item.created_at || 0).getTime() || 0;
      default:
        return "";
    }
  };

  const BOOKING_TYPE_OPTIONS = [
    { value: "Diagnostics", label: "Diagnostics" },
    { value: "Ev Chargers", label: "Ev Chargers" },
    { value: "Inspections", label: "Inspections" },
    { value: "Mots", label: "Mots" },
    { value: "Repairs", label: "Repairs" },
    { value: "Services", label: "Services" },
    { value: "Tyres", label: "Tyres" }
  ];

  const getBookingType = (item) => {
    const serviceText = (
      Array.isArray(item?.services)
        ? item.services.join(" ")
        : String(item?.services || "")
    ).toLowerCase();

    if (!serviceText) return "Repairs";
    if (serviceText.includes("diagnostic")) return "Diagnostics";
    if (serviceText.includes("ev") || serviceText.includes("electric vehicle") || serviceText.includes("charger")) {
      return "Ev Chargers";
    }
    if (serviceText.includes("inspection")) return "Inspections";
    if (serviceText.includes("mot")) return "Mots";
    if (serviceText.includes("tyre") || serviceText.includes("tire")) return "Tyres";
    if (serviceText.includes("service")) return "Services";
    return "Repairs";
  };

  const syncAdminBookingHeadFilters = () => {
    const bookingDateOptions = [
      { value: "all", label: "All time" },
      { value: "30", label: "Last 30 days" },
      { value: "90", label: "Last 90 days" },
      { value: "365", label: "Last year" }
    ];
    setFilterOptions(
      adminBookingsTypeFilter,
      BOOKING_TYPE_OPTIONS,
      adminBookingsTypeFilter?.value
    );
    setFilterOptions(
      adminBookingsStatusFilter,
      [
        ...getUniqueOptions(adminBookings, (item) => item.status).map((value) => ({
          value,
          label: titleCase(value)
        })),
        { value: "cancelled", label: "Cancelled" }
      ],
      adminBookingsStatusFilter?.value
    );
    setFilterOptions(adminBookingsDateFilter, bookingDateOptions, adminBookingsDateFilter?.value);
  };

  const syncAdminResolutionHeadFilters = () => {
    const resolutionDateOptions = [
      { value: "all", label: "All time" },
      { value: "30", label: "Last 30 days" },
      { value: "90", label: "Last 90 days" },
      { value: "365", label: "Last year" }
    ];
    setFilterOptions(
      adminResolutionTypeFilter,
      getUniqueOptions(adminResolutionCases, (item) => item.type).map((value) => ({
        value,
        label: titleCase(value)
      })),
      adminResolutionTypeFilter?.value
    );
    setFilterOptions(
      adminResolutionStatusFilter,
      getUniqueOptions(adminResolutionCases, (item) => item.status).map((value) => ({
        value,
        label: titleCase(value)
      })),
      adminResolutionStatusFilter?.value
    );
    setFilterOptions(adminResolutionDateFilter, resolutionDateOptions, adminResolutionDateFilter?.value);
  };

  const syncAdminPaymentsHeadFilters = () => {
    const paymentDateOptions = [
      { value: "all", label: "All time" },
      { value: "30", label: "Last 30 days" },
      { value: "90", label: "Last 90 days" },
      { value: "365", label: "Last year" }
    ];
    setFilterOptions(
      adminPaymentsKindFilter,
      getUniqueOptions(adminPayments, (item) => item.kind).map((value) => ({
        value,
        label: titleCase(value)
      })),
      adminPaymentsKindFilter?.value
    );
    setFilterOptions(
      adminPaymentsStatusFilter,
      getUniqueOptions(adminPayments, (item) => item.status).map((value) => ({
        value,
        label: titleCase(value)
      })),
      adminPaymentsStatusFilter?.value
    );
    setFilterOptions(adminPaymentsDateFilter, paymentDateOptions, adminPaymentsDateFilter?.value);
  };

  const syncAdminCatalogHeadFilters = () => {
    setFilterOptions(
      adminCatalogGroupFilter,
      getUniqueOptions(adminCatalog, (item) => item.group).map((value) => ({
        value,
        label: value
      })),
      adminCatalogGroupFilter?.value
    );
    setFilterOptions(
      adminCatalogSubcategoryFilter,
      getUniqueOptions(adminCatalog, (item) => item.subcategory).map((value) => ({
        value,
        label: value
      })),
      adminCatalogSubcategoryFilter?.value
    );
  };

  const sortAdminBookings = (items) => {
    const sorted = [...items];
    const direction = adminBookingSort.direction === "asc" ? 1 : -1;
    sorted.sort((left, right) => {
      const leftValue = getBookingSortValue(left, adminBookingSort.key);
      const rightValue = getBookingSortValue(right, adminBookingSort.key);
      if (leftValue < rightValue) return -1 * direction;
      if (leftValue > rightValue) return 1 * direction;
      return 0;
    });
    return sorted;
  };

  const syncAdminBookingSortUi = () => {
    adminBookingSortHeaders.forEach((header) => {
      const isActive = header.dataset.bookingSortKey === adminBookingSort.key;
      header.dataset.sortDirection = isActive ? adminBookingSort.direction : "";
      header.classList.toggle("is-active", isActive);
    });
  };

  const syncAdminUserSortUi = () => {
    adminUserSortHeaders.forEach((header) => {
      const isActive = header.dataset.sortKey === adminUserSort.key;
      header.dataset.sortDirection = isActive ? adminUserSort.direction : "";
      header.classList.toggle("is-active", isActive);
    });
  };

  const getViewSearchInput = (view) => {
    const inputs = {
      users: null,
      applications: adminApplicationsSearch,
      bookings: adminBookingsSearch,
      resolution: adminResolutionSearch,
      payments: adminPaymentsSearch,
      catalog: adminCatalogSearch,
      "contact-messages": adminContactMessagesSearch
    };
    return inputs[view] || null;
  };

  const getCombinedSearchTerms = (view) => {
    const sideTerm = String(adminSearch?.value || "").trim().toLowerCase();
    const viewTerm = String(getViewSearchInput(view)?.value || "").trim().toLowerCase();
    return [sideTerm, viewTerm].filter(Boolean);
  };

  const matchesSearchTerms = (fields, terms) => {
    if (!terms.length) return true;
    const haystack = fields.join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  };

  const matchesDateFilter = (value, dateFilterValue) => {
    if (!dateFilterValue || dateFilterValue === "all") return true;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffDays <= Number(dateFilterValue);
  };

  const getUsername = (email) => {
    if (!email) return "-";
    const [local] = email.split("@");
    return local || "-";
  };

  const applyFilters = () => {
    const term = String(adminSearch?.value || "").trim().toLowerCase();
    const roleValue = adminRoleFilter?.value || "all";
    const statusValue = adminStatusFilter?.value || "all";
    const dateValue = adminDateFilter?.value || "all";
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

  const titleCase = (value) =>
    String(value || "")
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const getContactMessageStatusUi = (value) => {
    const normalized = normaliseFilterToken(value || "new");
    if (normalized === "in_progress") {
      return { value: normalized, label: "Read", badgeClass: "read" };
    }
    if (normalized === "closed") {
      return { value: normalized, label: "Resolved", badgeClass: "resolved" };
    }
    if (normalized === "spam") {
      return { value: normalized, label: "Spam", badgeClass: "cancelled" };
    }
    return { value: "new", label: "New", badgeClass: "new" };
  };

  const syncAdminSideSearchFromView = () => {
    if (!adminSearch) return;
    const currentInput = getViewSearchInput(activeAdminView);
    if (!currentInput) {
      return;
    }
    if (adminSearch && adminSearch.value !== currentInput.value) {
      adminSearch.value = currentInput.value;
    }
  };

  const syncAdminViewSearchFromSide = () => {
    const currentInput = getViewSearchInput(activeAdminView);
    if (!currentInput || !adminSearch) {
      return;
    }
    if (currentInput.value !== adminSearch.value) {
      currentInput.value = adminSearch.value;
    }
  };

  const getAdminSideConfig = (view) => {
    const baseDateOptions = [
      { value: "all", label: "All time" },
      { value: "30", label: "Last 30 days" },
      { value: "90", label: "Last 90 days" },
      { value: "365", label: "Last year" }
    ];
    const configs = {
      dashboard: { showSide: false },
      account: { showSide: false },
      profile: { showSide: false },
      settings: { showSide: false },
        users: {
          showSide: true,
          title: "User filters",
          searchLabel: "User",
          searchPlaceholder: "Search",
          showRole: true,
          roleLabel: "Role",
          roleOptions: getUniqueOptions(adminUsers, (item) => item.role_name).map((value) => ({
            value,
            label: titleCase(value)
          })),
          showStatus: true,
          statusLabel: "Status",
          statusOptions: [
            { value: "all", label: "Status" },
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
            { value: "Pending", label: "Pending" },
            { value: "Suspended", label: "Suspended" },
            { value: "Banned", label: "Banned" }
          ],
          showDate: true,
          dateLabel: "Date",
          dateOptions: [
            { value: "all", label: "Date" },
            { value: "30", label: "Last 30 days" },
            { value: "90", label: "Last 90 days" },
            { value: "365", label: "Last year" }
          ]
        },
      applications: {
        showSide: true,
        title: "Application filters",
        searchLabel: "Application",
        searchPlaceholder: "Search applications",
        showRole: true,
        roleLabel: "Type",
        roleOptions: getUniqueOptions(adminApplications, (item) => item.application_type || item.business_type).map((value) => ({
          value,
          label: titleCase(value)
        })),
        showStatus: true,
        statusLabel: "Status",
        statusOptions: getUniqueOptions(adminApplications, (item) => item.application_status).map((value) => ({
          value,
          label: titleCase(value)
        })),
        showDate: true,
        dateLabel: "Created",
        dateOptions: baseDateOptions
      },
      bookings: {
        showSide: true,
        title: "Booking filters",
        searchLabel: "Booking",
        searchPlaceholder: "Search bookings",
        showRole: false,
        showStatus: true,
        statusLabel: "Status",
        statusOptions: getUniqueOptions(adminBookings, (item) => item.status).map((value) => ({
          value,
          label: titleCase(value)
        })),
        showDate: true,
        dateLabel: "Created",
        dateOptions: baseDateOptions
      },
      resolution: {
        showSide: true,
        title: "Case filters",
        searchLabel: "Case",
        searchPlaceholder: "Search cases",
        showRole: true,
        roleLabel: "Type",
        roleOptions: getUniqueOptions(adminResolutionCases, (item) => item.type).map((value) => ({
          value,
          label: titleCase(value)
        })),
        showStatus: true,
        statusLabel: "Status",
        statusOptions: getUniqueOptions(adminResolutionCases, (item) => item.status).map((value) => ({
          value,
          label: titleCase(value)
        })),
        showDate: true,
        dateLabel: "Updated",
        dateOptions: baseDateOptions
      },
      payments: {
        showSide: true,
        title: "Payment filters",
        searchLabel: "Payment",
        searchPlaceholder: "Search payments",
        showRole: true,
        roleLabel: "Kind",
        roleOptions: getUniqueOptions(adminPayments, (item) => item.kind).map((value) => ({
          value,
          label: titleCase(value)
        })),
        showStatus: true,
        statusLabel: "Status",
        statusOptions: getUniqueOptions(adminPayments, (item) => item.status).map((value) => ({
          value,
          label: titleCase(value)
        })),
        showDate: true,
        dateLabel: "Created",
        dateOptions: baseDateOptions
      },
      "contact-messages": {
        showSide: true,
        title: "Contact filters",
        searchLabel: "Message",
        searchPlaceholder: "Search contact messages",
        showRole: false,
        showStatus: true,
        statusLabel: "Status",
        statusOptions: getUniqueOptions(adminContactMessages, (item) => item.status).map((value) => ({
          value,
          label: getContactMessageStatusUi(value).label
        })),
        showDate: true,
        dateLabel: "Created",
        dateOptions: baseDateOptions
      },
      catalog: {
        showSide: true,
        title: "Catalog filters",
        searchLabel: "Service",
        searchPlaceholder: "Search catalog",
        showRole: true,
        roleLabel: "Group",
        roleOptions: getUniqueOptions(adminCatalog, (item) => item.group).map((value) => ({
          value,
          label: value
        })),
        showStatus: false,
        showDate: false
      }
    };
    return configs[view] || { showSide: false };
  };

  const configureAdminSide = (view) => {
    const config = getAdminSideConfig(view);
        if (!config.showSide) {
      return;
    }

    if (adminSideTitle) adminSideTitle.textContent = config.title || "Filters";
    if (adminSearchSection) adminSearchSection.classList.remove("is-hidden");
    if (adminSearchLabel) adminSearchLabel.textContent = config.searchLabel || "Search";
    if (adminSearch) {
      adminSearch.placeholder = config.searchPlaceholder || "Search";
    }

    adminRoleSection?.classList.toggle("is-hidden", !config.showRole);
    if (adminRoleLabel) adminRoleLabel.textContent = config.roleLabel || "Role";
    if (config.showRole) {
      setFilterOptions(adminRoleFilter, config.roleOptions || [], adminRoleFilter?.value);
    } else if (adminRoleFilter) {
      adminRoleFilter.value = "all";
    }

    adminStatusSection?.classList.toggle("is-hidden", !config.showStatus);
    if (adminStatusLabel) adminStatusLabel.textContent = config.statusLabel || "Status";
    if (config.showStatus) {
      setFilterOptions(adminStatusFilter, config.statusOptions || [], adminStatusFilter?.value);
    } else if (adminStatusFilter) {
      adminStatusFilter.value = "all";
    }

    adminDateSection?.classList.toggle("is-hidden", !config.showDate);
    if (adminDateLabel) adminDateLabel.textContent = config.dateLabel || "Date";
    if (config.showDate) {
      setFilterOptions(adminDateFilter, config.dateOptions || [], adminDateFilter?.value);
    } else if (adminDateFilter) {
      adminDateFilter.value = "all";
    }

    syncAdminSideSearchFromView();
  };

  const showAdminFeedback = (message, type = "success") => {
    if (!adminActionFeedback) return;
    if (adminFeedbackTimer) {
      clearTimeout(adminFeedbackTimer);
      adminFeedbackTimer = null;
    }
    adminActionFeedback.textContent = message;
    adminActionFeedback.classList.remove("is-hidden", "is-error");
    adminActionFeedback.classList.toggle("is-error", type === "error");
    adminFeedbackTimer = window.setTimeout(() => {
      adminActionFeedback.classList.add("is-hidden");
      adminActionFeedback.classList.remove("is-error");
    }, 3500);
  };

  const adminEditFieldConfig = {
    full_name: {
      label: "Full name",
      description: "Update the user's full name.",
      type: "name",
      getValue: (user) => user.full_name || ""
    },
    phone: {
      label: "Phone",
      description: "Update the user's phone number.",
      type: "text",
      getValue: (user) => user.phone || ""
    },
    username: {
      label: "Username",
      description: "Update the username.",
      type: "text",
      getValue: (user) => user.username || ""
    },
    address: {
      label: "Address",
      description: "Update the user's address.",
      type: "address",
      getValue: (user) => user.address || ""
    },
    role: {
      label: "Role",
      description: "Update the account role.",
      type: "select",
      getValue: (user) => (String(user.role_name || "CUSTOMER").toLowerCase() === "customer" ? "user" : String(user.role_name || "").toLowerCase()),
      options: [
        { value: "user", label: "Customer" },
        { value: "mechanic", label: "Mechanic" },
        { value: "admin", label: "Admin" }
      ]
    },
    status: {
      label: "Status",
      description: "Update the account status.",
      type: "select",
      getValue: (user) => String(user.status || "active").toLowerCase(),
      options: [
        { value: "pending", label: "Pending" },
        { value: "active", label: "Active" },
        { value: "suspended", label: "Suspended" },
        { value: "banned", label: "Banned" }
      ]
    }
  };

  const closeAdminSettingsEditModal = () => {
    activeAdminEditField = null;
    activeAdminEditUserId = null;
    adminSettingsEditModal?.classList.add("is-hidden");
    if (adminSettingsEditInput) adminSettingsEditInput.value = "";
    if (adminSettingsEditNameGrid) adminSettingsEditNameGrid.classList.add("is-hidden");
    if (adminSettingsEditFirstName) adminSettingsEditFirstName.value = "";
    if (adminSettingsEditMiddleName) adminSettingsEditMiddleName.value = "";
    if (adminSettingsEditLastName) adminSettingsEditLastName.value = "";
    if (adminSettingsEditAddressGrid) adminSettingsEditAddressGrid.classList.add("is-hidden");
    if (adminSettingsEditAddressLine1) adminSettingsEditAddressLine1.value = "";
    if (adminSettingsEditAddressLine2) adminSettingsEditAddressLine2.value = "";
    if (adminSettingsEditCity) adminSettingsEditCity.value = "";
    if (adminSettingsEditPostcode) adminSettingsEditPostcode.value = "";
    if (adminSettingsEditSelect) adminSettingsEditSelect.innerHTML = "";
    if (adminSettingsEditMessage) adminSettingsEditMessage.textContent = "";
    if (adminSettingsEditSave) adminSettingsEditSave.disabled = false;
  };

  const openAdminSettingsEditModal = (user, field) => {
    const config = adminEditFieldConfig[field];
    if (!config || !user) return;
    activeAdminEditField = field;
    activeAdminEditUserId = user.user_id || user.id;
    if (adminSettingsEditTitle) adminSettingsEditTitle.textContent = `Update ${config.label}`;
    if (adminSettingsEditDescription) adminSettingsEditDescription.textContent = config.description;
    if (adminSettingsEditNameGrid) adminSettingsEditNameGrid.classList.add("is-hidden");
    if (adminSettingsEditAddressGrid) adminSettingsEditAddressGrid.classList.add("is-hidden");

    if (config.type === "select") {
      if (adminSettingsEditInput?.parentElement) adminSettingsEditInput.parentElement.classList.add("is-hidden");
      adminSettingsEditSelectField?.classList.remove("is-hidden");
      if (adminSettingsEditSelectLabel) adminSettingsEditSelectLabel.textContent = config.label;
      if (adminSettingsEditSelect) {
        adminSettingsEditSelect.innerHTML = config.options
          .map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
          .join("");
        adminSettingsEditSelect.value = config.getValue(user) || "";
      }
    } else if (config.type === "name") {
      if (adminSettingsEditDescription) {
        adminSettingsEditDescription.textContent = "Update the full name shown in your profile.";
      }
      if (adminSettingsEditInput?.parentElement) adminSettingsEditInput.parentElement.classList.add("is-hidden");
      adminSettingsEditSelectField?.classList.add("is-hidden");
      adminSettingsEditNameGrid?.classList.remove("is-hidden");
      const fullName = String(config.getValue(user) || "").trim();
      const nameParts = fullName ? fullName.split(/\s+/).filter(Boolean) : [];
      const firstName = user.name || nameParts[0] || "";
      const lastName = user.lastname || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : "");
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
      if (adminSettingsEditFirstName) adminSettingsEditFirstName.value = firstName;
      if (adminSettingsEditMiddleName) adminSettingsEditMiddleName.value = middleName;
      if (adminSettingsEditLastName) adminSettingsEditLastName.value = lastName;
    } else if (config.type === "address") {
        if (adminSettingsEditInput?.parentElement) adminSettingsEditInput.parentElement.classList.add("is-hidden");
        adminSettingsEditSelectField?.classList.add("is-hidden");
      adminSettingsEditAddressGrid?.classList.remove("is-hidden");
      if (adminSettingsEditAddressLine1) adminSettingsEditAddressLine1.value = user.address_line_1 || "";
      if (adminSettingsEditAddressLine2) adminSettingsEditAddressLine2.value = user.address_line_2 || "";
      if (adminSettingsEditCity) adminSettingsEditCity.value = user.city || "";
      if (adminSettingsEditPostcode) adminSettingsEditPostcode.value = user.postal_code || "";
    } else {
      if (adminSettingsEditInput?.parentElement) adminSettingsEditInput.parentElement.classList.remove("is-hidden");
      adminSettingsEditSelectField?.classList.add("is-hidden");
      if (adminSettingsEditLabel) adminSettingsEditLabel.textContent = config.label;
      if (adminSettingsEditInput) {
        adminSettingsEditInput.type = config.type || "text";
        adminSettingsEditInput.value = config.getValue(user) || "";
      }
    }
    if (adminSettingsEditMessage) adminSettingsEditMessage.textContent = "";
    adminSettingsEditModal?.classList.remove("is-hidden");
  };

  const closeAdminEditMenus = () => {
    document.querySelectorAll(".admin-edit-menu").forEach((menu) => menu.classList.add("is-hidden"));
  };

  const closeAdminDeleteModal = () => {
    pendingAdminDeleteUser = null;
    adminDeleteModal?.classList.add("is-hidden");
    if (adminDeleteModal) adminDeleteModal.hidden = true;
    if (adminDeleteConfirm) adminDeleteConfirm.disabled = false;
  };

  const setAdminLabeledText = (el, label, value) => {
    if (!el) return;
    el.innerHTML = `<span class="account-field-label">${escapeHtml(label)}</span><span class="account-field-value">${escapeHtml(value || "-")}</span>`;
  };

  const openAdminDeleteModal = ({ userId, name, role }) => {
    pendingAdminDeleteUser = { userId, name, role };
    if (adminDeleteDescription) {
      adminDeleteDescription.textContent = `Are you sure you want to delete ${name}?`;
    }
    adminDeleteModal?.classList.remove("is-hidden");
    if (adminDeleteModal) adminDeleteModal.hidden = false;
  };

  const renderApplications = () => {
    if (!adminApplicationsRows) return;
    const typeOptions = [...new Set(adminApplications.map((item) => titleCase(item.application_type || item.business_type || "")).filter(Boolean))]
      .map((label) => ({ value: label, label }));
    const statusOptions = [...new Set(adminApplications.map((item) => titleCase(item.application_status || "")).filter(Boolean))]
      .map((label) => ({ value: label, label }));
    setFilterOptions(adminApplicationsTypeFilter, typeOptions, adminApplicationsTypeFilter?.value);
    setFilterOptions(adminApplicationsStatusFilter, statusOptions, adminApplicationsStatusFilter?.value);
    setFilterOptions(adminApplicationsDateFilter, [
      { value: "today", label: "Today" },
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
      { value: "all", label: "All time" }
    ], adminApplicationsDateFilter?.value || "all");

    const terms = getCombinedSearchTerms("applications");
    const typeValue = adminApplicationsTypeFilter?.value || "all";
    const statusValue = adminApplicationsStatusFilter?.value || "all";
    const dateValue = adminApplicationsDateFilter?.value || "all";
    const rows = adminApplications.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.full_name,
        item.email,
        item.lead_postcode,
        item.application_type,
        item.application_status,
        item.account_status
        ], terms);
      const matchesType =
        typeValue === "all" ||
        titleCase(item.application_type || item.business_type || "") === typeValue;
      const matchesStatus =
        statusValue === "all" ||
        titleCase(item.application_status || "") === statusValue;
      const matchesDate = matchesDateFilter(item.created_at, dateValue);
      return matchesTerm && matchesType && matchesStatus && matchesDate;
    });

    if (adminApplicationsCount) {
      adminApplicationsCount.textContent = `${rows.length} applications`;
    }
    adminApplicationsRows.innerHTML = "";
    adminApplicationsEmptyState?.classList.toggle("is-hidden", rows.length > 0);
    if (!rows.length) {
      if (adminApplicationsRowsMeta) adminApplicationsRowsMeta.textContent = "0 of 0 rows";
      if (adminApplicationsPagination) adminApplicationsPagination.innerHTML = "";
      syncAdminApplicationSortUi();
      return;
    }

    const sortedRows = sortAdminApplications(rows);
    const pages = Math.max(1, Math.ceil(sortedRows.length / adminApplicationsPageSize));
    if (adminApplicationsPage > pages) adminApplicationsPage = pages;
    const start = (adminApplicationsPage - 1) * adminApplicationsPageSize;
    const end = Math.min(start + adminApplicationsPageSize, sortedRows.length);
    if (adminApplicationsRowsMeta) {
      adminApplicationsRowsMeta.textContent = `${start + 1}-${end} of ${sortedRows.length} rows`;
    }

    adminApplicationsRows.innerHTML = sortedRows
      .slice(start, end)
        .map(
          (item) => {
            const applicationStatus = titleCase(item.application_status || "-");
            const accountStatus = titleCase(item.account_status || "-");
            const applicationStatusClass = String(applicationStatus).toLowerCase().replace(/\s+/g, "-");
            const accountStatusClass = String(accountStatus).toLowerCase().replace(/\s+/g, "-");
            const avatarUrl = getAvatarUrl(item);
            const applicationId = String(item.user_id || item.id || item.email || item.full_name || "");
            const isChecked = selectedAdminApplications.has(applicationId);
            return `
            <tr>
              <td class="table-check">
                <input type="checkbox" aria-label="Select ${escapeHtml(item.full_name)}" data-application-select="${escapeHtml(applicationId)}" ${isChecked ? "checked" : ""} />
              </td>
              <td>
                <div class="user-cell">
                  <div class="avatar">${avatarUrl ? `<img src="${escapeHtml(avatarUrl)}" alt="" />` : escapeHtml(getInitials(item.full_name || item.email || ""))}</div>
                  <div class="user-meta">
                  <strong>${escapeHtml(item.full_name)}</strong>
                  <span>${escapeHtml(item.email)}</span>
                </div>
              </div>
            </td>
              <td>${escapeHtml(titleCase(item.application_type || item.business_type || "-"))}</td>
              <td>${escapeHtml(item.lead_postcode || "-")}</td>
              <td>${escapeHtml(String(item.documents_count || 0))}</td>
              <td><span class="admin-status-badge admin-status-badge--${applicationStatusClass}">${escapeHtml(applicationStatus)}</span></td>
              <td>${escapeHtml(accountStatus)}</td>
              <td>${escapeHtml(formatDate(item.created_at))}</td>
              <td>
                <div class="admin-actions-cell">
                  <button class="icon-btn" type="button" data-application-action="approve" data-application-user-id="${escapeHtml(String(item.user_id))}" title="Approve">
                    Approve
                </button>
                <button class="icon-btn" type="button" data-application-action="request_info" data-application-user-id="${escapeHtml(String(item.user_id))}" title="Request info">
                  Info
                </button>
                <button class="icon-btn danger" type="button" data-application-action="reject" data-application-user-id="${escapeHtml(String(item.user_id))}" title="Reject">
                  Reject
                  </button>
                </div>
              </td>
            </tr>`;
          }
        )
        .join("");

    adminApplicationsRows.querySelectorAll("[data-application-select]").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const applicationId = event.currentTarget.getAttribute("data-application-select");
        if (!applicationId) return;
        if (event.currentTarget.checked) {
          selectedAdminApplications.add(applicationId);
        } else {
          selectedAdminApplications.delete(applicationId);
        }
        const visibleIds = sortedRows.slice(start, end).map((item) => String(item.user_id || item.id || item.email || item.full_name || ""));
        const selectedVisible = visibleIds.filter((id) => selectedAdminApplications.has(id)).length;
        if (adminApplicationsSelectAll) {
          adminApplicationsSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
          adminApplicationsSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
        }
      });
    });

    if (adminApplicationsSelectAll) {
      const visibleIds = sortedRows.slice(start, end).map((item) => String(item.user_id || item.id || item.email || item.full_name || ""));
      const selectedVisible = visibleIds.filter((id) => selectedAdminApplications.has(id)).length;
      adminApplicationsSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
      adminApplicationsSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }

    if (adminApplicationsPagination) {
      adminApplicationsPagination.innerHTML = "";
      if (pages > 1) {
        const addButton = (label, page, isActive = false, isDisabled = false) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = label;
          btn.disabled = isDisabled;
          btn.classList.toggle("active", isActive);
          btn.addEventListener("click", () => {
            adminApplicationsPage = page;
            renderApplications();
          });
          adminApplicationsPagination.appendChild(btn);
        };

        addButton("<", Math.max(1, adminApplicationsPage - 1), false, adminApplicationsPage === 1);
        const startPage = Math.max(1, adminApplicationsPage - 2);
        const endPage = Math.min(pages, startPage + 4);
        for (let page = startPage; page <= endPage; page += 1) {
          addButton(String(page), page, page === adminApplicationsPage);
        }
        addButton(">", Math.min(pages, adminApplicationsPage + 1), false, adminApplicationsPage === pages);
      }
    }

    syncAdminApplicationSortUi();
  };

  const renderBookings = () => {
    if (!adminBookingsRows) return;
    const terms = getCombinedSearchTerms("bookings");
    const typeValue = adminBookingsTypeFilter?.value || "all";
    const statusValue = adminBookingsStatusFilter?.value || adminStatusFilter?.value || "all";
    const dateValue = adminBookingsDateFilter?.value || adminDateFilter?.value || "all";
    const rows = adminBookings.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.reference,
        item.status,
        item.customer_name,
        item.mechanic_name,
        item.vehicle,
        item.location,
        item.services
      ], terms);
      const matchesType =
        typeValue === "all" ||
        normaliseFilterToken(getBookingType(item)) === normaliseFilterToken(typeValue);
      const matchesStatus =
        statusValue === "all" ||
        normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.created_at, dateValue);
      return matchesTerm && matchesType && matchesStatus && matchesDate;
    });

    if (adminBookingsCount) {
      adminBookingsCount.textContent = `${rows.length} bookings`;
    }
    adminBookingsRows.innerHTML = "";
    adminBookingsEmptyState?.classList.toggle("is-hidden", rows.length > 0);
    if (!rows.length) {
      if (adminBookingsRowsMeta) adminBookingsRowsMeta.textContent = "0 of 0 rows";
      if (adminBookingsPagination) adminBookingsPagination.innerHTML = "";
      syncAdminBookingSortUi();
      return;
    }

    const sortedRows = sortAdminBookings(rows);
    const pages = Math.max(1, Math.ceil(sortedRows.length / adminBookingsPageSize));
    if (adminBookingsPage > pages) adminBookingsPage = pages;
    const start = (adminBookingsPage - 1) * adminBookingsPageSize;
    const end = Math.min(start + adminBookingsPageSize, sortedRows.length);
    if (adminBookingsRowsMeta) {
      adminBookingsRowsMeta.textContent = `${start + 1}-${end} of ${sortedRows.length} rows`;
    }

    adminBookingsRows.innerHTML = sortedRows
      .slice(start, end)
      .map(
        (item) => {
          const status = normaliseFilterToken(item.status);
          const statusLabel = titleCase(item.status);
          const statusClass = status.replace(/[^a-z0-9]+/g, "-");
          const bookingId = String(item.booking_id || item.id || item.reference || "");
          const isChecked = selectedAdminBookings.has(bookingId);
          const actions = [];
          if (["requested", "accepted"].includes(status)) {
            actions.push(`<button class="icon-btn" type="button" data-booking-action="start" data-booking-id="${escapeHtml(String(item.booking_id))}" title="Start">Start</button>`);
          }
          if (["accepted", "in_progress"].includes(status)) {
            actions.push(`<button class="icon-btn" type="button" data-booking-action="complete" data-booking-id="${escapeHtml(String(item.booking_id))}" title="Complete">Complete</button>`);
          }
          if (!["completed", "cancelled", "refunded"].includes(status)) {
            actions.push(`<button class="icon-btn danger" type="button" data-booking-action="cancel" data-booking-id="${escapeHtml(String(item.booking_id))}" title="Cancel">Cancel</button>`);
          }
          return `
          <tr>
            <td class="table-check">
              <input type="checkbox" aria-label="Select booking ${escapeHtml(item.reference)}" data-booking-select="${escapeHtml(bookingId)}" ${isChecked ? "checked" : ""} />
            </td>
            <td>${escapeHtml(item.reference)}</td>
            <td><span class="admin-booking-status-badge status-${escapeHtml(statusClass)}">${escapeHtml(statusLabel)}</span></td>
            <td>${escapeHtml(item.customer_name)}</td>
            <td>${escapeHtml(item.mechanic_name)}</td>
            <td>${escapeHtml(item.vehicle)}</td>
            <td>${escapeHtml(item.location)}</td>
            <td>£${escapeHtml(Number(item.total || 0).toFixed(2))}</td>
            <td>${escapeHtml(formatDate(item.created_at))}</td>
            <td>
              <div class="admin-actions-cell">
                ${actions.join("") || '<span class="admin-empty-inline">No actions</span>'}
              </div>
            </td>
          </tr>`
        }
      )
      .join("");

    adminBookingsRows.querySelectorAll("[data-booking-select]").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const bookingId = event.currentTarget.getAttribute("data-booking-select");
        if (!bookingId) return;
        if (event.currentTarget.checked) {
          selectedAdminBookings.add(bookingId);
        } else {
          selectedAdminBookings.delete(bookingId);
        }
        const visibleIds = sortedRows.slice(start, end).map((item) => String(item.booking_id || item.id || item.reference || ""));
        const selectedVisible = visibleIds.filter((id) => selectedAdminBookings.has(id)).length;
        if (adminBookingsSelectAll) {
          adminBookingsSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
          adminBookingsSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
        }
      });
    });

    if (adminBookingsSelectAll) {
      const visibleIds = sortedRows.slice(start, end).map((item) => String(item.booking_id || item.id || item.reference || ""));
      const selectedVisible = visibleIds.filter((id) => selectedAdminBookings.has(id)).length;
      adminBookingsSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
      adminBookingsSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }

    if (adminBookingsPagination) {
      adminBookingsPagination.innerHTML = "";
      if (pages > 1) {
        const addButton = (label, page, isActive = false, isDisabled = false) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = label;
          btn.disabled = isDisabled;
          btn.classList.toggle("active", isActive);
          btn.addEventListener("click", () => {
            adminBookingsPage = page;
            renderBookings();
          });
          adminBookingsPagination.appendChild(btn);
        };

        addButton("<", Math.max(1, adminBookingsPage - 1), false, adminBookingsPage === 1);
        const startPage = Math.max(1, adminBookingsPage - 2);
        const endPage = Math.min(pages, startPage + 4);
        for (let page = startPage; page <= endPage; page += 1) {
          addButton(String(page), page, page === adminBookingsPage);
        }
        addButton(">", Math.min(pages, adminBookingsPage + 1), false, adminBookingsPage === pages);
      }
    }

    syncAdminBookingSortUi();
  };

  const renderResolutionCases = () => {
    if (!adminResolutionRows) return;
    const terms = getCombinedSearchTerms("resolution");
    const typeValue = adminResolutionTypeFilter?.value || adminRoleFilter?.value || "all";
    const statusValue = adminResolutionStatusFilter?.value || adminStatusFilter?.value || "all";
    const dateValue = adminResolutionDateFilter?.value || adminDateFilter?.value || "all";
    const rows = adminResolutionCases.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.reference,
        item.type,
        item.subject,
        item.status,
        item.customer_name,
        item.mechanic_name
      ], terms);
      const matchesType =
        typeValue === "all" ||
        normaliseFilterToken(item.type) === normaliseFilterToken(typeValue);
      const matchesStatus =
        statusValue === "all" ||
        normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.updated_at, dateValue);
      return matchesTerm && matchesType && matchesStatus && matchesDate;
    });

    if (adminResolutionCount) {
      adminResolutionCount.textContent = `${rows.length} cases`;
    }
    adminResolutionRows.innerHTML = "";
    adminResolutionEmptyState?.classList.toggle("is-hidden", rows.length > 0);
    if (!rows.length) {
      if (adminResolutionRowsMeta) adminResolutionRowsMeta.textContent = "0 of 0 rows";
      if (adminResolutionPagination) adminResolutionPagination.innerHTML = "";
      return;
    }

    const pages = Math.max(1, Math.ceil(rows.length / adminResolutionPageSize));
    if (adminResolutionPage > pages) adminResolutionPage = pages;
    const start = (adminResolutionPage - 1) * adminResolutionPageSize;
    const end = Math.min(start + adminResolutionPageSize, rows.length);
    if (adminResolutionRowsMeta) {
      adminResolutionRowsMeta.textContent = `${start + 1}-${end} of ${rows.length} rows`;
    }

    adminResolutionRows.innerHTML = rows
      .slice(start, end)
      .map(
        (item) => {
          const caseId = String(item.case_id || item.id || item.reference || "");
          const isChecked = selectedAdminResolutionCases.has(caseId);
          const status = normaliseFilterToken(item.status);
          const actions = status === "open"
            ? [`<button class="icon-btn" type="button" data-resolution-action="close" data-resolution-case-id="${escapeHtml(String(item.case_id))}" title="Close">Close</button>`]
            : [`<button class="icon-btn" type="button" data-resolution-action="reopen" data-resolution-case-id="${escapeHtml(String(item.case_id))}" title="Reopen">Reopen</button>`];
          return `
          <tr>
            <td class="table-check">
              <input type="checkbox" aria-label="Select case ${escapeHtml(item.reference)}" data-resolution-select="${escapeHtml(caseId)}" ${isChecked ? "checked" : ""} />
            </td>
            <td>${escapeHtml(item.reference)}</td>
            <td>${escapeHtml(titleCase(item.type))}</td>
            <td>${escapeHtml(item.subject)}</td>
            <td>${escapeHtml(titleCase(item.status))}</td>
            <td>${escapeHtml(item.customer_name)}</td>
            <td>${escapeHtml(item.mechanic_name)}</td>
            <td>${escapeHtml(formatDate(item.updated_at))}</td>
            <td>
              <div class="admin-actions-cell">
                ${actions.join("")}
              </div>
            </td>
          </tr>`
        }
      )
      .join("");

    adminResolutionRows.querySelectorAll("[data-resolution-select]").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const caseId = event.currentTarget.getAttribute("data-resolution-select");
        if (!caseId) return;
        if (event.currentTarget.checked) {
          selectedAdminResolutionCases.add(caseId);
        } else {
          selectedAdminResolutionCases.delete(caseId);
        }
        const visibleIds = rows.slice(start, end).map((item) => String(item.case_id || item.id || item.reference || ""));
        const selectedVisible = visibleIds.filter((id) => selectedAdminResolutionCases.has(id)).length;
        if (adminResolutionSelectAll) {
          adminResolutionSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
          adminResolutionSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
        }
      });
    });

    if (adminResolutionSelectAll) {
      const visibleIds = rows.slice(start, end).map((item) => String(item.case_id || item.id || item.reference || ""));
      const selectedVisible = visibleIds.filter((id) => selectedAdminResolutionCases.has(id)).length;
      adminResolutionSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
      adminResolutionSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }

    if (adminResolutionPagination) {
      adminResolutionPagination.innerHTML = "";
      if (pages > 1) {
        const addButton = (label, page, isActive = false, isDisabled = false) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = label;
          btn.disabled = isDisabled;
          btn.classList.toggle("active", isActive);
          btn.addEventListener("click", () => {
            adminResolutionPage = page;
            renderResolutionCases();
          });
          adminResolutionPagination.appendChild(btn);
        };
        addButton("<", Math.max(1, adminResolutionPage - 1), false, adminResolutionPage === 1);
        const startPage = Math.max(1, adminResolutionPage - 2);
        const endPage = Math.min(pages, startPage + 4);
        for (let page = startPage; page <= endPage; page += 1) {
          addButton(String(page), page, page === adminResolutionPage);
        }
        addButton(">", Math.min(pages, adminResolutionPage + 1), false, adminResolutionPage === pages);
      }
    }
  };

  const renderPayments = () => {
    if (!adminPaymentsRows) return;
    const terms = getCombinedSearchTerms("payments");
    const kindValue = adminPaymentsKindFilter?.value || adminRoleFilter?.value || "all";
    const statusValue = adminPaymentsStatusFilter?.value || adminStatusFilter?.value || "all";
    const dateValue = adminPaymentsDateFilter?.value || adminDateFilter?.value || "all";
    const rows = adminPayments.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.reference,
        item.kind,
        item.booking_reference,
        item.party,
        item.provider,
        item.status
      ], terms);
      const matchesKind =
        kindValue === "all" ||
        normaliseFilterToken(item.kind) === normaliseFilterToken(kindValue);
      const matchesStatus =
        statusValue === "all" ||
        normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.created_at, dateValue);
      return matchesTerm && matchesKind && matchesStatus && matchesDate;
    });

    if (adminPaymentsCount) {
      adminPaymentsCount.textContent = `${rows.length} movements`;
    }
    adminPaymentsRows.innerHTML = "";
    adminPaymentsEmptyState?.classList.toggle("is-hidden", rows.length > 0);
    if (!rows.length) {
      if (adminPaymentsRowsMeta) adminPaymentsRowsMeta.textContent = "0 of 0 rows";
      if (adminPaymentsPagination) adminPaymentsPagination.innerHTML = "";
      return;
    }

    const pages = Math.max(1, Math.ceil(rows.length / adminPaymentsPageSize));
    if (adminPaymentsPage > pages) adminPaymentsPage = pages;
    const start = (adminPaymentsPage - 1) * adminPaymentsPageSize;
    const end = Math.min(start + adminPaymentsPageSize, rows.length);
    if (adminPaymentsRowsMeta) {
      adminPaymentsRowsMeta.textContent = `${start + 1}-${end} of ${rows.length} rows`;
    }

    adminPaymentsRows.innerHTML = rows
      .slice(start, end)
      .map(
        (item) => {
          const kind = normaliseFilterToken(item.kind);
          const status = normaliseFilterToken(item.status);
          const paymentId = String(item.record_id || item.id || item.reference || "");
          const isChecked = selectedAdminPayments.has(paymentId);
          const actions = [];

          if (kind === "customer_payment") {
            if (status === "authorized") {
              actions.push(`<button class="icon-btn" type="button" data-payment-action="capture" data-payment-kind="${escapeHtml(item.kind)}" data-payment-record-id="${escapeHtml(String(item.record_id))}" title="Capture">Capture</button>`);
            }
            if (!["refunded", "failed"].includes(status)) {
              actions.push(`<button class="icon-btn" type="button" data-payment-action="refund" data-payment-kind="${escapeHtml(item.kind)}" data-payment-record-id="${escapeHtml(String(item.record_id))}" title="Refund">Refund</button>`);
            }
            if (status !== "failed") {
              actions.push(`<button class="icon-btn danger" type="button" data-payment-action="fail" data-payment-kind="${escapeHtml(item.kind)}" data-payment-record-id="${escapeHtml(String(item.record_id))}" title="Fail">Fail</button>`);
            }
          }

          if (kind === "mechanic_payout") {
            if (status === "requested") {
              actions.push(`<button class="icon-btn" type="button" data-payment-action="process" data-payment-kind="${escapeHtml(item.kind)}" data-payment-record-id="${escapeHtml(String(item.record_id))}" title="Process">Process</button>`);
            }
            if (["requested", "processing"].includes(status)) {
              actions.push(`<button class="icon-btn" type="button" data-payment-action="pay" data-payment-kind="${escapeHtml(item.kind)}" data-payment-record-id="${escapeHtml(String(item.record_id))}" title="Pay">Pay</button>`);
            }
            if (status !== "failed") {
              actions.push(`<button class="icon-btn danger" type="button" data-payment-action="fail" data-payment-kind="${escapeHtml(item.kind)}" data-payment-record-id="${escapeHtml(String(item.record_id))}" title="Fail">Fail</button>`);
            }
          }

          return `
          <tr>
            <td class="table-check">
              <input type="checkbox" aria-label="Select payment ${escapeHtml(item.reference)}" data-payment-select="${escapeHtml(paymentId)}" ${isChecked ? "checked" : ""} />
            </td>
            <td>${escapeHtml(item.reference)}</td>
            <td>${escapeHtml(titleCase(item.kind))}</td>
            <td>${escapeHtml(item.booking_reference || "-")}</td>
            <td>${escapeHtml(item.party)}</td>
            <td>${escapeHtml(item.provider)}</td>
            <td>${escapeHtml(titleCase(item.status))}</td>
            <td>£${escapeHtml(Number(item.amount || 0).toFixed(2))}</td>
            <td>${escapeHtml(formatDate(item.created_at))}</td>
            <td>
              <div class="admin-actions-cell">
                ${actions.join("") || '<span class="admin-empty-inline">No actions</span>'}
              </div>
            </td>
          </tr>`
        }
      )
      .join("");

    adminPaymentsRows.querySelectorAll("[data-payment-select]").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const paymentId = event.currentTarget.getAttribute("data-payment-select");
        if (!paymentId) return;
        if (event.currentTarget.checked) {
          selectedAdminPayments.add(paymentId);
        } else {
          selectedAdminPayments.delete(paymentId);
        }
        const visibleIds = rows.slice(start, end).map((item) => String(item.record_id || item.id || item.reference || ""));
        const selectedVisible = visibleIds.filter((id) => selectedAdminPayments.has(id)).length;
        if (adminPaymentsSelectAll) {
          adminPaymentsSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
          adminPaymentsSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
        }
      });
    });

    if (adminPaymentsSelectAll) {
      const visibleIds = rows.slice(start, end).map((item) => String(item.record_id || item.id || item.reference || ""));
      const selectedVisible = visibleIds.filter((id) => selectedAdminPayments.has(id)).length;
      adminPaymentsSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
      adminPaymentsSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }

    if (adminPaymentsPagination) {
      adminPaymentsPagination.innerHTML = "";
      if (pages > 1) {
        const addButton = (label, page, isActive = false, isDisabled = false) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = label;
          btn.disabled = isDisabled;
          btn.classList.toggle("active", isActive);
          btn.addEventListener("click", () => {
            adminPaymentsPage = page;
            renderPayments();
          });
          adminPaymentsPagination.appendChild(btn);
        };
        addButton("<", Math.max(1, adminPaymentsPage - 1), false, adminPaymentsPage === 1);
        const startPage = Math.max(1, adminPaymentsPage - 2);
        const endPage = Math.min(pages, startPage + 4);
        for (let page = startPage; page <= endPage; page += 1) {
          addButton(String(page), page, page === adminPaymentsPage);
        }
        addButton(">", Math.min(pages, adminPaymentsPage + 1), false, adminPaymentsPage === pages);
      }
    }
  };

  const syncAdminContactMessagesHeadFilters = () => {
    setFilterOptions(
      adminContactMessagesStatusFilter,
      getUniqueOptions(adminContactMessages, (item) => item.status).map((value) => ({
        value,
        label: getContactMessageStatusUi(value).label
      })),
      adminContactMessagesStatusFilter?.value
    );
    setFilterOptions(
      adminContactMessagesDateFilter,
      [
        { value: "all", label: "All time" },
        { value: "30", label: "Last 30 days" },
        { value: "90", label: "Last 90 days" },
        { value: "365", label: "Last year" }
      ],
      adminContactMessagesDateFilter?.value
    );
  };

  const renderContactMessages = () => {
    if (!adminContactMessagesRows) return;
    const terms = getCombinedSearchTerms("contact-messages");
    const statusValue = adminContactMessagesStatusFilter?.value || adminStatusFilter?.value || "all";
    const dateValue = adminContactMessagesDateFilter?.value || adminDateFilter?.value || "all";
    const rows = adminContactMessages.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.name,
        item.email,
        item.subject,
        item.message,
        item.status,
        item.source
      ], terms);
      const matchesStatus =
        statusValue === "all" ||
        normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.created_at, dateValue);
      return matchesTerm && matchesStatus && matchesDate;
    });

    if (adminContactMessagesCount) {
      adminContactMessagesCount.textContent = `${rows.length} messages`;
    }
    adminContactMessagesRows.innerHTML = "";
    adminContactMessagesEmptyState?.classList.toggle("is-hidden", rows.length > 0);
    if (!rows.length) {
      if (adminContactMessagesRowsMeta) adminContactMessagesRowsMeta.textContent = "0 of 0 rows";
      if (adminContactMessagesPagination) adminContactMessagesPagination.innerHTML = "";
      return;
    }

    const pages = Math.max(1, Math.ceil(rows.length / adminContactMessagesPageSize));
    if (adminContactMessagesPage > pages) adminContactMessagesPage = pages;
    const start = (adminContactMessagesPage - 1) * adminContactMessagesPageSize;
    const end = Math.min(start + adminContactMessagesPageSize, rows.length);
    if (adminContactMessagesRowsMeta) {
      adminContactMessagesRowsMeta.textContent = `${start + 1}-${end} of ${rows.length} rows`;
    }

    adminContactMessagesRows.innerHTML = rows
      .slice(start, end)
      .map((item) => {
        const messageId = String(item.contact_message_id || "");
        const statusUi = getContactMessageStatusUi(item.status);
        const status = statusUi.value;
        const actions = [];
        if (status === "new") {
          actions.push(`<button class="icon-btn" type="button" data-contact-message-action="read" data-contact-message-id="${escapeHtml(messageId)}">Mark as read</button>`);
        }
        if (status !== "closed") {
          actions.push(`<button class="icon-btn" type="button" data-contact-message-action="resolve" data-contact-message-id="${escapeHtml(messageId)}">Mark as resolved</button>`);
        }
        return `
        <tr>
          <td>${escapeHtml(item.name || "-")}</td>
          <td>${escapeHtml(item.email || "-")}</td>
          <td>${escapeHtml(item.subject || "-")}</td>
          <td title="${escapeHtml(item.message || "-")}">${escapeHtml(item.message || "-")}</td>
          <td><span class="admin-status-badge admin-status-badge--${escapeHtml(statusUi.badgeClass || "unknown")}">${escapeHtml(statusUi.label)}</span></td>
          <td>${escapeHtml(formatDate(item.created_at))}</td>
          <td><div class="admin-actions-cell">${actions.join("") || '<span class="admin-empty-inline">No actions</span>'}</div></td>
        </tr>
      `;
      })
      .join("");

    if (adminContactMessagesPagination) {
      adminContactMessagesPagination.innerHTML = "";
      if (pages > 1) {
        const addButton = (label, page, isActive = false, isDisabled = false) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = label;
          btn.disabled = isDisabled;
          btn.classList.toggle("active", isActive);
          btn.addEventListener("click", () => {
            adminContactMessagesPage = page;
            renderContactMessages();
          });
          adminContactMessagesPagination.appendChild(btn);
        };
        addButton("<", Math.max(1, adminContactMessagesPage - 1), false, adminContactMessagesPage === 1);
        const startPage = Math.max(1, adminContactMessagesPage - 2);
        const endPage = Math.min(pages, startPage + 4);
        for (let page = startPage; page <= endPage; page += 1) {
          addButton(String(page), page, page === adminContactMessagesPage);
        }
        addButton(">", Math.min(pages, adminContactMessagesPage + 1), false, adminContactMessagesPage === pages);
      }
    }
  };

  const renderCatalog = () => {
    if (!adminCatalogRows) return;
    const terms = getCombinedSearchTerms("catalog");
    const groupValue = activeAdminCatalogGroup || adminCatalogGroupFilter?.value || "all";
    const subcategoryValue = adminCatalogSubcategoryFilter?.value || "all";
    const rows = adminCatalog.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.group,
        item.subcategory,
        item.name,
        item.code
      ], terms);
      const matchesGroup =
        groupValue === "all" ||
        normaliseFilterToken(item.group) === normaliseFilterToken(groupValue);
      const matchesSubcategory =
        subcategoryValue === "all" ||
        normaliseFilterToken(item.subcategory) === normaliseFilterToken(subcategoryValue);
      return matchesTerm && matchesGroup && matchesSubcategory;
    });

    if (adminCatalogCount) {
      adminCatalogCount.textContent = `${rows.length} services`;
    }
    adminCatalogRows.innerHTML = "";
    adminCatalogEmptyState?.classList.toggle("is-hidden", rows.length > 0);
    if (!rows.length) {
      if (adminCatalogGroupFilter?.parentElement) {
        adminCatalogGroupFilter.parentElement.classList.add("is-hidden");
      }
      if (adminCatalogSubcategoryFilter?.parentElement) {
        adminCatalogSubcategoryFilter.parentElement.classList.add("is-hidden");
      }
      if (adminCatalogRowsMeta) adminCatalogRowsMeta.textContent = "0 of 0 rows";
      if (adminCatalogPagination) adminCatalogPagination.innerHTML = "";
      return;
    }

    const groupedRows = rows.reduce((accumulator, item) => {
      const groupKey = item.group || "-";
      const subcategoryKey = item.subcategory || "-";
      if (!accumulator[groupKey]) accumulator[groupKey] = {};
      if (!accumulator[groupKey][subcategoryKey]) accumulator[groupKey][subcategoryKey] = [];
      accumulator[groupKey][subcategoryKey].push(item);
      return accumulator;
    }, {});
    const groupedEntries = Object.entries(groupedRows);
    const hasDetailFilters =
      terms.length > 0 ||
      groupValue !== "all" ||
      subcategoryValue !== "all";
    const isOverviewMode = !hasDetailFilters;
    if (adminCatalogGroupFilter?.parentElement) {
      adminCatalogGroupFilter.parentElement.classList.toggle("is-hidden", isOverviewMode);
    }
    if (adminCatalogSubcategoryFilter?.parentElement) {
      adminCatalogSubcategoryFilter.parentElement.classList.toggle("is-hidden", isOverviewMode);
    }
    const pages = Math.max(1, Math.ceil(groupedEntries.length / adminCatalogPageSize));
    if (adminCatalogPage > pages) adminCatalogPage = pages;
    const start = (adminCatalogPage - 1) * adminCatalogPageSize;
    const end = Math.min(start + adminCatalogPageSize, groupedEntries.length);
    if (adminCatalogRowsMeta) {
      adminCatalogRowsMeta.textContent = isOverviewMode
        ? `${start + 1}-${end} of ${groupedEntries.length} groups`
        : `${start + 1}-${end} of ${groupedEntries.length} group views`;
    }

    const visibleEntries = groupedEntries.slice(start, end);
    if (isOverviewMode) {
      adminCatalogRows.innerHTML = visibleEntries
        .map(([groupName]) => `
          <section class="admin-catalog-group admin-catalog-group--overview">
            <header class="admin-catalog-group-header">
              <div class="admin-catalog-group-title">
                <h4>${escapeHtml(groupName)}</h4>
              </div>
              <div class="admin-actions-cell">
                <button class="icon-btn" type="button" data-catalog-group-action="open" data-catalog-open-group="${escapeHtml(groupName)}">Open</button>
                <button class="icon-btn" type="button" data-catalog-group-action="edit" data-catalog-group="${escapeHtml(groupName)}">Edit</button>
                <button class="icon-btn danger" type="button" data-catalog-group-action="delete" data-catalog-group="${escapeHtml(groupName)}">Delete</button>
              </div>
            </header>
          </section>
        `)
        .join("");
    } else {
      adminCatalogRows.innerHTML = visibleEntries
        .map(([groupName, subcategories]) => `
          <section class="admin-catalog-group">
            <header class="admin-catalog-group-header">
              <div class="admin-catalog-group-title">
                <h4>${escapeHtml(groupName)}</h4>
              </div>
              <button class="admin-catalog-open-btn" type="button" data-catalog-back>Back</button>
            </header>
            <div class="admin-catalog-subgroups">
              ${Object.entries(subcategories)
                .map(([subcategoryName, services]) => `
                  <section class="admin-catalog-subgroup">
                    <header class="admin-catalog-subgroup-header">
                      <h5>${escapeHtml(subcategoryName)}</h5>
                      <span>${services.length} service${services.length === 1 ? "" : "s"}</span>
                    </header>
                    <div class="admin-catalog-services">
                      ${services
                        .map((item) => `
                          <article class="admin-catalog-service">
                            <div class="admin-catalog-service-main">
                              <strong>${escapeHtml(item.name)}</strong>
                              <span>${escapeHtml(item.code)}</span>
                            </div>
                            <div class="admin-catalog-service-meta">
                              <span>${escapeHtml(String(item.base_labour_minutes ?? "-"))} min</span>
                              <span>${item.price == null ? "-" : `£${escapeHtml(Number(item.price).toFixed(2))}`}</span>
                            </div>
                            <div class="admin-actions-cell">
                              <button class="icon-btn" type="button" data-catalog-action="edit" data-catalog-service-id="${escapeHtml(String(item.service_id))}" title="Edit">Edit</button>
                              <button class="icon-btn" type="button" data-catalog-action="suspend" data-catalog-service-id="${escapeHtml(String(item.service_id))}" title="Suspend">Suspend</button>
                              <button class="icon-btn danger" type="button" data-catalog-action="delete" data-catalog-service-id="${escapeHtml(String(item.service_id))}" title="Delete">Delete</button>
                            </div>
                          </article>
                        `)
                        .join("")}
                    </div>
                  </section>
                `)
                .join("")}
            </div>
          </section>
        `)
        .join("");
    }

    if (adminCatalogPagination) {
      adminCatalogPagination.innerHTML = "";
      if (pages > 1) {
        const addButton = (label, page, isActive = false, isDisabled = false) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = label;
          btn.disabled = isDisabled;
          btn.classList.toggle("active", isActive);
          btn.addEventListener("click", () => {
            adminCatalogPage = page;
            renderCatalog();
          });
          adminCatalogPagination.appendChild(btn);
        };
        addButton("<", Math.max(1, adminCatalogPage - 1), false, adminCatalogPage === 1);
        const startPage = Math.max(1, adminCatalogPage - 2);
        const endPage = Math.min(pages, startPage + 4);
        for (let page = startPage; page <= endPage; page += 1) {
          addButton(String(page), page, page === adminCatalogPage);
        }
        addButton(">", Math.min(pages, adminCatalogPage + 1), false, adminCatalogPage === pages);
      }
    }
  };

  const renderUsers = (users) => {
    adminUserRows.innerHTML = "";
    const total = adminUsers.length;
    adminUserCount.textContent = `${filteredUsers.length} of ${total} users total`;

    if (users.length === 0) {
      adminEmptyState.classList.remove("is-hidden");
      if (adminUsersSelectAll) {
        adminUsersSelectAll.checked = false;
        adminUsersSelectAll.indeterminate = false;
      }
      return;
    }

    adminEmptyState.classList.add("is-hidden");

    users.forEach((user, index) => {
      const row = document.createElement("tr");
      const status = getStatus(user, index);
      const role = user.role_name || "-";
      const normalisedRole = String(role).trim().toUpperCase();
      const canDeleteUser = normalisedRole === "MECHANIC" || normalisedRole === "CUSTOMER";
      const canEditRole = normalisedRole !== "ADMIN";
      const canEditUser = normalisedRole !== "ADMIN";
      const experience = getExperience(user);
      const joinedDate = formatDate(user.created_at);
      const lastActive = getLastActive(user, index);
      const avatarUrl = getAvatarUrl(user);
      const statusClass = String(status).toLowerCase().replace(/\s+/g, "-");
      const firstName = user.name || user.full_name?.split(" ")[0] || "";
      const lastName = user.lastname || user.full_name?.split(" ").slice(1).join(" ") || "";
      const fullName = `${firstName} ${lastName}`.trim() || user.full_name || user.email || "Unknown user";
      const displayName = fullName;
      const userId = String(user.user_id || user.id || `${index}`);
      const isChecked = selectedAdminUsers.has(userId);
      row.innerHTML = `
        <td class="table-check">
          <input type="checkbox" aria-label="Select ${displayName}" data-user-select="${userId}" ${isChecked ? "checked" : ""} />
        </td>
        <td>
          <div class="user-cell">
            <div class="avatar">
              ${avatarUrl ? `<img src="${avatarUrl}" alt="" />` : escapeHtml(getInitials(displayName))}
            </div>
            <div class="user-meta">
              <strong>${fullName}</strong>
            </div>
          </div>
        </td>
        <td>${user.email || `ID ${user.user_id}`}</td>
        <td>${user.username || "-"}</td>
        <td><span class="admin-status-badge admin-status-badge--${statusClass}">${status}</span></td>
        <td>${role}</td>
        <td>${experience}</td>
        <td>${joinedDate}</td>
        <td>${lastActive}</td>
        <td class="table-actions">
          <div class="admin-actions-cell">
            <button class="icon-btn" type="button" title="${canEditUser ? "Edit options" : "Admin users cannot be edited here"}" data-admin-edit-toggle="${userId}" ${canEditUser ? "" : "disabled"}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
            </button>
            <div class="admin-edit-menu is-hidden" data-admin-edit-menu="${userId}">
              <button type="button" data-admin-edit-field="full_name" data-admin-edit-user="${userId}">Full name</button>
              <button type="button" data-admin-edit-field="phone" data-admin-edit-user="${userId}">Phone</button>
              <button type="button" data-admin-edit-field="username" data-admin-edit-user="${userId}">Username</button>
              <button type="button" data-admin-edit-field="address" data-admin-edit-user="${userId}">Address</button>
              <button type="button" data-admin-edit-field="role" data-admin-edit-user="${userId}" title="${canEditRole ? "Edit role" : "Admin role cannot be changed here"}" ${canEditRole ? "" : "disabled"}>Role</button>
              <button type="button" data-admin-edit-field="status" data-admin-edit-user="${userId}">Status</button>
            </div>
            <button
              class="icon-btn danger"
              type="button"
              title="${canDeleteUser ? `Delete ${displayName}` : "Admin users cannot be deleted"}"
              data-admin-delete-user="${userId}"
              data-admin-delete-name="${escapeHtml(displayName)}"
              data-admin-delete-role="${escapeHtml(role)}"
              ${canDeleteUser ? "" : "disabled"}
            >
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

    adminUserRows.querySelectorAll("[data-admin-edit-toggle]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const userId = event.currentTarget.getAttribute("data-admin-edit-toggle");
        const menu = adminUserRows.querySelector(`[data-admin-edit-menu="${userId}"]`);
        if (!menu) return;
        const willOpen = menu.classList.contains("is-hidden");
        closeAdminEditMenus();
        menu.classList.toggle("is-hidden", !willOpen);
      });
    });

    adminUserRows.querySelectorAll("[data-admin-edit-field]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const userId = event.currentTarget.getAttribute("data-admin-edit-user");
        const field = event.currentTarget.getAttribute("data-admin-edit-field");
        const user = adminUsers.find((item) => String(item.user_id) === String(userId));
        closeAdminEditMenus();
        openAdminSettingsEditModal(user, field);
      });
    });

    adminUserRows.querySelectorAll("[data-admin-delete-user]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.currentTarget;
        if (target.disabled) return;
        const userId = target.getAttribute("data-admin-delete-user");
        const name = target.getAttribute("data-admin-delete-name") || "this user";
        const role = target.getAttribute("data-admin-delete-role") || "";
        if (!userId) return;
        openAdminDeleteModal({ userId, name, role });
      });
    });

    adminUserRows.querySelectorAll("[data-user-select]").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const userId = event.currentTarget.getAttribute("data-user-select");
        if (!userId) return;
        if (event.currentTarget.checked) {
          selectedAdminUsers.add(userId);
        } else {
          selectedAdminUsers.delete(userId);
        }
        const visibleIds = users.map((user, index) => String(user.user_id || user.id || `${index}`));
        const selectedVisible = visibleIds.filter((id) => selectedAdminUsers.has(id)).length;
        if (adminUsersSelectAll) {
          adminUsersSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
          adminUsersSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
        }
      });
    });

    if (adminUsersSelectAll) {
      const visibleIds = users.map((user, index) => String(user.user_id || user.id || `${index}`));
      const selectedVisible = visibleIds.filter((id) => selectedAdminUsers.has(id)).length;
      adminUsersSelectAll.checked = selectedVisible > 0 && selectedVisible === visibleIds.length;
      adminUsersSelectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }
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
    const sortedUsers = sortAdminUsers(filteredUsers);
    const total = sortedUsers.length;
    if (total === 0) {
      adminRowsMeta.textContent = "0 of 0 rows";
      renderUsers([]);
      adminPagination.innerHTML = "";
      syncAdminUserSortUi();
      return;
    }
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > pages) currentPage = pages;
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    adminRowsMeta.textContent = `${start + 1}-${end} of ${total} rows`;
    renderUsers(sortedUsers.slice(start, end));
    renderPagination(pages);
    syncAdminUserSortUi();
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
        const currentProfile = getAdminProfile();
        const currentAdmin = adminUsers.find((user) => {
          const rowId = String(user.user_id || user.id || "");
          const profileId = String(currentProfile?.id || currentProfile?.user_id || "");
          return rowId && profileId && rowId === profileId;
        });
        if (currentAdmin) {
          setAdminHeader({
            ...currentProfile,
            ...currentAdmin,
            role_name: "ADMIN"
          });
        }
        if (activeAdminView === "users") {
          configureAdminSide("users");
        }
        applyFilters();
      } catch (err) {
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
    const token = getAdminToken();
    const profile = getAdminProfile();
    const activeRole = String(getStoredAuthValue("activeRole") || "").toUpperCase();
    const roles = Array.isArray(profile?.roles) && profile.roles.length
      ? profile.roles.map((role) => String(role || "").toUpperCase())
      : [String(profile?.role_name || profile?.role || "").toUpperCase()].filter(Boolean);
    const isAdmin = activeRole === "ADMIN" || roles.includes("ADMIN");
    if (token && (isAdmin || activeRole === "ADMIN")) {
      setAdminHeader({ ...(profile || {}), role_name: "ADMIN" });
      setAdminVisibility(true);
      return true;
    }
    setAdminHeader(null);
    setAdminVisibility(false);
    return false;
  };

  const fetchApplications = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      adminApplications = await apiAuth("/api/admin/applications", token);
      configureAdminSide(activeAdminView);
      renderAdminDashboard();
      renderApplications();
    } catch (err) {
      console.error("Unable to load admin applications", err);
    }
  };

  const syncAdminCurrentProfile = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      const profile = await apiAuth("/api/users/me", token);
      setStoredAuthValue("userProfile", JSON.stringify(profile));
      setAdminHeader({ ...profile, role_name: "ADMIN" });
    } catch {}
  };

  const updateAdminApplicationStatus = async (userId, action) => {
    const token = getAdminToken();
    if (!token) return;
    const updated = await apiAuth(`/api/admin/applications/${encodeURIComponent(userId)}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ action })
    });
    adminApplications = adminApplications.map((item) =>
      Number(item.user_id) === Number(userId) ? { ...item, ...updated } : item
    );
    configureAdminSide(activeAdminView);
    renderApplications();
    fetchDashboardSummary();
    showAdminFeedback(`Application updated: ${titleCase(action)}.`);
  };

  const fetchBookings = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      adminBookings = await apiAuth("/api/admin/bookings", token);
      syncAdminBookingHeadFilters();
      configureAdminSide(activeAdminView);
      renderAdminDashboard();
      renderBookings();
    } catch (err) {
      console.error("Unable to load admin bookings", err);
    }
  };

  const updateAdminBookingStatus = async (bookingId, action) => {
    const token = getAdminToken();
    if (!token) return;
    const updated = await apiAuth(`/api/admin/bookings/${encodeURIComponent(bookingId)}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ action })
    });
    adminBookings = adminBookings.map((item) =>
      Number(item.booking_id) === Number(bookingId) ? { ...item, ...updated } : item
    );
    syncAdminBookingHeadFilters();
    configureAdminSide(activeAdminView);
    renderBookings();
    fetchDashboardSummary();
    showAdminFeedback(`Booking updated: ${titleCase(action)}.`);
  };

  const fetchResolutionCases = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      adminResolutionCases = await apiAuth("/api/admin/resolution-cases", token);
      syncAdminResolutionHeadFilters();
      configureAdminSide(activeAdminView);
      renderAdminDashboard();
      renderResolutionCases();
    } catch (err) {
      console.error("Unable to load admin resolution cases", err);
    }
  };

  const updateAdminResolutionCaseStatus = async (caseId, action) => {
    const token = getAdminToken();
    if (!token) return;
    const updated = await apiAuth(`/api/admin/resolution-cases/${encodeURIComponent(caseId)}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ action })
    });
    adminResolutionCases = adminResolutionCases.map((item) =>
      Number(item.case_id) === Number(caseId) ? { ...item, ...updated } : item
    );
    syncAdminResolutionHeadFilters();
    configureAdminSide(activeAdminView);
    renderResolutionCases();
    fetchDashboardSummary();
    showAdminFeedback(`Case updated: ${titleCase(action)}.`);
  };

  const fetchDashboardSummary = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      const summary = await apiAuth("/api/admin/dashboard-summary", token);
      const bookingsToday = String(summary.bookings_today ?? 0);
      const openCases = String(summary.open_cases ?? 0);
      const pendingApplications = String(summary.pending_applications ?? 0);
      const pendingPayouts = String(summary.pending_payouts ?? 0);
      if (adminMetricBookingsToday) adminMetricBookingsToday.textContent = bookingsToday;
      if (adminMetricBookingsTodayCard) adminMetricBookingsTodayCard.textContent = bookingsToday;
      if (adminMetricOpenCases) adminMetricOpenCases.textContent = openCases;
      if (adminMetricOpenCasesCard) adminMetricOpenCasesCard.textContent = openCases;
      if (adminMetricPendingApplications) {
        adminMetricPendingApplications.textContent = pendingApplications;
      }
      if (adminMetricPendingApplicationsCard) adminMetricPendingApplicationsCard.textContent = pendingApplications;
      if (adminMetricPendingPayouts) adminMetricPendingPayouts.textContent = pendingPayouts;
      if (adminMetricPendingPayoutsCard) adminMetricPendingPayoutsCard.textContent = pendingPayouts;
      renderAdminDashboard();
    } catch (err) {
      console.error("Unable to load admin dashboard summary", err);
    }
  };

  const fetchContactMessages = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      adminContactMessages = await apiAuth("/api/admin/contact-messages", token);
      syncAdminContactMessagesHeadFilters();
      configureAdminSide(activeAdminView);
      renderAdminDashboard();
      renderContactMessages();
    } catch (err) {
      console.error("Unable to load admin contact messages", err);
    }
  };

  const updateContactMessageStatus = async (messageId, action) => {
    const token = getAdminToken();
    if (!token) return;
    const updated = await apiAuth(`/api/admin/contact-messages/${encodeURIComponent(messageId)}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ action })
    });
    adminContactMessages = adminContactMessages.map((item) =>
      Number(item.contact_message_id) === Number(messageId) ? { ...item, ...updated } : item
    );
    syncAdminContactMessagesHeadFilters();
    configureAdminSide(activeAdminView);
    renderAdminDashboard();
    renderContactMessages();
    showAdminFeedback(`Message updated: ${action === "resolve" ? "resolved" : "marked as read"}.`);
  };

  const fetchPayments = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      adminPayments = await apiAuth("/api/admin/payments", token);
      syncAdminPaymentsHeadFilters();
      configureAdminSide(activeAdminView);
      renderAdminDashboard();
      renderPayments();
    } catch (err) {
      console.error("Unable to load admin payments", err);
    }
  };

  const updateAdminPaymentStatus = async (recordId, kind, action) => {
    const token = getAdminToken();
    if (!token) return;
    const updated = await apiAuth(`/api/admin/payments/${encodeURIComponent(recordId)}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ kind, action })
    });
    adminPayments = adminPayments.map((item) =>
      String(item.kind) === String(kind) && Number(item.record_id) === Number(recordId) ? { ...item, ...updated } : item
    );
    syncAdminPaymentsHeadFilters();
    configureAdminSide(activeAdminView);
    renderPayments();
    fetchDashboardSummary();
    showAdminFeedback(`Payment updated: ${titleCase(action)}.`);
  };

  const fetchCatalog = async () => {
    try {
      const tree = await api("/api/catalog/services-tree?region=UK-default");
      adminCatalog = [];
      (tree || []).forEach((group) => {
        (group.subcategories || []).forEach((subcategory) => {
          (subcategory.services || []).forEach((service) => {
            adminCatalog.push({
              service_id: service.id,
              group: group.label || group.key || "-",
              subcategory: subcategory.label || subcategory.key || "-",
              name: service.name || "-",
              code: service.code || "-",
              base_labour_minutes: service.base_labour_minutes,
              display_order: service.display_order,
              price: service.price
            });
          });
        });
      });
      syncAdminCatalogHeadFilters();
      configureAdminSide(activeAdminView);
      renderCatalog();
    } catch (err) {
      console.error("Unable to load admin catalog", err);
    }
  };

  const updateAdminCatalogOrder = async (serviceId, direction) => {
    const token = getAdminToken();
    if (!token) return;
    const updated = await apiAuth(`/api/admin/catalog/${encodeURIComponent(serviceId)}/order`, token, {
      method: "PATCH",
      body: JSON.stringify({ direction })
    });
    adminCatalog = adminCatalog
      .map((item) =>
        Number(item.service_id) === Number(serviceId)
          ? { ...item, ...updated }
          : item
      )
      .sort((a, b) => {
        const groupSort = String(a.group).localeCompare(String(b.group));
        if (groupSort !== 0) return groupSort;
        const subSort = String(a.subcategory).localeCompare(String(b.subcategory));
        if (subSort !== 0) return subSort;
        const orderSort = Number(a.display_order || 0) - Number(b.display_order || 0);
        if (orderSort !== 0) return orderSort;
        return String(a.name).localeCompare(String(b.name));
      });
    configureAdminSide(activeAdminView);
    renderCatalog();
    showAdminFeedback(`Catalog order updated: moved ${titleCase(direction)}.`);
  };

  adminLogoutBtn?.addEventListener("click", () => {
    clearAdminSession();
    window.location.replace("/");
  });

  railNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const view = link.dataset.view;
      activeAdminView = view;
      railNavLinks.forEach((btn) => btn.classList.toggle("active", btn === link));
      configureAdminSide(view);
      setAdminHeroByView(view);
      adminDashboardView?.classList.toggle("is-hidden", view !== "dashboard");
      adminApplicationsView?.classList.toggle("is-hidden", view !== "applications");
      adminBookingsView?.classList.toggle("is-hidden", view !== "bookings");
      adminResolutionView?.classList.toggle("is-hidden", view !== "resolution");
      adminPaymentsView?.classList.toggle("is-hidden", view !== "payments");
      adminCatalogView?.classList.toggle("is-hidden", view !== "catalog");
      adminContactMessagesView?.classList.toggle("is-hidden", view !== "contact-messages");
      adminProfileView.classList.toggle("is-hidden", view !== "profile" && view !== "account");
      adminUsersView.classList.toggle("is-hidden", view !== "users");
      adminSettingsView?.classList.toggle("is-hidden", view !== "settings");
      if (view === "contact-messages") {
        renderContactMessages();
      }
    });
  });

  adminSettingsSubnavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setAdminSettingsSubview(link.dataset.adminSettingsSubview || "general");
    });
  });

  adminSettingsActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.adminSettingsField;
      const profile = getAdminProfile();
      if (!field || !profile) return;
      openAdminSettingsEditModal(profile, field);
    });
  });

  adminSettingsPhotoBtn?.addEventListener("click", () => {
    adminSettingsPhotoInput?.click();
  });

  adminSettingsPhotoInput?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    const token = getAdminToken();
    if (!file || !token) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:3000/api/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const payload = await response.json();
      if (!response.ok) throw payload;

      setStoredAuthValue("userProfile", JSON.stringify(payload));
      setAdminHeader({ ...payload, role_name: "ADMIN" });
      showAdminFeedback("Profile photo updated.");
    } catch (err) {
      console.error("Unable to upload admin avatar", err);
      window.alert(err?.error?.message || err?.message || "Unable to upload this image.");
    } finally {
      event.target.value = "";
    }
  });

  adminSettingsThemeBtn?.addEventListener("click", () => {
    const isDark = (adminSettingsThemeValue?.textContent || "").trim().toLowerCase() !== "light mode";
    const nextLabel = isDark ? "Light mode" : "Dark mode";
    if (adminSettingsThemeValue) adminSettingsThemeValue.textContent = nextLabel;
    adminSettingsThemeBtn.textContent = nextLabel;
  });

  adminNotificationsMarketing?.addEventListener("change", () => {
    const updateButton = adminNotificationsMarketing
      .closest(".notifications-card")
      ?.querySelector(".notifications-actions .ghost");
    if (updateButton) {
      updateButton.disabled = false;
    }
  });

  adminSecurity2faEmail?.addEventListener("change", syncAdminSecurity2faButton);
  adminSecurity2faSms?.addEventListener("change", syncAdminSecurity2faButton);
  adminSecurity2faEnable?.addEventListener("click", async () => {
    const token = getAdminToken();
    if (!token) return;
    if (adminSecurity2faMessage) adminSecurity2faMessage.textContent = "";
    try {
      const result = await apiAuth("/api/users/me/security/two-factor", token, {
        method: "PATCH",
        body: JSON.stringify({
          two_factor_email_enabled: Boolean(adminSecurity2faEmail?.checked)
        })
      });
      if (result) {
        setStoredAuthValue("userProfile", JSON.stringify(result));
      }
      syncAdminSecurity2faButton();
      if (adminSecurity2faMessage) {
        adminSecurity2faMessage.textContent = adminSecurity2faEmail?.checked
          ? "Email 2FA enabled."
          : "Email 2FA disabled.";
      }
    } catch (err) {
      console.error("Unable to update admin two factor settings", err);
      if (adminSecurity2faMessage) {
        adminSecurity2faMessage.textContent = err?.error?.message || err?.message || "Unable to update two factor settings.";
      }
    }
  });

  adminDashboardView?.addEventListener("click", (event) => {
    const targetButton = event.target.closest("[data-admin-dashboard-target]");
    if (!targetButton) return;
    const targetView = targetButton.dataset.adminDashboardTarget;
    const navButton = Array.from(railNavLinks).find((button) => button.dataset.view === targetView);
    navButton?.click();
  });

  adminExportBtn?.addEventListener("click", exportUsers);
  adminSearch?.addEventListener("input", () => {
    syncAdminViewSearchFromSide();
    if (activeAdminView === "users") return applyFilters();
    if (activeAdminView === "applications") return renderApplications();
    if (activeAdminView === "bookings") return renderBookings();
    if (activeAdminView === "resolution") return renderResolutionCases();
    if (activeAdminView === "payments") return renderPayments();
    if (activeAdminView === "contact-messages") return renderContactMessages();
    if (activeAdminView === "catalog") return renderCatalog();
  });
  adminApplicationsSearch?.addEventListener("input", () => {
      syncAdminSideSearchFromView();
    adminApplicationsPage = 1;
    renderApplications();
    });
  adminApplicationsRows?.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("[data-application-action]");
    if (!actionButton) return;
    const userId = Number(actionButton.dataset.applicationUserId);
    const action = actionButton.dataset.applicationAction;
    if (!userId || !action) return;
    actionButton.disabled = true;
    try {
      await updateAdminApplicationStatus(userId, action);
    } catch (err) {
      console.error("Unable to update application status", err);
      showAdminFeedback(err?.error?.message || err?.message || "Unable to update application.", "error");
    } finally {
      actionButton.disabled = false;
    }
  });
  adminBookingsSearch?.addEventListener("input", () => {
    syncAdminSideSearchFromView();
    adminBookingsPage = 1;
    renderBookings();
  });
  adminBookingsTypeFilter?.addEventListener("change", () => {
    adminBookingsPage = 1;
    renderBookings();
  });
  adminBookingsStatusFilter?.addEventListener("change", () => {
    adminBookingsPage = 1;
    renderBookings();
  });
  adminBookingsDateFilter?.addEventListener("change", () => {
    adminBookingsPage = 1;
    renderBookings();
  });
  adminBookingsRowsPerPage?.addEventListener("change", () => {
    adminBookingsPageSize = Number(adminBookingsRowsPerPage.value);
    adminBookingsPage = 1;
    renderBookings();
  });
  adminBookingSortHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const key = header.dataset.bookingSortKey;
      if (!key) return;
      if (adminBookingSort.key === key) {
        adminBookingSort.direction = adminBookingSort.direction === "asc" ? "desc" : "asc";
      } else {
        adminBookingSort = { key, direction: "asc" };
      }
      adminBookingsPage = 1;
      renderBookings();
    });
  });
  adminBookingsRows?.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("[data-booking-action]");
    if (!actionButton) return;
    const bookingId = Number(actionButton.dataset.bookingId);
    const action = actionButton.dataset.bookingAction;
    if (!bookingId || !action) return;
    actionButton.disabled = true;
    try {
      await updateAdminBookingStatus(bookingId, action);
    } catch (err) {
      console.error("Unable to update booking status", err);
      showAdminFeedback(err?.error?.message || err?.message || "Unable to update booking.", "error");
    } finally {
      actionButton.disabled = false;
    }
  });
  adminBookingsExportBtn?.addEventListener("click", () => {
    const headers = ["Reference", "Status", "Customer", "Mechanic", "Vehicle", "Location", "Total", "Created"];
    const rows = adminBookings.map((item) => [
      item.reference,
      item.status,
      item.customer_name,
      item.mechanic_name,
      item.vehicle,
      item.location,
      Number(item.total || 0).toFixed(2),
      formatDate(item.created_at)
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings-overview.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
  adminResolutionSearch?.addEventListener("input", () => {
    syncAdminSideSearchFromView();
    adminResolutionPage = 1;
    renderResolutionCases();
  });
  adminResolutionTypeFilter?.addEventListener("change", () => {
    adminResolutionPage = 1;
    renderResolutionCases();
  });
  adminResolutionStatusFilter?.addEventListener("change", () => {
    adminResolutionPage = 1;
    renderResolutionCases();
  });
  adminResolutionDateFilter?.addEventListener("change", () => {
    adminResolutionPage = 1;
    renderResolutionCases();
  });
  adminResolutionRowsPerPage?.addEventListener("change", () => {
    adminResolutionPageSize = Number(adminResolutionRowsPerPage.value);
    adminResolutionPage = 1;
    renderResolutionCases();
  });
  adminResolutionRows?.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("[data-resolution-action]");
    if (!actionButton) return;
    const caseId = Number(actionButton.dataset.resolutionCaseId);
    const action = actionButton.dataset.resolutionAction;
    if (!caseId || !action) return;
    actionButton.disabled = true;
    try {
      await updateAdminResolutionCaseStatus(caseId, action);
    } catch (err) {
      console.error("Unable to update resolution case status", err);
      showAdminFeedback(err?.error?.message || err?.message || "Unable to update case.", "error");
    } finally {
      actionButton.disabled = false;
    }
  });
  adminResolutionExportBtn?.addEventListener("click", () => {
    const headers = ["Reference", "Type", "Subject", "Status", "Customer", "Mechanic", "Updated"];
    const rows = adminResolutionCases.map((item) => [
      item.reference,
      titleCase(item.type),
      item.subject,
      titleCase(item.status),
      item.customer_name,
      item.mechanic_name,
      formatDate(item.updated_at)
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resolution-cases.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
  adminResolutionSelectAll?.addEventListener("change", () => {
    const terms = getCombinedSearchTerms("resolution");
    const typeValue = adminResolutionTypeFilter?.value || adminRoleFilter?.value || "all";
    const statusValue = adminResolutionStatusFilter?.value || adminStatusFilter?.value || "all";
    const dateValue = adminResolutionDateFilter?.value || adminDateFilter?.value || "all";
    const rows = adminResolutionCases.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.reference,
        item.type,
        item.subject,
        item.status,
        item.customer_name,
        item.mechanic_name
      ], terms);
      const matchesType =
        typeValue === "all" ||
        normaliseFilterToken(item.type) === normaliseFilterToken(typeValue);
      const matchesStatus =
        statusValue === "all" ||
        normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.updated_at, dateValue);
      return matchesTerm && matchesType && matchesStatus && matchesDate;
    });
    const start = (adminResolutionPage - 1) * adminResolutionPageSize;
    const end = Math.min(start + adminResolutionPageSize, rows.length);
    rows.slice(start, end).forEach((item) => {
      const caseId = String(item.case_id || item.id || item.reference || "");
      if (adminResolutionSelectAll.checked) {
        selectedAdminResolutionCases.add(caseId);
      } else {
        selectedAdminResolutionCases.delete(caseId);
      }
    });
    renderResolutionCases();
  });
  adminPaymentsSearch?.addEventListener("input", () => {
    syncAdminSideSearchFromView();
    adminPaymentsPage = 1;
    renderPayments();
  });
  adminPaymentsKindFilter?.addEventListener("change", () => {
    adminPaymentsPage = 1;
    renderPayments();
  });
  adminPaymentsStatusFilter?.addEventListener("change", () => {
    adminPaymentsPage = 1;
    renderPayments();
  });
  adminPaymentsDateFilter?.addEventListener("change", () => {
    adminPaymentsPage = 1;
    renderPayments();
  });
  adminPaymentsRowsPerPage?.addEventListener("change", () => {
    adminPaymentsPageSize = Number(adminPaymentsRowsPerPage.value);
    adminPaymentsPage = 1;
    renderPayments();
  });
  adminPaymentsExportBtn?.addEventListener("click", () => {
    const headers = ["Reference", "Kind", "Booking", "Party", "Provider", "Status", "Amount", "Created"];
    const rows = adminPayments.map((item) => [
      item.reference,
      titleCase(item.kind),
      item.booking_reference || "-",
      item.party,
      item.provider,
      titleCase(item.status),
      Number(item.amount || 0).toFixed(2),
      formatDate(item.created_at)
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payments-overview.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
  adminPaymentsSelectAll?.addEventListener("change", () => {
    const terms = getCombinedSearchTerms("payments");
    const kindValue = adminPaymentsKindFilter?.value || adminRoleFilter?.value || "all";
    const statusValue = adminPaymentsStatusFilter?.value || adminStatusFilter?.value || "all";
    const dateValue = adminPaymentsDateFilter?.value || adminDateFilter?.value || "all";
    const rows = adminPayments.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.reference,
        item.kind,
        item.booking_reference,
        item.party,
        item.provider,
        item.status
      ], terms);
      const matchesKind =
        kindValue === "all" ||
        normaliseFilterToken(item.kind) === normaliseFilterToken(kindValue);
      const matchesStatus =
        statusValue === "all" ||
        normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.created_at, dateValue);
      return matchesTerm && matchesKind && matchesStatus && matchesDate;
    });
    const start = (adminPaymentsPage - 1) * adminPaymentsPageSize;
    const end = Math.min(start + adminPaymentsPageSize, rows.length);
    rows.slice(start, end).forEach((item) => {
      const paymentId = String(item.record_id || item.id || item.reference || "");
      if (adminPaymentsSelectAll.checked) {
        selectedAdminPayments.add(paymentId);
      } else {
        selectedAdminPayments.delete(paymentId);
      }
    });
    renderPayments();
  });
  adminPaymentsRows?.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("[data-payment-action]");
    if (!actionButton) return;
    const recordId = Number(actionButton.dataset.paymentRecordId);
    const kind = actionButton.dataset.paymentKind;
    const action = actionButton.dataset.paymentAction;
    if (!recordId || !kind || !action) return;
    actionButton.disabled = true;
    try {
      await updateAdminPaymentStatus(recordId, kind, action);
    } catch (err) {
      console.error("Unable to update payment status", err);
      showAdminFeedback(err?.error?.message || err?.message || "Unable to update payment.", "error");
    } finally {
      actionButton.disabled = false;
    }
  });
  adminContactMessagesSearch?.addEventListener("input", () => {
    syncAdminSideSearchFromView();
    adminContactMessagesPage = 1;
    renderContactMessages();
  });
  adminContactMessagesStatusFilter?.addEventListener("change", () => {
    adminContactMessagesPage = 1;
    renderContactMessages();
  });
  adminContactMessagesDateFilter?.addEventListener("change", () => {
    adminContactMessagesPage = 1;
    renderContactMessages();
  });
  adminContactMessagesRowsPerPage?.addEventListener("change", () => {
    adminContactMessagesPageSize = Number(adminContactMessagesRowsPerPage.value || 10);
    adminContactMessagesPage = 1;
    renderContactMessages();
  });
  adminContactMessagesExportBtn?.addEventListener("click", () => {
    const headers = ["Name", "Email", "Subject", "Message", "Status", "Created"];
    const rows = adminContactMessages
      .filter((item) => {
        const matchesTerm = matchesSearchTerms([
          item.name,
          item.email,
          item.subject,
          item.message,
          item.status,
          item.source
        ], getCombinedSearchTerms("contact-messages"));
        const statusValue = adminContactMessagesStatusFilter?.value || "all";
        const dateValue = adminContactMessagesDateFilter?.value || "all";
        const matchesStatus =
          statusValue === "all" ||
          normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
        const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.created_at, dateValue);
        return matchesTerm && matchesStatus && matchesDate;
      })
      .map((item) => [
        item.name || "",
        item.email || "",
        item.subject || "",
        item.message || "",
        getContactMessageStatusUi(item.status).label,
        formatDate(item.created_at)
      ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contact-messages.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
  adminContactMessagesRows?.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("[data-contact-message-action]");
    if (!actionButton) return;
    const messageId = actionButton.dataset.contactMessageId;
    const action = actionButton.dataset.contactMessageAction;
    if (!messageId || !action) return;
    actionButton.disabled = true;
    try {
      await updateContactMessageStatus(messageId, action);
    } catch (err) {
      console.error("Unable to update contact message", err);
      showAdminFeedback(err?.error?.message || err?.message || "Unable to update contact message.", "error");
    } finally {
      actionButton.disabled = false;
    }
  });
  adminCatalogSearch?.addEventListener("input", () => {
    syncAdminSideSearchFromView();
    adminCatalogPage = 1;
    renderCatalog();
  });
  adminCatalogGroupFilter?.addEventListener("change", () => {
    activeAdminCatalogGroup = adminCatalogGroupFilter.value === "all" ? null : adminCatalogGroupFilter.value;
    adminCatalogPage = 1;
    renderCatalog();
  });
  adminCatalogSubcategoryFilter?.addEventListener("change", () => {
    adminCatalogPage = 1;
    renderCatalog();
  });
  adminCatalogRowsPerPage?.addEventListener("change", () => {
    adminCatalogPageSize = Number(adminCatalogRowsPerPage.value || 10);
    adminCatalogPage = 1;
    renderCatalog();
  });
  adminCatalogExportBtn?.addEventListener("click", () => {
    const terms = getCombinedSearchTerms("catalog");
    const groupValue = adminCatalogGroupFilter?.value || "all";
    const subcategoryValue = adminCatalogSubcategoryFilter?.value || "all";
    const rows = adminCatalog.filter((item) => {
      const matchesTerm = matchesSearchTerms([item.group, item.subcategory, item.name, item.code], terms);
      const matchesGroup =
        groupValue === "all" ||
        normaliseFilterToken(item.group) === normaliseFilterToken(groupValue);
      const matchesSubcategory =
        subcategoryValue === "all" ||
        normaliseFilterToken(item.subcategory) === normaliseFilterToken(subcategoryValue);
      return matchesTerm && matchesGroup && matchesSubcategory;
    });
    const header = ["Group", "Subcategory", "Service", "Code", "Labour", "Price"];
    const lines = rows.map((item) => [
      item.group || "",
      item.subcategory || "",
      item.name || "",
      item.code || "",
      String(item.base_labour_minutes ?? ""),
      item.price == null ? "" : Number(item.price).toFixed(2)
    ]);
    const csv = [header, ...lines]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "catalog.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
  adminCatalogAddGroupBtn?.addEventListener("click", () => {
    showAdminFeedback("Add Group is not available yet.");
  });
  adminCatalogRows?.addEventListener("click", async (event) => {
    const backButton = event.target.closest("[data-catalog-back]");
    if (backButton) {
      activeAdminCatalogGroup = null;
      if (adminCatalogGroupFilter) {
        adminCatalogGroupFilter.value = "all";
      }
      adminCatalogPage = 1;
      renderCatalog();
      return;
    }
    const groupActionButton = event.target.closest("[data-catalog-group-action]");
    if (groupActionButton) {
      const action = groupActionButton.getAttribute("data-catalog-group-action");
      const groupName = groupActionButton.getAttribute("data-catalog-group") || groupActionButton.getAttribute("data-catalog-open-group");
      if (action === "open") {
        activeAdminCatalogGroup = groupActionButton.getAttribute("data-catalog-open-group");
        if (adminCatalogGroupFilter) {
          adminCatalogGroupFilter.value = activeAdminCatalogGroup || "all";
        }
        adminCatalogPage = 1;
        renderCatalog();
        return;
      }
      if (action === "edit") {
        showAdminFeedback(`Edit for ${groupName || "group"} is not available yet.`);
        return;
      }
      if (action === "delete") {
        showAdminFeedback(`Delete for ${groupName || "group"} is not available yet.`, "error");
        return;
      }
    }
    const openGroupButton = event.target.closest("[data-catalog-open-group]");
    if (openGroupButton) {
      activeAdminCatalogGroup = openGroupButton.getAttribute("data-catalog-open-group");
      if (adminCatalogGroupFilter) {
        adminCatalogGroupFilter.value = activeAdminCatalogGroup || "all";
      }
      adminCatalogPage = 1;
      renderCatalog();
      return;
    }
    const actionButton = event.target.closest("[data-catalog-action]");
    if (!actionButton) return;
    const serviceId = Number(actionButton.dataset.catalogServiceId);
    const action = actionButton.dataset.catalogAction;
    if (!serviceId || !action) return;
    const service = adminCatalog.find((item) => Number(item.service_id) === serviceId);
    const serviceName = service?.name || "Service";
    if (action === "edit") {
      showAdminFeedback(`Edit for ${serviceName} is not available yet.`);
      return;
    }
    if (action === "suspend") {
      showAdminFeedback(`Suspend for ${serviceName} is not available yet.`);
      return;
    }
    if (action === "delete") {
      showAdminFeedback(`Delete for ${serviceName} is not available yet.`, "error");
    }
  });
  adminApplicationsTypeFilter?.addEventListener("change", () => {
    adminApplicationsPage = 1;
    renderApplications();
  });
  adminApplicationsStatusFilter?.addEventListener("change", () => {
    adminApplicationsPage = 1;
    renderApplications();
  });
  adminApplicationsDateFilter?.addEventListener("change", () => {
    adminApplicationsPage = 1;
    renderApplications();
  });
  adminApplicationsRowsPerPage?.addEventListener("change", () => {
    adminApplicationsPageSize = Number(adminApplicationsRowsPerPage.value);
    adminApplicationsPage = 1;
    renderApplications();
  });
  adminApplicationSortHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const key = header.dataset.appSortKey;
      if (!key) return;
      if (adminApplicationSort.key === key) {
        adminApplicationSort.direction = adminApplicationSort.direction === "asc" ? "desc" : "asc";
      } else {
        adminApplicationSort = { key, direction: "asc" };
      }
      adminApplicationsPage = 1;
      renderApplications();
    });
  });

  adminRoleFilter?.addEventListener("change", () => {
      if (activeAdminView === "users") return applyFilters();
      if (activeAdminView === "applications") return renderApplications();
      if (activeAdminView === "resolution") return renderResolutionCases();
    if (activeAdminView === "payments") return renderPayments();
    if (activeAdminView === "contact-messages") return renderContactMessages();
    if (activeAdminView === "catalog") return renderCatalog();
  });
  adminStatusFilter?.addEventListener("change", () => {
    if (activeAdminView === "users") return applyFilters();
    if (activeAdminView === "applications") return renderApplications();
    if (activeAdminView === "bookings") return renderBookings();
    if (activeAdminView === "resolution") return renderResolutionCases();
    if (activeAdminView === "payments") return renderPayments();
    if (activeAdminView === "contact-messages") return renderContactMessages();
  });
  adminDateFilter?.addEventListener("change", () => {
    if (activeAdminView === "users") return applyFilters();
    if (activeAdminView === "applications") return renderApplications();
    if (activeAdminView === "bookings") return renderBookings();
    if (activeAdminView === "resolution") return renderResolutionCases();
    if (activeAdminView === "payments") return renderPayments();
    if (activeAdminView === "contact-messages") return renderContactMessages();
  });
  adminRowsPerPage?.addEventListener("change", () => {
    pageSize = Number(adminRowsPerPage.value);
    currentPage = 1;
    renderPage();
  });
  adminUserSortHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const key = header.dataset.sortKey;
      if (!key) return;
      if (adminUserSort.key === key) {
        adminUserSort.direction = adminUserSort.direction === "asc" ? "desc" : "asc";
      } else {
        adminUserSort = { key, direction: "asc" };
      }
      currentPage = 1;
      renderPage();
    });
  });

  adminUsersSelectAll?.addEventListener("change", () => {
    const total = filteredUsers.length;
    if (total === 0) return;
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const visibleUsers = filteredUsers.slice(start, end);
    visibleUsers.forEach((user, index) => {
      const userId = String(user.user_id || user.id || `${index}`);
      if (adminUsersSelectAll.checked) {
        selectedAdminUsers.add(userId);
      } else {
        selectedAdminUsers.delete(userId);
      }
    });
    renderPage();
  });

  adminApplicationsSelectAll?.addEventListener("change", () => {
    const typeValue = adminApplicationsTypeFilter?.value || "all";
    const statusValue = adminApplicationsStatusFilter?.value || "all";
    const dateValue = adminApplicationsDateFilter?.value || "all";
    const rows = adminApplications.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.full_name,
        item.email,
        item.lead_postcode,
        item.application_type,
        item.application_status,
        item.account_status
      ], getCombinedSearchTerms("applications"));
      const matchesType =
        typeValue === "all" ||
        titleCase(item.application_type || item.business_type || "") === typeValue;
      const matchesStatus =
        statusValue === "all" ||
        titleCase(item.application_status || "") === statusValue;
      const matchesDate = matchesDateFilter(item.created_at, dateValue);
      return matchesTerm && matchesType && matchesStatus && matchesDate;
    });
    const sortedRows = sortAdminApplications(rows);
    const start = (adminApplicationsPage - 1) * adminApplicationsPageSize;
    const end = Math.min(start + adminApplicationsPageSize, sortedRows.length);
    sortedRows.slice(start, end).forEach((item) => {
      const applicationId = String(item.user_id || item.id || item.email || item.full_name || "");
      if (adminApplicationsSelectAll.checked) {
        selectedAdminApplications.add(applicationId);
      } else {
        selectedAdminApplications.delete(applicationId);
      }
    });
    renderApplications();
  });

  adminBookingsSelectAll?.addEventListener("change", () => {
    const typeValue = adminBookingsTypeFilter?.value || "all";
    const statusValue = adminBookingsStatusFilter?.value || adminStatusFilter?.value || "all";
    const dateValue = adminBookingsDateFilter?.value || adminDateFilter?.value || "all";
    const rows = adminBookings.filter((item) => {
      const matchesTerm = matchesSearchTerms([
        item.reference,
        item.status,
        item.customer_name,
        item.mechanic_name,
        item.vehicle,
        item.location,
        item.services
      ], getCombinedSearchTerms("bookings"));
      const matchesType =
        typeValue === "all" ||
        normaliseFilterToken(getBookingType(item)) === normaliseFilterToken(typeValue);
      const matchesStatus =
        statusValue === "all" ||
        normaliseFilterToken(item.status) === normaliseFilterToken(statusValue);
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(item.created_at, dateValue);
      return matchesTerm && matchesType && matchesStatus && matchesDate;
    });
    const sortedRows = sortAdminBookings(rows);
    const start = (adminBookingsPage - 1) * adminBookingsPageSize;
    const end = Math.min(start + adminBookingsPageSize, sortedRows.length);
    sortedRows.slice(start, end).forEach((item) => {
      const bookingId = String(item.booking_id || item.id || item.reference || "");
      if (adminBookingsSelectAll.checked) {
        selectedAdminBookings.add(bookingId);
      } else {
        selectedAdminBookings.delete(bookingId);
      }
    });
    renderBookings();
  });

  adminDeleteCancel?.addEventListener("click", closeAdminDeleteModal);
  adminSettingsEditCancel?.addEventListener("click", closeAdminSettingsEditModal);
  adminSettingsEditModal?.querySelectorAll("[data-admin-edit-close]").forEach((element) => {
    element.addEventListener("click", closeAdminSettingsEditModal);
  });
  adminDeleteModal?.querySelectorAll("[data-admin-delete-close]").forEach((element) => {
    element.addEventListener("click", closeAdminDeleteModal);
  });
  adminSettingsEditSave?.addEventListener("click", async () => {
    if (!activeAdminEditUserId || !activeAdminEditField) return;
    const token = getAdminToken();
    if (!token) {
      if (adminSettingsEditMessage) adminSettingsEditMessage.textContent = "Sign in as admin first.";
      return;
    }
    const user = adminUsers.find((item) => String(item.user_id) === String(activeAdminEditUserId));
    if (!user) return;
      const payload = {
        full_name: user.full_name || "",
        phone: user.phone || "",
        username: user.username || "",
        address: user.address || "",
      role: String(user.role_name || "CUSTOMER").toLowerCase() === "customer" ? "user" : String(user.role_name || "").toLowerCase(),
      status: String(user.status || "active").toLowerCase()
      };
      if (activeAdminEditField === "role" || activeAdminEditField === "status") {
        payload[activeAdminEditField] = adminSettingsEditSelect?.value || payload[activeAdminEditField];
      } else if (activeAdminEditField === "full_name") {
        const firstName = adminSettingsEditFirstName?.value?.trim() || "";
        const middleName = adminSettingsEditMiddleName?.value?.trim() || "";
        const lastName = adminSettingsEditLastName?.value?.trim() || "";
        payload.full_name = [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
      } else if (activeAdminEditField === "address") {
        payload.address = [
          adminSettingsEditAddressLine1?.value?.trim() || "",
          adminSettingsEditAddressLine2?.value?.trim() || "",
          adminSettingsEditCity?.value?.trim() || "",
          adminSettingsEditPostcode?.value?.trim() || ""
        ].filter(Boolean).join(", ");
      } else {
        payload[activeAdminEditField] = adminSettingsEditInput?.value?.trim() || "";
      }
    if (adminSettingsEditSave) adminSettingsEditSave.disabled = true;
    if (adminSettingsEditMessage) adminSettingsEditMessage.textContent = "";
    try {
      await apiAuth(`/api/admin/users/${encodeURIComponent(activeAdminEditUserId)}`, token, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      const currentProfile = getAdminProfile();
      const currentProfileId = String(currentProfile?.user_id || currentProfile?.id || "");
      if (currentProfileId && currentProfileId === String(activeAdminEditUserId)) {
        try {
          const refreshedProfile = await apiAuth("/api/users/me", token);
          setStoredAuthValue("userProfile", JSON.stringify(refreshedProfile));
          setAdminHeader({ ...refreshedProfile, role_name: "ADMIN" });
        } catch {}
      }
      closeAdminSettingsEditModal();
      showAdminFeedback("User updated successfully.");
      await fetchUsers();
      await fetchDashboardSummary();
    } catch (err) {
      if (adminSettingsEditMessage) {
        adminSettingsEditMessage.textContent = err?.error?.message || err?.message || "Unable to update this field.";
      }
      if (adminSettingsEditSave) adminSettingsEditSave.disabled = false;
    }
  });
  adminDeleteConfirm?.addEventListener("click", async () => {
    if (!pendingAdminDeleteUser?.userId) return;
    const token = getAdminToken();
    if (!token) {
      showAdminFeedback("Sign in as admin first.", "error");
      closeAdminDeleteModal();
      return;
    }
    adminDeleteConfirm.disabled = true;
    try {
      await apiAuth(`/api/admin/users/${encodeURIComponent(pendingAdminDeleteUser.userId)}`, token, { method: "DELETE" });
      selectedAdminUsers.delete(String(pendingAdminDeleteUser.userId));
      closeAdminDeleteModal();
      showAdminFeedback("User deleted successfully.");
      await fetchUsers();
      await fetchDashboardSummary();
    } catch (err) {
      closeAdminDeleteModal();
      showAdminFeedback(err?.error?.message || err?.message || "Unable to delete user.", "error");
    }
  });

  document.addEventListener("click", () => {
    closeAdminEditMenus();
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
      showAdminFeedback("User created successfully.");
      fetchUsers();
    } catch (err) {
      adminAddUserError.textContent = err?.error?.message || "Unable to create user.";
      showAdminFeedback(err?.error?.message || err?.message || "Unable to create user.", "error");
    }
  });

  const hasProfile = ensureAdminProfile();
  if (hasProfile) {
    configureAdminSide(activeAdminView);
    setAdminHeroByView(activeAdminView);
    setAdminSettingsSubview("general");
    syncAdminSecurity2faButton();
    syncAdminCurrentProfile();
    fetchDashboardSummary();
    fetchUsers();
    fetchApplications();
    fetchBookings();
    fetchResolutionCases();
    fetchContactMessages();
    fetchPayments();
    fetchCatalog();
    const pendingAdminView = sessionStorage.getItem("adminHeaderTargetView");
    if (pendingAdminView) {
      const navButton = Array.from(railNavLinks).find((button) => button.dataset.view === pendingAdminView);
      if (navButton) {
        navButton.click();
      }
      sessionStorage.removeItem("adminHeaderTargetView");
    }
  } else {
    window.location.replace("/auth/login");
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




