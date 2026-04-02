const userPage = document.getElementById("userPage");
if (userPage) {
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
  const userResolutionCaseCopy = document.getElementById("userResolutionCaseCopy");
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

  const formatCurrency = window.SWApp?.formatCurrency || ((amount) => String(amount || 0));

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

  const getUserBookingType = (booking) => booking?.items?.[0]?.name || "General";
  const getBookingStatusClass = (booking) => {
    const label = formatBookingStatus(booking.status, booking.payment?.status);
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
      const matchesStatus = statusValue === "all" || formatBookingStatus(booking.status, booking.payment?.status) === statusValue;

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

    return `
      <article class="user-booking-card">
        <div class="user-booking-toolbar">
          <span class="user-booking-status user-booking-status--${getBookingStatusClass(booking)}">${formatBookingStatus(booking.status, booking.payment?.status)}</span>
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
      </article>
    `;
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

    setSimpleOptions(userBookingsTypeFilter, bookingList.map(getUserBookingType), "Type");
    setSimpleOptions(
      userBookingsStatusFilter,
      bookingList.map((booking) => formatBookingStatus(booking.status, booking.payment?.status)),
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
        <td><span class="user-booking-status user-booking-status--${getBookingStatusClass(booking)}">${formatBookingStatus(booking.status, booking.payment?.status)}</span></td>
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
    userResolutionOverview?.classList.toggle("is-hidden", !(isOverview || isMessage || isCase));
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
    const caseTitle = detail?.subject || "General Enquiry";
    if (userResolutionCaseTitle) userResolutionCaseTitle.textContent = caseTitle;
    if (userResolutionCaseCopy) {
      userResolutionCaseCopy.classList.toggle("is-hidden", caseTitle.toLowerCase() !== "general enquiry");
    }
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
        const item = document.createElement("div");
        item.className = `mechanic-resolution-message ${message.sender_role === "customer" ? "is-customer" : "is-mechanic"}`;
        item.innerHTML = `
          <div class="mechanic-resolution-message-row">
            <div class="mechanic-resolution-message-avatar" aria-hidden="true">${avatarMarkup}</div>
            <div class="mechanic-resolution-message-content">
              <div class="mechanic-resolution-bubble">${String(message.body || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</div>
              <span class="mechanic-resolution-message-meta">${senderName}, ${formatUserResolutionDateTime(message.created_at)}</span>
            </div>
          </div>
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
        formatBookingStatus(booking.status, booking.payment?.status),
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
      await openUserResolutionMessage(bookingId, "general");
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

