const userPage = document.getElementById("userPage");
if (userPage) {
  const escapeHtml = window.SWApp?.escapeHtml || ((value) => String(value ?? ""));
  const userLogoutBtn = document.getElementById("userLogoutBtn");
  const userProfileAvatar = document.getElementById("userProfileAvatar");
  const userProfileName = document.getElementById("userProfileName");
  const userProfileRole = document.getElementById("userProfileRole");
  const userHeroSectionTitle = document.getElementById("userHeroSectionTitle");
  const userHeroSectionSubtitle = document.getElementById("userHeroSectionSubtitle");
  const userDashboardHeroAvatar = document.getElementById("userDashboardHeroAvatar");
  const userDashboardHeroName = document.getElementById("userDashboardHeroName");
  const userDashboardHeroRole = document.getElementById("userDashboardHeroRole");
  const userSettingsAvatar = document.getElementById("userSettingsAvatar");
  const userSettingsName = document.getElementById("userSettingsName");
  const userSettingsEmail = document.getElementById("userSettingsEmail");
  const userSettingsEmailDetail = document.getElementById("userSettingsEmailDetail");
  const userSettingsUsername = document.getElementById("userSettingsUsername");
  const userSettingsRole = document.getElementById("userSettingsRole");
  const userSettingsRoleBadge = document.getElementById("userSettingsRoleBadge");
  const userSettingsStatus = document.getElementById("userSettingsStatus");
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
  const userBookingReviewModal = document.getElementById("userBookingReviewModal");
  const userBookingReviewTitle = document.getElementById("userBookingReviewTitle");
  const userBookingReviewDescription = document.getElementById("userBookingReviewDescription");
  const userBookingReviewMessage = document.getElementById("userBookingReviewMessage");
  const userBookingReviewComment = document.getElementById("userBookingReviewComment");
  const userBookingReviewSave = document.getElementById("userBookingReviewSave");
  const userBookingReviewCancel = document.getElementById("userBookingReviewCancel");
  const userBookingReviewClose = document.querySelector('[data-user-booking-review-close="true"]');
  const userBookingReviewStars = document.querySelectorAll("[data-user-booking-review-star]");
  const userRoleSwitcher = document.getElementById("userRoleSwitcher");
  const userSettingsPhotoButton = document.getElementById("userSettingsPhotoButton");
  const userSettingsPhotoInput = document.getElementById("userSettingsPhotoInput");
  const userSettingsPhoneInput = document.getElementById("userSettingsPhoneInput");
  const userSettingsUsernameInput = document.getElementById("userSettingsUsernameInput");
  const userSettingsEmailInput = document.getElementById("userSettingsEmailInput");
  const userSettingsAddressInput = document.getElementById("userSettingsAddressInput");
  const userSettingsContactSave = document.getElementById("userSettingsContactSave");
  const userSettingsContactMessage = document.getElementById("userSettingsContactMessage");
  const setUserLabeledText = (el, label, value) => {
    if (!el) return;
    el.innerHTML = `<span class="account-field-label">${escapeHtml(label)}</span><span class="account-field-value">${escapeHtml(value || "-")}</span>`;
  };
  const setUserAccountStatus = (el, rawStatus) => {
    if (!el) return;
    const normalized = String(rawStatus || "pending").trim().toLowerCase();
    const labelMap = {
      active: "Active",
      pending: "Pending",
      inactive: "Inactive",
      suspended: "Suspended",
      disabled: "Disabled"
    };
    el.dataset.status = labelMap[normalized] ? normalized : "pending";
    el.textContent = labelMap[normalized] || "Pending";
  };
  const settingsSubnavLinks = document.querySelectorAll(".user-settings-tab-link");
  const userSettingsPanelTitle = document.getElementById("userSettingsPanelTitle");
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
  const userSecurity2faMessage = document.getElementById("userSecurity2faMessage");
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
  const userBookingsTableHead = document.querySelector("#userBookingsView .user-bookings-table-row--head");
  const userBookingsSearch = document.getElementById("userBookingsSearch");
  const userBookingsTypeFilter = document.getElementById("userBookingsTypeFilter");
  const userBookingsStatusFilter = document.getElementById("userBookingsStatusFilter");
  const userBookingsDateFilter = document.getElementById("userBookingsDateFilter");
  const userBookingsRowsPerPage = document.getElementById("userBookingsRowsPerPage");
  const userBookingsPagination = document.getElementById("userBookingsPagination");
  const userBookingsExportBtn = document.getElementById("userBookingsExportBtn");
  const userBookingsFooterCount = document.getElementById("userBookingsFooterCount");
  const userBookingDetail = document.getElementById("userBookingDetail");
  const userBookingsWelcomeSection = document.querySelector("#userBookingsView .bookings-section--welcome");
  const userBookingsCardSection = document.querySelector("#userBookingsView .bookings-section--card");
  const userResolutionFilterTabs = document.querySelectorAll(".user-resolution-card [data-user-resolution-filter]");
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
  const userResolutionComplaintAttachBtn = document.getElementById("userResolutionComplaintAttachBtn");
  const userResolutionComplaintAttachmentInput = document.getElementById("userResolutionComplaintAttachmentInput");
  const userResolutionComplaintAttachmentPreview = document.getElementById("userResolutionComplaintAttachmentPreview");
  const userResolutionCaseListTitle = document.getElementById("userResolutionCaseListTitle");
  const userResolutionBookingCasesTable = document.getElementById("userResolutionBookingCasesTable");
  const userResolutionCaseView = document.getElementById("userResolutionCaseView");
  const userResolutionCaseBackBtn = document.getElementById("userResolutionCaseBackBtn");
  const userResolutionCaseCopy = document.getElementById("userResolutionCaseCopy");
  const userResolutionMessages = document.getElementById("userResolutionMessages");
  const userResolutionMessageInput = document.getElementById("userResolutionMessageInput");
  const userResolutionSendBtn = document.getElementById("userResolutionSendBtn");
  const userResolutionCaseAttachBtn = document.getElementById("userResolutionCaseAttachBtn");
  const userResolutionCaseAttachmentInput = document.getElementById("userResolutionCaseAttachmentInput");
  const userResolutionCaseAttachmentPreview = document.getElementById("userResolutionCaseAttachmentPreview");
  const userResolutionSidebarTitle = document.getElementById("userResolutionSidebarTitle");
  const userResolutionSidebarMechanic = document.getElementById("userResolutionSidebarMechanic");
  const userResolutionSidebarCar = document.getElementById("userResolutionSidebarCar");
  const userResolutionSidebarArrivalTime = document.getElementById("userResolutionSidebarArrivalTime");
  const userResolutionSidebarAddress = document.getElementById("userResolutionSidebarAddress");
  const userResolutionSidebarWork = document.getElementById("userResolutionSidebarWork");
  const userResolutionSidebarParts = document.getElementById("userResolutionSidebarParts");
  const userResolutionSidebarTotal = document.getElementById("userResolutionSidebarTotal");
  const userSettingsView = document.getElementById("userSettingsView");
  const pendingUserResolutionCaseAttachments = new Map();
  let pendingUserResolutionComplaintAttachments = [];
  let pendingUserBookingReviewId = null;
  let pendingUserBookingReviewRating = 5;

  const getInitials = window.SWApp?.getInitials || ((name) => String(name || "NA"));

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

  const syncSecurity2faButton = () => {
    const hasSelection = Boolean(userSecurity2faEmail?.checked || userSecurity2faSms?.checked);
    userSecurity2faEnable?.classList.toggle("is-active", hasSelection);
    if (userSecurity2faEnable) userSecurity2faEnable.disabled = false;
  };

  const setUserHeader = (user) => {
    const joinedName = [user?.name, user?.lastname].filter(Boolean).join(" ").trim();
    const displayName = user?.full_name || joinedName || user?.email || "User";
    const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : [user?.role_name || "CUSTOMER"];
    const activeRole = resolveActiveRole(roles);
    const initials = getInitials(displayName);
    setAvatar(userProfileAvatar, initials, user?.avatar_url);
    if (userProfileName) userProfileName.textContent = displayName;
    if (userProfileRole) userProfileRole.textContent = activeRole;
    setAvatar(userDashboardHeroAvatar, initials, user?.avatar_url);
    if (userDashboardHeroName) userDashboardHeroName.textContent = displayName;
    if (userDashboardHeroRole) userDashboardHeroRole.textContent = activeRole;
    setAvatar(userSettingsAvatar, initials, user?.avatar_url);
    userSettingsName.textContent = displayName;
    if (userSettingsEmail) userSettingsEmail.textContent = user?.email || "-";
    setUserLabeledText(userSettingsEmailDetail, "Email:", user?.email);
    if (userSettingsUsername) setUserLabeledText(userSettingsUsername, "Username:", user?.username);
    userSettingsRole.textContent = activeRole;
    if (userSettingsRoleBadge) userSettingsRoleBadge.textContent = activeRole;
    setUserAccountStatus(userSettingsStatus, user?.status);
    setUserLabeledText(userSettingsPhone, "Phone:", user?.phone);
    if (userSettingsAddress) setUserLabeledText(userSettingsAddress, "Address:", user?.address);
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
    if (userSecurity2faEmail) userSecurity2faEmail.checked = Boolean(user?.two_factor_email_enabled);
    if (userSecurity2faSms) userSecurity2faSms.checked = false;
    syncSecurity2faButton();
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

  const setUserHeroByView = (view) => {
    const heroConfig = {
      dashboard: { title: "Dashboard", subtitle: "General information" },
      account: { title: "Account", subtitle: "Review your profile information" },
      vehicle: { title: "Vehicle", subtitle: "Information related to your vehicles" },
      bookings: { title: "Bookings", subtitle: "Review of your bookings" },
      resolution: { title: "Resolution center", subtitle: "Manage mechanic issues and active resolutions" },
      settings: { title: "Account settings", subtitle: "Manage your profile and preferences" }
    };
    const current = heroConfig[view] || heroConfig.dashboard;
    if (userHeroSectionTitle) userHeroSectionTitle.textContent = current.title;
    if (userHeroSectionSubtitle) userHeroSectionSubtitle.textContent = current.subtitle;
  };

  const setVehiclePill = (element, icon, text) => {
    if (!element) return;
    const value = String(text || "-");
    element.innerHTML = `<i aria-hidden="true">${icon}</i><span>${value}</span>`;
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
    setUserHeroByView(view);
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

  const getBookingCancellationReason = (booking) =>
    String(booking?.mechanic_cancellation?.reason || booking?.mechanic_cancelled_reason || "").trim();

  const formatBookingStatus = (status, paymentStatus, cancellationReason = "") => {
    const normalizedStatus = String(status || "requested").trim().toLowerCase();
    if (String(cancellationReason || "").trim()) return "CANCELLED";
    if (normalizedStatus === "completed") return "COMPLETED";
    if (normalizedStatus === "in_progress") return "IN PROGRESS";
    if (normalizedStatus === "cancelled" || normalizedStatus === "canceled") return "CANCELLED";
    if (paymentStatus === "authorized" || paymentStatus === "auth_captured") return "PAID";
    return normalizedStatus.replace(/_/g, " ").toUpperCase();
  };

  const titleCase = (value) =>
    String(value || "")
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const formatBookingDateTime = (slot, assignedAt = null) => {
    if (!slot?.start_at || !slot?.end_at) {
      if (!assignedAt) return "Date and time not assigned yet";
      const assigned = new Date(assignedAt);
      if (Number.isNaN(assigned.getTime())) return "Date and time not assigned yet";
      return `Assigned on ${assigned.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })} at ${assigned.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
    }
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

  const formatCurrency = window.SWApp?.formatCurrency || ((amount) => String(amount || 0));
  const formatCurrencyDisplay = (amount, currency) => {
    const value = Number(amount || 0);
    const normalized = String(currency || "GBP").toUpperCase();
    if (normalized === "GBP" || normalized === "EUR" || normalized === "USD") {
      try {
        return new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: normalized,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      } catch (_error) {
        return formatCurrency(value, normalized);
      }
    }
    return formatCurrency(value, normalized);
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

  const vehicleNeedsEnrichment = (vehicle) => {
    if (!vehicle) return false;
    const missingFuel = !String(vehicle.fuelType || "").trim() || String(vehicle.fuelType).trim() === "-";
    const missingMileage = !String(vehicle.mileage || "").trim() || String(vehicle.mileage).trim() === "-";
    const missingMot = !String(vehicle.motStatus || "").trim() || String(vehicle.motStatus).includes("not available");
    const missingTax = !String(vehicle.taxStatus || "").trim() || String(vehicle.taxStatus).includes("not available");
    return missingFuel || missingMileage || missingMot || missingTax;
  };

  const enrichVehicleFromEnquiry = async (vehicle) => {
    const registrationNumber = String(vehicle?.registrationNumber || "").trim();
    if (!registrationNumber) return vehicle;

    try {
      const result = await api("/api/vehicle-enquiry", {
        method: "POST",
        body: JSON.stringify({ registrationNumber })
      });

      const enriched = normaliseDashboardVehicle({
        ...vehicle,
        registrationNumber: result.registrationNumber || registrationNumber,
        make: result.make || vehicle.make || "",
        model: result.model || vehicle.model || "",
        fuelType: result.fuelType || vehicle.fuelType || "",
        yearOfManufacture: result.yearOfManufacture || vehicle.yearOfManufacture || null,
        mileage: deriveMileage(result, vehicle.mileage || "-"),
        motStatus: deriveMotStatus(result),
        taxStatus: deriveTaxStatus(result)
      });

      if (userToken) {
        try {
          const persisted = await apiAuth("/api/users/me/vehicles", userToken, {
            method: "POST",
            body: JSON.stringify(enriched)
          });
          enriched.id = persisted?.id || enriched.id || null;
          enriched.uuid_public = persisted?.uuid_public || enriched.uuid_public || null;
        } catch (_err) {
          // Keep enriched local data if persistence fails.
        }
      }

      return enriched;
    } catch (_err) {
      return vehicle;
    }
  };

  const renderDashboardVehicles = (vehicles) => {
    const closeVehicleMenus = () => {
      document.querySelectorAll(".user-car-menu-panel").forEach((panel) => panel.classList.add("is-hidden"));
    };

    const buildVehicleCard = (vehicle) => {
      const reg = vehicle.registrationNumber || "-";
      const make = String(vehicle.make || "").trim();
      const model = String(vehicle.model || "").trim();
      const fuel = String(vehicle.fuelType || vehicle.fuel || "").trim() || "-";
      const year = Number(vehicle.yearOfManufacture);
      const age = Number.isFinite(year) ? `${Math.max(new Date().getFullYear() - year, 0)} years old` : "-";
      const rawMileage = vehicle.mileage ?? vehicle.odometerValue ?? vehicle.odometer_value ?? "-";
      const mileage =
        typeof rawMileage === "number"
          ? `${rawMileage.toLocaleString()} miles`
          : String(rawMileage || "-").trim();

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
          <span><i aria-hidden="true">⛽</i>${fuel}</span>
          <span><i aria-hidden="true">🗓</i>${age}</span>
          <span><i aria-hidden="true">◉</i>${mileage}</span>
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
      setVehiclePill(userVehicleFuel, "⛽", "-");
      setVehiclePill(userVehicleAge, "🗓", "-");
      setVehiclePill(userVehicleMileage, "◉", "-");
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
    setVehiclePill(userVehicleFuel, "⛽", selectedVehicle.fuelType || "-");
    setVehiclePill(userVehicleAge, "🗓", age);
    setVehiclePill(userVehicleMileage, "◉", mileage);
    if (userVehicleMotStatus) userVehicleMotStatus.textContent = selectedVehicle.motStatus || "MOT status not available";
    if (userVehicleTaxStatus) userVehicleTaxStatus.textContent = selectedVehicle.taxStatus || "Tax status not available";
    if (userVehicleMileageStatus) userVehicleMileageStatus.textContent = mileage;

    saveSelectedVehicleReg(selectedVehicle.registrationNumber);
  };

  let activeUserBookingId = null;
  let userBookingsPage = 1;

  const setSimpleOptions = (select, labels, defaultLabel) => {
    if (!select) return;
    const current = select.value || "all";
    const values = Array.from(new Set(labels.filter(Boolean)));
    select.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = defaultLabel;
    select.appendChild(allOption);
    values.forEach((label) => {
      const option = document.createElement("option");
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });
    select.value = values.includes(current) ? current : "all";
  };

  const USER_BOOKING_TYPE_OPTIONS = [
    { value: "Diagnostics", label: "Diagnostics" },
    { value: "Ev Chargers", label: "Ev Chargers" },
    { value: "Inspections", label: "Inspections" },
    { value: "Mots", label: "Mots" },
    { value: "Repairs", label: "Repairs" },
    { value: "Services", label: "Services" },
    { value: "Tyres", label: "Tyres" }
  ];

  const getUserBookingType = (booking) => {
    const serviceText = (
      Array.isArray(booking?.items)
        ? booking.items.map((item) => item?.name || "").join(" ")
        : ""
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
  const getBookingStatusClass = (booking) => {
    const label = formatBookingStatus(booking.status, booking.payment?.status, getBookingCancellationReason(booking));
    return String(label || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  };

  const formatDate = window.SWApp?.formatShortDate || ((value) => String(value || "-"));

  const getFilteredUserBookings = (bookingsSource = latestUserBookings) => {
    const term = String(userBookingsSearch?.value || "").trim().toLowerCase();
    const typeValue = userBookingsTypeFilter?.value || "all";
    const statusValue = userBookingsStatusFilter?.value || "all";
    const dateValue = userBookingsDateFilter?.value || "all";
    const now = Date.now();

    const source = Array.isArray(bookingsSource) ? bookingsSource : [];

    return source.filter((booking) => {
      const matchesTerm =
        !term ||
        String(booking.reference || "").toLowerCase().includes(term) ||
        String(getUserBookingType(booking)).toLowerCase().includes(term);
      const matchesType = typeValue === "all" || getUserBookingType(booking) === typeValue;
      const matchesStatus =
        statusValue === "all" ||
        titleCase(String(formatBookingStatus(booking.status, booking.payment?.status, getBookingCancellationReason(booking)) || "").toLowerCase()) === statusValue;

      let matchesDate = true;
      if (dateValue !== "all") {
        const created = new Date(booking.created_at);
        const ageDays = Number.isNaN(created.getTime()) ? Number.POSITIVE_INFINITY : (now - created.getTime()) / 86400000;
        if (dateValue === "7d") matchesDate = ageDays <= 7;
        if (dateValue === "30d") matchesDate = ageDays <= 30;
        if (dateValue === "90d") matchesDate = ageDays <= 90;
        if (dateValue === "365d") matchesDate = ageDays <= 365;
      }

      return matchesTerm && matchesType && matchesStatus && matchesDate;
    });
  };

  const buildUserBookingDetailCard = (booking, user) => {
    const addressLines = [booking.address?.line1, booking.address?.line2, booking.address?.city, booking.address?.postal_code].filter(Boolean);
    const mechanicName = booking.mechanic || "Unassigned";
    const vehicleLabel = [booking.vehicle?.make, booking.vehicle?.model, booking.vehicle?.yearOfManufacture].filter(Boolean).join(" ");
    const parts = booking.items.flatMap((item) => (Array.isArray(item.parts) ? item.parts : []));
    const invoiceParts = Array.isArray(booking.invoice?.totals?.completion?.added_parts)
      ? booking.invoice.totals.completion.added_parts
      : Array.isArray(booking.completion?.added_parts)
        ? booking.completion.added_parts
        : [];
    const completionPhotos = Array.isArray(booking.invoice?.totals?.completion?.photos)
      ? booking.invoice.totals.completion.photos
      : Array.isArray(booking.completion?.photos)
        ? booking.completion.photos
        : [];
    const cancellationReason = getBookingCancellationReason(booking);
    const allParts = [
      ...parts.map((part) => (typeof part === "string" ? part : part?.name || JSON.stringify(part))),
      ...invoiceParts.map((part) => part?.description).filter(Boolean)
    ];
    const invoiceNumber = booking.invoice?.invoice_number || booking.invoice?.number || null;

    return `
      <article class="user-booking-card">
        <div class="user-booking-toolbar">
          <span class="user-booking-status user-booking-status--${getBookingStatusClass(booking)}">${formatBookingStatus(booking.status, booking.payment?.status, cancellationReason)}</span>
          <strong class="user-booking-reference">Reference: ${booking.reference}</strong>
          <div class="user-booking-actions-wrap">
            <button class="primary user-booking-actions" type="button" data-booking-actions-toggle="${booking.id}">Actions</button>
            <div class="user-booking-actions-panel is-hidden">
              <button class="user-booking-actions-item" type="button" data-user-resolution-message="${booking.id}">
                Resolution center
              </button>
              ${
                String(booking.status || "").toLowerCase() === "completed"
                  ? `<button class="user-booking-actions-item" type="button" data-user-booking-review="${booking.id}">
                      ${booking.review ? "Edit review" : "Rate mechanic"}
                    </button>`
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="user-booking-grid">
          <div class="user-booking-column">
            <h4>Date & Time</h4>
            <p>${formatBookingDateTime(booking.slot, booking.assigned_at)}</p>
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
            ${
              cancellationReason
                ? `<h4>Cancellation reason</h4><p class="user-booking-cancellation-reason">${escapeHtml(cancellationReason)}</p>`
                : ""
            }
            <h4>Total Price</h4>
            <p class="user-booking-price">${formatCurrency(booking.totals?.total_eur, booking.payment?.currency)}</p>
            <h4>Amount Paid</h4>
            <p class="user-booking-price">${formatCurrency(booking.payment?.amount_eur ?? booking.totals?.total_eur, booking.payment?.currency)}</p>
          </div>
          <div class="user-booking-column">
            <h4>Services</h4>
            <ul>${booking.items.map((item) => `<li>${item.name}</li>`).join("") || "<li>No services attached</li>"}</ul>
            <h4>Parts</h4>
            <ul>${allParts.map((part) => `<li>${escapeHtml(part)}</li>`).join("") || "<li>No parts recorded</li>"}</ul>
            <h4>Documents</h4>
            ${
              invoiceNumber
                ? `<button class="user-booking-receipt-link" type="button" data-user-booking-invoice="${booking.id}">View receipt</button>`
                : "<p>No documents available</p>"
            }
          </div>
        </div>
        <div class="user-booking-photos-inline">
          <h4>Photos</h4>
          ${
            completionPhotos.length
              ? `<div class="user-booking-photo-grid">${completionPhotos
                  .map((url) => {
                    const resolved = String(url || "").startsWith("/uploads") ? `http://localhost:3000${url}` : String(url || "");
                    return `<img src="${escapeHtml(resolved)}" alt="">`;
                  })
                  .join("")}</div>`
              : "<p>No booking photos available.</p>"
          }
        </div>
      </article>
    `;
  };

  const buildInvoiceDocument = (invoice) => {
    const customerAddress = Array.isArray(invoice?.customer?.address) ? invoice.customer.address : [];
    const currency = invoice?.payment?.currency || invoice?.totals?.totals?.currency || "GBP";
    const labourLines = Array.isArray(invoice?.totals?.labour_lines) ? invoice.totals.labour_lines : [];
    const partLines = Array.isArray(invoice?.totals?.parts_lines) ? invoice.totals.parts_lines : [];
    const totals = invoice?.totals?.totals || {};
    const escape = (value) => escapeHtml(String(value ?? ""));
    const renderRows = (rows, emptyLabel) =>
      rows.length
        ? rows
            .map(
              (row) => `
                <tr>
                  <td>${escape(row.description)}</td>
                  <td style="text-align:right">${escape(formatCurrencyDisplay(row.amount_eur, currency))}</td>
                </tr>`
            )
            .join("")
        : `<tr><td colspan="2">${escape(emptyLabel)}</td></tr>`;

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escape(invoice?.invoice_number || "")}</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; background: #eceef2; color: #181c22; }
      .page { max-width: 980px; margin: 32px auto; background: #fff; padding: 36px 42px 48px; box-shadow: 0 18px 45px rgba(15, 18, 28, 0.18); }
      .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 28px; }
      .brand { font-size: 34px; font-weight: 800; letter-spacing: 0.04em; }
      .meta { text-align: right; }
      .meta strong { display: block; font-size: 15px; color: #566073; }
      .meta span { display: block; margin-top: 6px; font-size: 28px; font-weight: 800; color: #0f1726; }
      .subhead { color: #5a6476; font-size: 14px; margin-top: 8px; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 24px; }
      .section-title { margin: 0 0 10px; font-size: 24px; font-weight: 800; }
      .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #5a6476; margin-bottom: 10px; }
      .block { border-top: 2px solid #1c2230; padding-top: 18px; margin-top: 18px; }
      .line { margin: 4px 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { padding: 10px 0; border-bottom: 1px solid #dbe0e8; vertical-align: top; }
      th { text-align: left; font-size: 14px; color: #3b4454; }
      .totals { margin-left: auto; width: 320px; margin-top: 24px; }
      .totals-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-top: 1px solid #dbe0e8; }
      .totals-row strong { font-size: 16px; }
      .footer { margin-top: 36px; color: #5a6476; font-size: 13px; }
      @media print {
        body { background: #fff; }
        .page { box-shadow: none; margin: 0; max-width: none; }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="top">
        <div>
          <div class="brand">INVOICE</div>
          <div class="subhead">Issued by SmartWorkshop on behalf of the assigned mechanic.</div>
        </div>
        <div class="meta">
          <strong>Invoice number</strong>
          <span>${escape(invoice?.invoice_number || "-")}</span>
          <strong style="margin-top:12px">Issued</strong>
          <div>${escape(new Date(invoice?.issued_at || Date.now()).toLocaleDateString("en-GB"))}</div>
        </div>
      </div>

      <div class="grid-2">
        <section>
          <div class="card-title">Customer details</div>
          <div class="line"><strong>${escape(invoice?.customer?.full_name || "-")}</strong></div>
          ${customerAddress.map((line) => `<div class="line">${escape(line)}</div>`).join("")}
          <div class="line">${escape(invoice?.customer?.email || "-")}</div>
          <div class="line">${escape(invoice?.customer?.phone || "-")}</div>
        </section>
        <section>
          <div class="card-title">Mechanic details</div>
          <div class="line"><strong>${escape(invoice?.mechanic?.full_name || "-")}</strong></div>
          <div class="line">${escape(invoice?.mechanic?.email || "-")}</div>
          <div class="line">${escape(invoice?.mechanic?.phone || "-")}</div>
        </section>
      </div>

      <section class="block">
        <div class="grid-2">
          <div>
            <div class="card-title">Vehicle details</div>
            <div class="line"><strong>Vehicle VRM:</strong> ${escape(invoice?.vehicle?.registration || "-")}</div>
            <div class="line"><strong>Vehicle description:</strong> ${escape(invoice?.vehicle?.description || "-")}</div>
          </div>
          <div>
            <div class="card-title">Booking details</div>
            <div class="line"><strong>Booking reference:</strong> ${escape(invoice?.booking?.reference || "-")}</div>
            <div class="line"><strong>Payment reference:</strong> ${escape(invoice?.payment?.provider_ref || "-")}</div>
            <div class="line"><strong>Payment status:</strong> ${escape(String(invoice?.payment?.status || "-").replace(/_/g, " "))}</div>
          </div>
        </div>
      </section>

      <section class="block">
        <div class="section-title">Labour</div>
        <table>
          <thead>
            <tr><th>Description</th><th style="text-align:right">Amount</th></tr>
          </thead>
          <tbody>${renderRows(labourLines, "No labour lines recorded.")}</tbody>
        </table>
      </section>

      <section class="block">
        <div class="section-title">Parts included</div>
        <table>
          <thead>
            <tr><th>Description</th><th style="text-align:right">Net price</th></tr>
          </thead>
          <tbody>${renderRows(partLines, "No parts recorded.")}</tbody>
        </table>
      </section>

      <section class="totals">
        <div class="totals-row"><span>Labour total</span><span>${escape(formatCurrencyDisplay(totals.labour_eur, currency))}</span></div>
        <div class="totals-row"><span>Parts total</span><span>${escape(formatCurrencyDisplay(totals.parts_eur, currency))}</span></div>
        <div class="totals-row"><span>VAT</span><span>${escape(formatCurrencyDisplay(totals.vat_eur, currency))}</span></div>
        <div class="totals-row"><strong>Total</strong><strong>${escape(formatCurrencyDisplay(totals.total_eur, currency))}</strong></div>
      </section>

      <div class="footer">This document was generated automatically by SmartWorkshop.</div>
    </main>
  </body>
</html>`;
  };

  const openBookingInvoice = async (bookingId, popup = null) => {
    const token = getStoredAuthValue("userToken");
    if (!token || !bookingId) return;
    const invoice = await apiAuth(`/api/invoices/bookings/${encodeURIComponent(bookingId)}`, token);
    const target = popup || window.open("", "_blank");
    if (!target) {
      throw new Error("Please allow popups to open the invoice.");
    }
    target.document.open();
    target.document.write(buildInvoiceDocument(invoice));
    target.document.close();
  };

  const setUserBookingReviewMessage = (message = "", tone = "error") => {
    if (!userBookingReviewMessage) return;
    userBookingReviewMessage.textContent = message;
    userBookingReviewMessage.classList.toggle("is-hidden", !message);
    userBookingReviewMessage.dataset.tone = tone;
  };

  const mountUserBookingReviewModal = () => {
    if (!userBookingReviewModal) return;
    if (userBookingReviewModal.parentElement !== document.body) {
      document.body.appendChild(userBookingReviewModal);
    }
  };

  const renderUserBookingReviewStars = (rating = 0) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    userBookingReviewStars.forEach((button) => {
      const value = Number(button.dataset.userBookingReviewStar || 0);
      const isActive = value <= safeRating;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const closeUserBookingReviewModal = () => {
    pendingUserBookingReviewId = null;
    pendingUserBookingReviewRating = 5;
    if (userBookingReviewComment) userBookingReviewComment.value = "";
    setUserBookingReviewMessage("");
    renderUserBookingReviewStars(0);
    userBookingReviewModal?.classList.add("is-hidden");
  };

  const openUserBookingReviewModal = (bookingId) => {
    const booking = latestUserBookings.find((entry) => Number(entry.id) === Number(bookingId));
    if (!booking) {
      window.alert("Booking not found.");
      return;
    }
    if (String(booking.status || "").toLowerCase() !== "completed") {
      window.alert("Only completed bookings can be reviewed.");
      return;
    }
    pendingUserBookingReviewId = Number(booking.id);
    pendingUserBookingReviewRating = Number(booking.review?.rating || 0);
    mountUserBookingReviewModal();
    if (userBookingReviewTitle) userBookingReviewTitle.textContent = booking.review ? "Edit review" : "Rate mechanic";
    if (userBookingReviewDescription) {
      userBookingReviewDescription.textContent = `Share your experience with ${booking.mechanic || "the mechanic"}.`;
    }
    if (userBookingReviewComment) {
      userBookingReviewComment.value = String(booking.review?.comment || "");
    }
    setUserBookingReviewMessage("");
    renderUserBookingReviewStars(pendingUserBookingReviewRating);
    userBookingReviewModal?.classList.remove("is-hidden");
    userBookingReviewComment?.focus();
  };

  const submitUserBookingReview = async () => {
    if (!pendingUserBookingReviewId || !userToken) return;
    const rating = Number(pendingUserBookingReviewRating || 0);
    const comment = String(userBookingReviewComment?.value || "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setUserBookingReviewMessage("Please select a rating between 1 and 5.");
      return;
    }
    if (userBookingReviewSave) userBookingReviewSave.disabled = true;
    try {
      await apiAuth(`/api/users/me/bookings/${encodeURIComponent(pendingUserBookingReviewId)}/review`, userToken, {
        method: "POST",
        body: JSON.stringify({ rating, comment })
      });
      closeUserBookingReviewModal();
      await syncUserBookingsFromApi();
    } catch (error) {
      setUserBookingReviewMessage(error?.error?.message || error?.message || "Unable to save review.");
    } finally {
      if (userBookingReviewSave) userBookingReviewSave.disabled = false;
    }
  };

  const renderUserBookings = (bookings) => {
    if (!userBookingsList || !userBookingDetail) return;
    const user = getUserProfile() || {};
    const bookingList = Array.isArray(bookings) ? bookings : latestUserBookings;
    userBookingsList.innerHTML = "";
    userBookingDetail.innerHTML = "";

    if (!Array.isArray(bookingList) || !bookingList.length) {
      const emptyRow = document.createElement("tr");
      emptyRow.className = "user-booking-empty-row";
      emptyRow.innerHTML = '<td colspan="5" class="user-booking-empty">No bookings to show yet.</td>';
      userBookingsList.appendChild(emptyRow);
      userBookingDetail.innerHTML = "";
      if (userBookingsFooterCount) userBookingsFooterCount.textContent = "0 bookings";
      return;
    }

    setSimpleOptions(
      userBookingsTypeFilter,
      USER_BOOKING_TYPE_OPTIONS.map((option) => option.label),
      "Type"
    );
    setSimpleOptions(
      userBookingsStatusFilter,
      [
        ...bookingList.map((booking) =>
          titleCase(String(formatBookingStatus(booking.status, booking.payment?.status, getBookingCancellationReason(booking)) || "").toLowerCase())
        ),
        "Cancelled"
      ],
      "Status"
    );

    const filteredBookings = getFilteredUserBookings(bookingList);
    const pageSize = Number(userBookingsRowsPerPage?.value || 10);
    const total = filteredBookings.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    userBookingsPage = Math.min(userBookingsPage, totalPages);
    const startIndex = total ? (userBookingsPage - 1) * pageSize : 0;
    const pageBookings = filteredBookings.slice(startIndex, startIndex + pageSize);

    if (!pageBookings.length) {
      const emptyRow = document.createElement("tr");
      emptyRow.className = "user-booking-empty-row";
      emptyRow.innerHTML = `<td colspan="5" class="user-booking-empty">No bookings to show yet.</td>`;
      userBookingsList.appendChild(emptyRow);
      userBookingDetail.innerHTML = "";
      if (userBookingsFooterCount) userBookingsFooterCount.textContent = `0-0 of ${total} rows`;
      if (userBookingsPagination) userBookingsPagination.innerHTML = "";
      return;
    }

    const selectedId = pageBookings.some((booking) => booking.id === activeUserBookingId) ? activeUserBookingId : null;
    activeUserBookingId = selectedId;

    pageBookings.forEach((booking) => {
      const vehicleLabel = [booking.vehicle?.make, booking.vehicle?.model, booking.vehicle?.registrationNumber].filter(Boolean).join(" · ") || "-";
      const mechanicLabel = booking.mechanic || "Unassigned";
      const item = document.createElement("tr");
      item.className = `user-booking-summary-card${booking.id === selectedId ? " is-active" : ""}`;
      item.dataset.bookingSummaryId = booking.id;
      item.innerHTML = `
        <td><strong class="user-booking-summary-reference">${booking.reference}</strong></td>
        <td><span class="user-booking-status user-booking-status--${getBookingStatusClass(booking)}">${formatBookingStatus(booking.status, booking.payment?.status, getBookingCancellationReason(booking))}</span></td>
        <td><span class="user-booking-summary-vehicle">${vehicleLabel}</span></td>
        <td><span class="user-booking-summary-mechanic">${mechanicLabel}</span></td>
        <td><span class="user-booking-summary-date">${formatDate(booking.created_at)}</span></td>
      `;
      userBookingsList.appendChild(item);
    });

    const selectedBooking = filteredBookings.find((booking) => booking.id === selectedId) || null;
    userBookingDetail.innerHTML = selectedBooking ? buildUserBookingDetailCard(selectedBooking, user) : "";
    if (userBookingsFooterCount) {
      const from = startIndex + 1;
      const to = startIndex + pageBookings.length;
      userBookingsFooterCount.textContent = `${from}-${to} of ${total} rows`;
    }
    if (userBookingsPagination) {
      userBookingsPagination.innerHTML = "";
      for (let page = 1; page <= totalPages; page += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(page);
        button.dataset.userBookingsPage = String(page);
        button.classList.toggle("active", page === userBookingsPage);
        userBookingsPagination.appendChild(button);
      }
    }
  };

  let dashboardVehicles = getDashboardVehicles();
  renderDashboardVehicles(dashboardVehicles);
  renderVehicleDetail(dashboardVehicles);

  const syncDashboardVehiclesFromApi = async () => {
    if (!userToken) return;

    try {
      const vehicles = await apiAuth("/api/users/me/vehicles", userToken);
      dashboardVehicles = mergeDashboardVehicles(getDashboardVehicles(), vehicles.map(normaliseDashboardVehicle));
      dashboardVehicles = await Promise.all(
        dashboardVehicles.map((vehicle) => (vehicleNeedsEnrichment(vehicle) ? enrichVehicleFromEnquiry(vehicle) : vehicle))
      );
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
      latestUserBookings = Array.isArray(bookings) ? bookings : [];
      renderUserBookings(latestUserBookings);
    } catch (_err) {
      console.error("Unable to load user bookings", _err);
      renderUserBookings([]);
      latestUserBookings = [];
      return;
    }

    try {
      await syncUserResolutionOverview();
    } catch (_err) {
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
  let pendingUserResolutionCaseType = "general";
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

  const renderUserResolutionCaseAttachmentPreview = () => {
    if (!userResolutionCaseAttachmentPreview) return;
    const files = pendingUserResolutionCaseAttachments.get(pendingUserResolutionCaseId) || [];
    userResolutionCaseAttachmentPreview.innerHTML = "";
    userResolutionCaseAttachmentPreview.classList.toggle("is-hidden", !files.length);
    if (!files.length) {
      userResolutionCaseAttachmentPreview.innerHTML = '<span class="mechanic-resolution-compose-empty">No files selected yet.</span>';
      return;
    }

    files.forEach((file) => {
      const item = document.createElement("div");
      item.className = "mechanic-resolution-compose-file";
      const isImage = String(file.type || "").startsWith("image/");
      if (isImage) {
        const objectUrl = URL.createObjectURL(file);
        item.innerHTML = `
          <img alt="${escapeHtml(file.name || "Attachment")}" src="${objectUrl}">
          <span>${escapeHtml(file.name || "Attachment")}</span>
        `;
        const img = item.querySelector("img");
        if (img) {
          img.addEventListener("load", () => URL.revokeObjectURL(objectUrl), { once: true });
          img.addEventListener("error", () => URL.revokeObjectURL(objectUrl), { once: true });
        }
      } else {
        item.innerHTML = `
          <span class="mechanic-resolution-compose-file-icon">FILE</span>
          <span>${escapeHtml(file.name || "Attachment")}</span>
        `;
      }
      userResolutionCaseAttachmentPreview.appendChild(item);
    });
  };

  const renderUserResolutionComplaintAttachmentPreview = () => {
    if (!userResolutionComplaintAttachmentPreview) return;
    const files = pendingUserResolutionComplaintAttachments || [];
    userResolutionComplaintAttachmentPreview.innerHTML = "";
    userResolutionComplaintAttachmentPreview.classList.toggle("is-hidden", !files.length);
    if (!files.length) {
      userResolutionComplaintAttachmentPreview.innerHTML = '<span class="mechanic-resolution-compose-empty">No files selected yet.</span>';
      return;
    }

    files.forEach((file) => {
      const item = document.createElement("div");
      item.className = "mechanic-resolution-compose-file";
      const isImage = String(file.type || "").startsWith("image/");
      if (isImage) {
        const objectUrl = URL.createObjectURL(file);
        item.innerHTML = `
          <img alt="${escapeHtml(file.name || "Attachment")}" src="${objectUrl}">
          <span>${escapeHtml(file.name || "Attachment")}</span>
        `;
        const img = item.querySelector("img");
        if (img) {
          img.addEventListener("load", () => URL.revokeObjectURL(objectUrl), { once: true });
          img.addEventListener("error", () => URL.revokeObjectURL(objectUrl), { once: true });
        }
      } else {
        item.innerHTML = `
          <span class="mechanic-resolution-compose-file-icon">FILE</span>
          <span>${escapeHtml(file.name || "Attachment")}</span>
        `;
      }
      userResolutionComplaintAttachmentPreview.appendChild(item);
    });
  };

  const clearUserResolutionCaseAttachments = (caseId = pendingUserResolutionCaseId) => {
    if (caseId) {
      pendingUserResolutionCaseAttachments.set(Number(caseId), []);
    }
    if (userResolutionCaseAttachmentInput) userResolutionCaseAttachmentInput.value = "";
    renderUserResolutionCaseAttachmentPreview();
  };

  const clearUserResolutionComplaintAttachments = () => {
    pendingUserResolutionComplaintAttachments = [];
    if (userResolutionComplaintAttachmentInput) userResolutionComplaintAttachmentInput.value = "";
    renderUserResolutionComplaintAttachmentPreview();
  };

  const syncUserResolutionIssueUi = () => {
    const issueValue = getUserResolutionIssueValue();
    const isComplaint = getUserResolutionCaseType() === "complaint";
    const booking = latestUserBookings.find((entry) => Number(entry.id) === Number(pendingUserResolutionBookingId));
    const mechanicName = booking?.mechanic || "your mechanic";
    userResolutionNotice?.classList.toggle("is-hidden", isComplaint);
    userResolutionGoToCase?.classList.toggle("is-hidden", isComplaint);
    userResolutionComplaintComposer?.classList.toggle("is-hidden", !isComplaint);
    if (!isComplaint) {
      clearUserResolutionComplaintAttachments();
    }
    if (userResolutionComplaintCopy) {
      userResolutionComplaintCopy.textContent = isComplaint ? getUserResolutionComplaintCopy(issueValue, mechanicName) : "";
    }
  };

  const setUserResolutionSubview = (view) => {
    const isMessage = view === "message";
    const isCase = view === "case";
    userBookingsCardSection?.classList.toggle("is-hidden", isMessage || isCase);
    userResolutionMessageView?.classList.toggle("is-hidden", !isMessage);
    userResolutionCaseView?.classList.toggle("is-hidden", !isCase);
    if (isMessage || isCase) {
      userResolutionView?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const renderUserResolutionCaseRows = (target, cases) => {
    if (!target) return;
    target.innerHTML = "";
    if (!Array.isArray(cases) || !cases.length) return;
    cases.forEach((entry) => {
      const caseType = String(entry.type || entry.case_type || "general").toLowerCase();
      const statusLabel = caseType === "complaint" ? "COMPLAINT" : "GENERAL ENQUIRY";
      const row = document.createElement("div");
      row.className = "mechanic-resolution-table-row";
      row.innerHTML = `
        <span class="mechanic-resolution-status ${caseType === "complaint" ? "is-complaint" : "is-general"}">${statusLabel}</span>
        <span>${formatResolutionReference(entry.reference, entry.booking_id)}</span>
        <span>${formatUserResolutionDateTime(entry.updated_at)}</span>
        <span>${entry.subject || "-"}</span>
        <button class="mechanic-resolution-link" type="button" data-user-resolution-case-id="${entry.id}" data-user-resolution-case-type="${String(entry.type || entry.case_type || "general").toLowerCase()}">View</button>
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
    } catch (_err) {
      latestUserResolutionCases = [];
      renderUserResolutionCaseRows(userResolutionCasesTable, []);
    }
  };

  const openUserResolutionMessage = async (bookingId, type = "general") => {
    pendingUserResolutionOrigin = "bookings";
    pendingUserResolutionCaseType = String(type || "general").toLowerCase();
    pendingUserResolutionBookingId = Number(bookingId);
    pendingUserResolutionCaseId = null;
    if (userResolutionIssue) {
      const matchingOption = Array.from(userResolutionIssue.options).find((option) => (option.dataset.caseType || "general") === type);
      userResolutionIssue.value = matchingOption?.value || userResolutionIssue.value;
    }
    const booking = latestUserBookings.find((entry) => Number(entry.id) === Number(bookingId));
    const reference = booking?.reference || formatBookingReference(bookingId);
    if (userResolutionDetailTitle) {
      userResolutionDetailTitle.textContent = "Resolution Center";
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
    const caseType = String(detail?.case_type || detail?.type || pendingUserResolutionCaseType || "").toLowerCase();
    pendingUserResolutionCaseType = caseType || pendingUserResolutionCaseType;
    const rawCaseTitle = String(detail?.subject || "General Enquiry").trim();
    const normalizedTitle = rawCaseTitle.replace(/\s*regarding booking$/i, "").trim();
    const caseTitle = caseType === "complaint"
      ? "Complaint"
      : normalizedTitle || "General Enquiry";
    if (userResolutionCaseStatusBadge) {
      userResolutionCaseStatusBadge.textContent = caseType === "complaint" ? "COMPLAINT" : "GENERAL ENQUIRY";
      userResolutionCaseStatusBadge.classList.toggle("is-complaint", caseType === "complaint");
      userResolutionCaseStatusBadge.classList.toggle("is-general", caseType !== "complaint");
    }
    if (userResolutionCaseCopy) {
      userResolutionCaseCopy.classList.toggle("is-hidden", caseType !== "general");
    }
    if (userResolutionSidebarTitle) {
      userResolutionSidebarTitle.textContent = `Current status of booking #${detail?.booking?.reference || (detail?.booking_id ? formatBookingReference(detail.booking_id) : "-")}`;
    }
    if (userResolutionSidebarMechanic) userResolutionSidebarMechanic.textContent = detail?.mechanic?.name || "-";
    if (userResolutionSidebarCar) {
      userResolutionSidebarCar.textContent = [detail?.vehicle?.make, detail?.vehicle?.model, detail?.vehicle?.registrationNumber].filter(Boolean).join(" · ") || "-";
    }
    if (userResolutionSidebarArrivalTime) {
      userResolutionSidebarArrivalTime.textContent = detail?.booking?.arrival_time
        ? new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "long",
            year: "numeric"
          }).format(new Date(detail.booking.arrival_time))
        : (detail?.booking?.assigned_at ? `Assigned on ${formatUserResolutionDateTime(detail.booking.assigned_at)}` : "-");
    }
    if (userResolutionSidebarAddress) {
      userResolutionSidebarAddress.textContent = [detail?.address?.line1, detail?.address?.line2, detail?.address?.city, detail?.address?.postal_code].filter(Boolean).join(", ") || "-";
    }
    if (userResolutionSidebarWork) {
      userResolutionSidebarWork.textContent = (detail?.items || []).map((item) => item.name).join(", ") || "-";
    }
    if (userResolutionSidebarParts) {
      const invoiceParts = Array.isArray(detail?.invoice?.totals?.completion?.added_parts)
        ? detail.invoice.totals.completion.added_parts
        : [];
      const bookingParts = invoiceParts.map((part) => part?.description).filter(Boolean);
      userResolutionSidebarParts.textContent = bookingParts.length ? bookingParts.join(", ") : "-";
    }
    if (userResolutionSidebarTotal) {
      userResolutionSidebarTotal.textContent = formatCurrency(detail?.booking?.total_eur, "GBP");
    }
    if (userResolutionMessages) {
      userResolutionMessages.innerHTML = "";
      (detail?.messages || []).forEach((message) => {
        const senderName = String(message.sender_name || "User");
        const initials = senderName
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() || "")
          .join("") || "U";
        const avatarUrl = String(message.avatar_url || "").trim();
        const resolvedAvatarUrl = avatarUrl
          ? (avatarUrl.startsWith("/uploads") ? `http://localhost:3000${avatarUrl}` : avatarUrl)
          : "";
        const avatarMarkup = resolvedAvatarUrl
          ? `<img src="${resolvedAvatarUrl}" alt="" />`
          : initials;
        const bodyText = String(message.body || "").trim();
        const attachments = Array.isArray(message.attachments) ? message.attachments : [];
        const attachmentsMarkup = attachments.length
          ? `
            <div class="mechanic-resolution-message-attachments">
              ${attachments
                .map((attachment) => {
                  const fileUrl = String(attachment.file_url || "").trim();
                  const originalName = String(attachment.original_name || "").trim() || "Attachment";
                  const mimeType = String(attachment.mime_type || "").trim();
                  const isImage = mimeType.startsWith("image/");
                  const resolvedUrl = fileUrl.startsWith("/uploads") ? `http://localhost:3000${fileUrl}` : fileUrl;
                  return isImage
                    ? `
                      <a class="mechanic-resolution-message-attachment" href="${resolvedUrl}" target="_blank" rel="noopener noreferrer">
                        <img src="${resolvedUrl}" alt="${escapeHtml(originalName)}" />
                        <span>${escapeHtml(originalName)}</span>
                      </a>
                    `
                    : `
                      <a class="mechanic-resolution-message-attachment" href="${resolvedUrl}" target="_blank" rel="noopener noreferrer">
                        <span>${escapeHtml(originalName)}</span>
                      </a>
                    `;
                })
                .join("")}
            </div>
          `
          : "";
        const item = document.createElement("div");
        item.className = `mechanic-resolution-message ${message.sender_role === "customer" ? "is-customer" : "is-mechanic"}`;
        item.innerHTML = `
          <div class="mechanic-resolution-message-row">
            <div class="mechanic-resolution-message-avatar" aria-hidden="true">${avatarMarkup}</div>
            <div class="mechanic-resolution-message-content">
              ${bodyText ? `<div class="mechanic-resolution-bubble">${bodyText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</div>` : ""}
              ${attachmentsMarkup}
              <span class="mechanic-resolution-message-meta">${senderName}, ${formatUserResolutionDateTime(message.created_at)}</span>
            </div>
          </div>
        `;
        userResolutionMessages.appendChild(item);
      });
    }
    renderUserResolutionCaseAttachmentPreview();
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
        } catch (err) {
          const message =
            err?.error?.message ||
            err?.message ||
            "This vehicle cannot be removed because it is linked to existing bookings.";
          window.alert(message);
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

  userBookingsList?.addEventListener("click", (event) => {
    const summaryCard = event.target.closest("[data-booking-summary-id]");
    if (!summaryCard || !latestUserBookings.length) return;
    activeUserBookingId = Number(summaryCard.dataset.bookingSummaryId);
    renderUserBookings(latestUserBookings);
  });

  userBookingsPagination?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-user-bookings-page]");
    if (!button) return;
    userBookingsPage = Number(button.dataset.userBookingsPage || 1);
    renderUserBookings(latestUserBookings);
  });

  [userBookingsSearch, userBookingsTypeFilter, userBookingsStatusFilter, userBookingsDateFilter].forEach((control) => {
    control?.addEventListener("input", () => {
      userBookingsPage = 1;
      renderUserBookings(latestUserBookings);
    });
    control?.addEventListener("change", () => {
      userBookingsPage = 1;
      renderUserBookings(latestUserBookings);
    });
  });

  userBookingsRowsPerPage?.addEventListener("change", () => {
    userBookingsPage = 1;
    renderUserBookings(latestUserBookings);
  });

  userBookingsExportBtn?.addEventListener("click", () => {
    const rows = getFilteredUserBookings();
    const csv = [
      ["Reference", "Status", "Created"],
      ...rows.map((booking) => [
        booking.reference,
        formatBookingStatus(booking.status, booking.payment?.status, getBookingCancellationReason(booking)),
        formatDate(booking.created_at)
      ])
    ]
      .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user-bookings.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
      await openUserResolutionMessage(bookingId, getUserResolutionCaseType());
    }
  });

  userBookingDetail?.addEventListener("click", async (event) => {
    const toggle = event.target.closest("[data-booking-actions-toggle]");
    if (toggle) {
      const panel = toggle.parentElement?.querySelector(".user-booking-actions-panel");
      const shouldOpen = panel?.classList.contains("is-hidden");
      document.querySelectorAll(".user-booking-actions-panel").forEach((menu) => menu.classList.add("is-hidden"));
      if (panel && shouldOpen) panel.classList.remove("is-hidden");
      return;
    }

    const resolutionButton = event.target.closest("[data-user-resolution-message]");
    if (resolutionButton) {
      const bookingId = Number(resolutionButton.dataset.userResolutionMessage);
      if (!bookingId) return;
      document.querySelectorAll(".user-booking-actions-panel").forEach((menu) => menu.classList.add("is-hidden"));
      pendingUserResolutionOrigin = "resolution";
      setUserView("resolution");
      setActiveUserNav("resolution");
      await openUserResolutionMessage(bookingId, getUserResolutionCaseType());
      return;
    }

    const reviewButton = event.target.closest("[data-user-booking-review]");
    if (reviewButton) {
      const bookingId = Number(reviewButton.dataset.userBookingReview);
      if (!bookingId) return;
      document.querySelectorAll(".user-booking-actions-panel").forEach((menu) => menu.classList.add("is-hidden"));
      openUserBookingReviewModal(bookingId);
      return;
    }

    const invoiceButton = event.target.closest("[data-user-booking-invoice]");
    if (invoiceButton) {
      const bookingId = Number(invoiceButton.dataset.userBookingInvoice);
      if (!bookingId) return;
      document.querySelectorAll(".user-booking-actions-panel").forEach((menu) => menu.classList.add("is-hidden"));
      const popup = window.open("", "_blank");
      try {
        await openBookingInvoice(bookingId, popup);
      } catch (error) {
        if (popup) popup.close();
        window.alert(error?.message || "Unable to open the invoice.");
      }
    }
  });

  userBookingReviewStars.forEach((button) => {
    button.addEventListener("click", () => {
      pendingUserBookingReviewRating = Number(button.dataset.userBookingReviewStar || 0);
      renderUserBookingReviewStars(pendingUserBookingReviewRating);
    });
  });

  userBookingReviewCancel?.addEventListener("click", () => closeUserBookingReviewModal());
  userBookingReviewClose?.addEventListener("click", () => closeUserBookingReviewModal());
  userBookingReviewSave?.addEventListener("click", async () => {
    await submitUserBookingReview();
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

    if (event.target.closest("[data-user-booking-review-close='true']")) {
      closeUserBookingReviewModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !userBookingReviewModal?.classList.contains("is-hidden")) {
      closeUserBookingReviewModal();
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
    if (userSettingsPanelTitle) {
      userSettingsPanelTitle.textContent =
        view === "notifications" ? "Notifications" : view === "security" ? "Login & security" : "General";
    }
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

  const parseVehicleDate = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatTimeUntilDate = (value, fallback) => {
    const target = parseVehicleDate(value);
    if (!target) return fallback;
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;

    if (diffMs <= 0) return "Expired";

    const weeks = Math.round(diffMs / weekMs);
    if (weeks >= 1) return `Due in ${weeks} week${weeks === 1 ? "" : "s"}`;

    const days = Math.ceil(diffMs / dayMs);
    return `Due in ${days} day${days === 1 ? "" : "s"}`;
  };

  const deriveMotStatus = (result) => {
    const motExpiry =
      result?.motExpiryDate ||
      result?.motDueDate ||
      result?.motTestDueDate ||
      result?.motTests?.[0]?.expiryDate ||
      result?.motTests?.[0]?.motTestExpiryDate;

    if (motExpiry) {
      return formatTimeUntilDate(motExpiry, "MOT details loaded");
    }

    const motStatus =
      result?.motStatus ||
      result?.motTests?.[0]?.testResult ||
      result?.motTests?.[0]?.motTestResult;

    if (motStatus) return String(motStatus);
    return "MOT status not available";
  };

  const deriveTaxStatus = (result) => {
    const taxDue =
      result?.taxDueDate ||
      result?.taxExpiryDate ||
      result?.taxStatusDate;

    if (taxDue) {
      return formatTimeUntilDate(taxDue, "Tax details loaded");
    }

    const taxStatus = result?.taxStatus;
    if (taxStatus) return String(taxStatus);
    return "Tax status not available";
  };

  const deriveMileage = (result, fallback = "-") => {
    const directMileage = result?.mileage;
    if (directMileage) return directMileage;

    const nestedMileage =
      result?.motTests?.[0]?.odometerValue ||
      result?.motTests?.[0]?.motTests?.[0]?.odometerValue;

    return nestedMileage || fallback;
  };

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
        mileage: deriveMileage(result, "-"),
        motStatus: deriveMotStatus(result),
        taxStatus: deriveTaxStatus(result)
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
    clearUserResolutionCaseAttachments();
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
    const attachments = pendingUserResolutionComplaintAttachments || [];
    if ((!body && !attachments.length) || !pendingUserResolutionBookingId || !userToken) return;
    pendingUserResolutionCaseType = "complaint";
    const detail = await apiAuth("/api/users/me/resolution-cases", userToken, {
      method: "POST",
      body: JSON.stringify({
        booking_id: pendingUserResolutionBookingId,
        type: getUserResolutionCaseType()
      })
    });
    const messageRoute = `/api/users/me/resolution-cases/${encodeURIComponent(detail.id)}/messages`;
    const updatedDetail = attachments.length
      ? await apiAuth(messageRoute, userToken, (() => {
          const formData = new FormData();
          formData.append("body", body);
          attachments.forEach((file) => formData.append("attachments", file));
          return {
            method: "POST",
            body: formData
          };
        })())
      : await apiAuth(messageRoute, userToken, {
          method: "POST",
          body: JSON.stringify({ body })
        });
    if (userResolutionComplaintInput) userResolutionComplaintInput.value = "";
    clearUserResolutionComplaintAttachments();
    await syncUserResolutionOverview();
    renderUserResolutionCaseDetail(updatedDetail);
    setUserResolutionSubview("case");
  });

  userResolutionComplaintAttachmentInput?.addEventListener("change", () => {
    const selectedFiles = Array.from(userResolutionComplaintAttachmentInput?.files || []);
    if (!selectedFiles.length) {
      renderUserResolutionComplaintAttachmentPreview();
      return;
    }
    pendingUserResolutionComplaintAttachments = [...pendingUserResolutionComplaintAttachments, ...selectedFiles];
    if (userResolutionComplaintAttachmentInput) userResolutionComplaintAttachmentInput.value = "";
    renderUserResolutionComplaintAttachmentPreview();
  });

  userResolutionCasesTable?.addEventListener("click", async (event) => {
    const viewButton = event.target.closest("[data-user-resolution-case-id]");
    if (!viewButton || !userToken) return;
    pendingUserResolutionCaseType = String(viewButton.dataset.userResolutionCaseType || pendingUserResolutionCaseType || "general").toLowerCase();
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
    pendingUserResolutionCaseType = String(viewButton.dataset.userResolutionCaseType || pendingUserResolutionCaseType || "general").toLowerCase();
    const detail = await apiAuth(`/api/users/me/resolution-cases/${encodeURIComponent(viewButton.dataset.userResolutionCaseId)}`, userToken);
    renderUserResolutionCaseDetail(detail);
    setUserResolutionSubview("case");
  });

  userResolutionCaseAttachBtn?.addEventListener("click", () => {
    userResolutionCaseAttachmentInput?.click();
  });

  userResolutionCaseAttachmentInput?.addEventListener("change", () => {
    if (!pendingUserResolutionCaseId) return;
    const selectedFiles = Array.from(userResolutionCaseAttachmentInput?.files || []);
    if (!selectedFiles.length) {
      renderUserResolutionCaseAttachmentPreview();
      return;
    }
    const existingFiles = pendingUserResolutionCaseAttachments.get(pendingUserResolutionCaseId) || [];
    pendingUserResolutionCaseAttachments.set(pendingUserResolutionCaseId, [...existingFiles, ...selectedFiles]);
    if (userResolutionCaseAttachmentInput) userResolutionCaseAttachmentInput.value = "";
    renderUserResolutionCaseAttachmentPreview();
  });

  userResolutionSendBtn?.addEventListener("click", async () => {
    const body = String(userResolutionMessageInput?.value || "").trim();
    const attachments = pendingUserResolutionCaseAttachments.get(pendingUserResolutionCaseId) || [];
    if (!pendingUserResolutionCaseId || (!body && !attachments.length) || !userToken) return;
    const route = `/api/users/me/resolution-cases/${encodeURIComponent(pendingUserResolutionCaseId)}/messages`;
    const detail = attachments.length
      ? await apiAuth(route, userToken, (() => {
          const formData = new FormData();
          formData.append("body", body);
          attachments.forEach((file) => formData.append("attachments", file));
          return {
            method: "POST",
            body: formData
          };
        })())
      : await apiAuth(route, userToken, {
          method: "POST",
          body: JSON.stringify({ body })
        });
    if (userResolutionMessageInput) userResolutionMessageInput.value = "";
    clearUserResolutionCaseAttachments(pendingUserResolutionCaseId);
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

  userSecurity2faEmail?.addEventListener("change", syncSecurity2faButton);
  userSecurity2faSms?.addEventListener("change", syncSecurity2faButton);
  syncSecurity2faButton();

  userSecurity2faEnable?.addEventListener("click", async () => {
    const token = getStoredAuthValue("userToken");
    if (!token) return;
    if (userSecurity2faMessage) userSecurity2faMessage.textContent = "";
    try {
      const result = await apiAuth("/api/users/me/security/two-factor", token, {
        method: "PATCH",
        body: JSON.stringify({
          two_factor_email_enabled: Boolean(userSecurity2faEmail?.checked)
        })
      });
      if (result) {
        setStoredAuthValue("userProfile", JSON.stringify(result));
      }
      syncSecurity2faButton();
      if (userSecurity2faMessage) {
        userSecurity2faMessage.textContent = userSecurity2faEmail?.checked
          ? "Email 2FA enabled."
          : "Email 2FA disabled.";
      }
    } catch (err) {
      console.error("Unable to update two factor settings", err);
      if (userSecurity2faMessage) {
        userSecurity2faMessage.textContent = err?.error?.message || err?.message || "Unable to update two factor settings.";
      }
    }
  });

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



