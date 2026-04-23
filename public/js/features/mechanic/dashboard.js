const mechanicDashboard = document.getElementById("mechanicPage") || document.querySelector(".mechanic-shell");
if (mechanicDashboard) {
  const mechanicBackBtn = document.getElementById("mechanicBackBtn");
  const mechanicLogoutBtn = document.getElementById("mechanicLogoutBtn");
  const mechanicHeaderMobileMenuToggle = document.getElementById("mechanicHeaderMobileMenuToggle");
  const mechanicMobileMenu = document.getElementById("mechanicMobileMenu");
  const mechanicMobileMenuName = document.getElementById("mechanicMobileMenuName");
  const mechanicMobileMenuBackdrop = document.getElementById("mechanicMobileMenuBackdrop");
  const mechanicMobileLogoutBtn = document.getElementById("mechanicMobileLogoutBtn");
  const mechanicMobileMenuLinks = mechanicDashboard.querySelectorAll(".mechanic-mobile-menu [data-view], .mechanic-mobile-menu [data-target-view], .mechanic-mobile-menu [data-target-page], .mechanic-mobile-menu [data-action], .mechanic-mobile-menu [data-href]");
  const mechanicNavLinks = mechanicDashboard.querySelectorAll(".rail-nav .rail-item[data-view]");
  const mechanicRail = mechanicDashboard.querySelector(".mainRail");
  const mechanicRailToggle = document.getElementById("mechanicRailToggle");
  const MECHANIC_RAIL_STORAGE_KEY = "sw_mechanic_rail_collapsed";
  const mechanicDashboardView = document.getElementById("mechanicDashboardView");
  const mechanicBookingInformationView = document.getElementById("mechanicBookingInformationView");
  const mechanicResolutionCenterView = document.getElementById("mechanicResolutionCenterView");
  const mechanicProcedureView = document.getElementById("mechanicProcedureView");
  const mechanicPaymentsView = document.getElementById("mechanicPaymentsView");
  const mechanicHeroSectionTitle = document.getElementById("mechanicHeroSectionTitle");
  const mechanicHeroSectionSubtitle = document.getElementById("mechanicHeroSectionSubtitle");
  const mechanicDashboardHeroAvatar = document.getElementById("mechanicDashboardHeroAvatar");
  const mechanicDashboardHeroName = document.getElementById("mechanicDashboardHeroName");
  const mechanicDashboardHeroRole = document.getElementById("mechanicDashboardHeroRole");
  const mechanicProfileView = document.getElementById("mechanicProfileView");
  const mechanicAccountView = document.getElementById("mechanicAccountView");
  const mechanicPictureView = document.getElementById("mechanicPictureView");
  const mechanicCertificationsView = document.getElementById("mechanicCertificationsView");
  const mechanicTaxView = document.getElementById("mechanicTaxView");
  const mechanicTaxVat = document.getElementById("mechanicTaxVat");
  const mechanicTaxSaveBtn = document.getElementById("mechanicTaxSaveBtn");
  const mechanicTaxStatus = document.getElementById("mechanicTaxStatus");
  const mechanicDocumentsView = document.getElementById("mechanicDocumentsView");
  const mechanicPreferencesView = document.getElementById("mechanicPreferencesView");
  const mechanicTypesView = document.getElementById("mechanicTypesView");
  const mechanicSettingsView = document.getElementById("mechanicSettingsView");
  const nameEl = document.getElementById("mechanicWelcomeName");
  const mechanicAccountName = document.getElementById("mechanicAccountName");
  const idEl = document.getElementById("mechanicId");
  const mechanicBookingsList = document.getElementById("mechanicBookingsList");
  const mechanicBookingDetail = document.getElementById("mechanicBookingDetail");
  const mechanicBookingsSearch = document.getElementById("mechanicBookingsSearch");
  const mechanicBookingsStatusFilter = document.getElementById("mechanicBookingsStatusFilter");
  const mechanicBookingsDateFilter = document.getElementById("mechanicBookingsDateFilter");
  const mechanicBookingsRowsPerPage = document.getElementById("mechanicBookingsRowsPerPage");
  const mechanicBookingsFooterCount = document.getElementById("mechanicBookingsFooterCount");
  const mechanicBookingsPagination = document.getElementById("mechanicBookingsPagination");
  const mechanicBookingsExport = mechanicDashboard.querySelector(".mechanic-bookings-export");
  const mechanicDashboardAssignedCount = document.getElementById("mechanicDashboardAssignedCount");
  const mechanicDashboardRequestedCount = document.getElementById("mechanicDashboardRequestedCount");
  const mechanicDashboardAcceptedCount = document.getElementById("mechanicDashboardAcceptedCount");
  const mechanicDashboardOpenCasesCount = document.getElementById("mechanicDashboardOpenCasesCount");
  const mechanicDashboardRecentBookings = document.getElementById("mechanicDashboardRecentBookings");
  const mechanicDashboardOffersStatus = document.getElementById("mechanicDashboardOffersStatus");
  const mechanicDashboardInfoRequestSecondary = document.getElementById("mechanicDashboardInfoRequestSecondary");
  const mechanicDashboardRecentStatus = document.getElementById("mechanicDashboardRecentStatus");
  const mechanicBookingInformationStatus = document.getElementById("mechanicBookingInformationStatus");
  const mechanicPaymentsStatus = document.getElementById("mechanicPaymentsStatus");
  const mechanicOverviewActionButtons = mechanicDashboard.querySelectorAll(".mechanic-overview-action[data-view]");
  const mechanicPaymentsList = document.getElementById("mechanicPaymentsList");
  const mechanicPaymentDetail = document.getElementById("mechanicPaymentDetail");
  const mechanicPaymentsSearch = document.getElementById("mechanicPaymentsSearch");
  const mechanicPaymentsStatusFilter = document.getElementById("mechanicPaymentsStatusFilter");
  const mechanicPaymentsDateFilter = document.getElementById("mechanicPaymentsDateFilter");
  const mechanicPaymentsRowsPerPage = document.getElementById("mechanicPaymentsRowsPerPage");
  const mechanicPaymentsFooterCount = document.getElementById("mechanicPaymentsFooterCount");
  const mechanicPaymentsPagination = document.getElementById("mechanicPaymentsPagination");
  const mechanicPaymentsExport = mechanicDashboard.querySelector(".mechanic-payments-export");
  const mechanicPaymentsLayout = mechanicPaymentsView?.querySelector(".mechanic-table-layout");
  const mechanicAccountAvatar = document.getElementById("mechanicAccountAvatar");
  const mechanicAccountAvatarSecondary = document.getElementById("mechanicAccountAvatarSecondary");
  const mechanicAccountPhone = document.getElementById("mechanicAccountPhone");
  const mechanicAccountPhoneSecondary = document.getElementById("mechanicAccountPhoneSecondary");
  const mechanicAccountEmail = document.getElementById("mechanicAccountEmail");
  const mechanicAccountEmailSecondary = document.getElementById("mechanicAccountEmailSecondary");
  const mechanicAccountUsername = document.getElementById("mechanicAccountUsername");
  const mechanicAccountUsernameSecondary = document.getElementById("mechanicAccountUsernameSecondary");
  const mechanicAccountAddressSecondary = document.getElementById("mechanicAccountAddressSecondary");
  const mechanicAccountPremisesAddressSecondary = document.getElementById("mechanicAccountPremisesAddressSecondary");
  const mechanicAccountRole = document.getElementById("mechanicAccountRole");
  const mechanicAccountRoleSecondary = document.getElementById("mechanicAccountRoleSecondary");
  const mechanicAccountStatusSecondary = document.getElementById("mechanicAccountStatusSecondary");
  const mechanicDocumentsInfoRequestSecondary = document.getElementById("mechanicDocumentsInfoRequestSecondary");
  const mechanicProfileAvatar = document.getElementById("mechanicProfileAvatar");
  const mechanicProfileHeading = document.getElementById("mechanicProfileHeading");
  const mechanicProfileRatings = document.getElementById("mechanicProfileRatings");
  const mechanicProfileExperience = document.getElementById("mechanicProfileExperience");
  const mechanicProfileActiveSince = document.getElementById("mechanicProfileActiveSince");
  const mechanicProfileJobsCompleted = document.getElementById("mechanicProfileJobsCompleted");
  const mechanicProfileQualifications = document.getElementById("mechanicProfileQualifications");
  const mechanicProfileAccreditations = document.getElementById("mechanicProfileAccreditations");
  const mechanicProfileMemberships = document.getElementById("mechanicProfileMemberships");
  const mechanicProfileBaseLocation = document.getElementById("mechanicProfileBaseLocation");
  const mechanicProfilePostcode = document.getElementById("mechanicProfilePostcode");
  const mechanicProfileRadius = document.getElementById("mechanicProfileRadius");
  const mechanicProfileServiceType = document.getElementById("mechanicProfileServiceType");
  const mechanicProfileMapEl = document.getElementById("mechanicProfileMap");
  const mechanicProfileReviewsList = document.getElementById("mechanicProfileReviewsList");
  const mechanicProfileReviewsPagination = document.getElementById("mechanicProfileReviewsPagination");
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
  const mechanicCertQualificationsList = document.getElementById("mechanicCertQualificationsList");
  const mechanicCertAccreditationsList = document.getElementById("mechanicCertAccreditationsList");
  const mechanicCertMembershipsList = document.getElementById("mechanicCertMembershipsList");
  const mechanicCertStatus = document.getElementById("mechanicCertStatus");
  const mechanicCertificationQualification = document.getElementById("mechanicCertificationQualification");
  const mechanicCertificationQualificationAdd = document.getElementById("mechanicCertificationQualificationAdd");
  const mechanicCertificationAccreditation = document.getElementById("mechanicCertificationAccreditation");
  const mechanicCertificationAccreditationAdd = document.getElementById("mechanicCertificationAccreditationAdd");
  const mechanicCertificationMembership = document.getElementById("mechanicCertificationMembership");
  const mechanicCertificationMembershipAdd = document.getElementById("mechanicCertificationMembershipAdd");
  const mechanicCertSaveBtn = document.getElementById("mechanicCertSaveBtn");
  const mechanicSettingsWelcomeName = document.getElementById("mechanicSettingsWelcomeName");
  const mechanicSettingsPanelTitle = document.getElementById("mechanicSettingsPanelTitle");
  const mechanicSettingsFullName = document.getElementById("mechanicSettingsFullName");
  const mechanicSettingsPhone = document.getElementById("mechanicSettingsPhone");
  const mechanicSettingsUsername = document.getElementById("mechanicSettingsUsername");
  const mechanicSettingsEmail = document.getElementById("mechanicSettingsEmail");
  const mechanicSettingsAddress = document.getElementById("mechanicSettingsAddress");
  const mechanicSettingsAvatarSettings = document.getElementById("mechanicSettingsAvatarSettings");
  const mechanicSettingsPhotoButton = document.getElementById("mechanicSettingsPhotoButton");
  const mechanicSettingsPhotoInput = document.getElementById("mechanicSettingsPhotoInput");
  const mechanicSettingsEditButtons = mechanicDashboard.querySelectorAll("[data-mechanic-settings-field]");
  const mechanicSettingsEditModal = document.getElementById("mechanicSettingsEditModal");
  const mechanicSettingsEditClose = document.getElementById("mechanicSettingsEditClose");
  const mechanicSettingsEditCancel = document.getElementById("mechanicSettingsEditCancel");
  const mechanicSettingsEditSave = document.getElementById("mechanicSettingsEditSave");
  const mechanicSettingsEditTitle = document.getElementById("mechanicSettingsEditTitle");
  const mechanicSettingsEditDescription = document.getElementById("mechanicSettingsEditDescription");
  const mechanicSettingsEditLabel = document.getElementById("mechanicSettingsEditLabel");
  const mechanicSettingsEditInput = document.getElementById("mechanicSettingsEditInput");
  const mechanicSettingsNameGrid = document.getElementById("mechanicSettingsNameGrid");
  const mechanicSettingsAddressGrid = document.getElementById("mechanicSettingsAddressGrid");
  const mechanicSettingsEditFirstName = document.getElementById("mechanicSettingsEditFirstName");
  const mechanicSettingsEditMiddleName = document.getElementById("mechanicSettingsEditMiddleName");
  const mechanicSettingsEditLastName = document.getElementById("mechanicSettingsEditLastName");
  const mechanicSettingsEditAddressLine1 = document.getElementById("mechanicSettingsEditAddressLine1");
  const mechanicSettingsEditAddressLine2 = document.getElementById("mechanicSettingsEditAddressLine2");
  const mechanicSettingsEditCity = document.getElementById("mechanicSettingsEditCity");
  const mechanicSettingsEditPostcode = document.getElementById("mechanicSettingsEditPostcode");
  const mechanicSettingsEditMessage = document.getElementById("mechanicSettingsEditMessage");
  const mechanicSecurityUsername = document.getElementById("mechanicSecurityUsername");
  const mechanicResolutionOverview = document.getElementById("mechanicResolutionOverview");
  const mechanicResolutionFilterTabs = mechanicDashboard.querySelectorAll("[data-mechanic-resolution-filter]");
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
  const mechanicResolutionCaseAttachBtn = document.getElementById("mechanicResolutionCaseAttachBtn");
  const mechanicResolutionCaseAttachmentInput = document.getElementById("mechanicResolutionCaseAttachmentInput");
  const mechanicResolutionCaseAttachmentPreview = document.getElementById("mechanicResolutionCaseAttachmentPreview");
  const mechanicResolutionSidebarTitle = document.getElementById("mechanicResolutionSidebarTitle");
  const mechanicResolutionSidebarCustomer = document.getElementById("mechanicResolutionSidebarCustomer");
  const mechanicResolutionSidebarCar = document.getElementById("mechanicResolutionSidebarCar");
  const mechanicResolutionSidebarAddress = document.getElementById("mechanicResolutionSidebarAddress");
  const mechanicResolutionSidebarWork = document.getElementById("mechanicResolutionSidebarWork");
  const mechanicResolutionSidebarArrivalTime = document.getElementById("mechanicResolutionSidebarArrivalTime");
  const mechanicResolutionSidebarParts = document.getElementById("mechanicResolutionSidebarParts");
  const mechanicResolutionSidebarTotal = document.getElementById("mechanicResolutionSidebarTotal");
  const mechanicSettingsSubnavLinks = mechanicDashboard.querySelectorAll("[data-mechanic-settings-subview]");
  const mechanicSettingsGeneral = document.getElementById("mechanicSettingsGeneral");
    const mechanicSettingsNotifications = document.getElementById("mechanicSettingsNotifications");
    const mechanicSettingsSecurity = document.getElementById("mechanicSettingsSecurity");
    const mechanicSecurity2faEmail = document.getElementById("mechanicSecurity2faEmail");
    const mechanicSecurity2faSms = document.getElementById("mechanicSecurity2faSms");
    const mechanicSecurity2faEnable = document.getElementById("mechanicSecurity2faEnable");
    const mechanicSecurity2faMessage = document.getElementById("mechanicSecurity2faMessage");
  const editLink = document.getElementById("mechanicEditProfile");
  const viewLink = document.getElementById("mechanicViewProfile");
  const profile = getStoredAuthValue("userProfile");
  let currentMechanicUser = null;
  let latestMechanicCoverage = [];
  let latestMechanicResolutionCases = [];
  let latestMechanicAssignedBookings = [];
  let latestMechanicOffers = [];
  let latestMechanicCertificationState = {
    qualifications: [],
    accreditations: [],
    memberships: []
  };
    let activeMechanicBookingOfferId = null;
    let activeMechanicPaymentBookingId = null;
    let activeMechanicCompletionBookingId = null;
    let activeMechanicCancelBookingId = null;
    let pendingMechanicPhotoBookingId = null;
    const pendingMechanicCompletionFiles = new Map();
    const pendingMechanicCompletionParts = new Map();
    const pendingMechanicCancellationReasons = new Map();
  let activeMechanicSettingsField = "";
  let mechanicBookingsPage = 1;
  let mechanicPaymentsPage = 1;
  let activeMechanicResolutionFilter = "all";
  let pendingResolutionBookingId = null;
  let pendingResolutionCaseId = null;
  const pendingMechanicResolutionCaseAttachments = new Map();
  const formatDate = window.SWApp?.formatShortDate || ((value) => String(value || "-"));
  const formatCurrency = window.SWApp?.formatCurrency || ((value) => String(value || "0"));
  const escapeHtml = window.SWApp?.escapeHtml || ((value) => String(value ?? ""));
  const getInitials = window.SWApp?.getInitials || ((name) => String(name || "ME"));
  const getMechanicFallbackAvatarUrl = (user) => {
    return "";
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
  const normalizeMechanicListPayload = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.items)) return value.items;
    if (Array.isArray(value?.cases)) return value.cases;
    if (Array.isArray(value?.bookings)) return value.bookings;
    return [];
  };
  const setAvatar = (el, initials, url) => {
    if (!el) return;
    el.innerHTML = "";
    if (url) {
      const resolvedUrl = String(url).startsWith("/uploads") ? String(url) : String(url);
      const img = document.createElement("img");
      img.src = resolvedUrl;
      img.alt = "";
      el.appendChild(img);
      return;
    }
    el.textContent = initials;
  };
  const setLabeledText = (el, label, value) => {
    if (!el) return;
    el.innerHTML = `<span class="mechanic-account-label">${escapeHtml(label)}</span><span class="mechanic-account-value">${escapeHtml(value || "-")}</span>`;
  };
  const renderMechanicProfileReviews = (reviews = []) => {
    if (!mechanicProfileReviewsList) return;
    if (!Array.isArray(reviews) || !reviews.length) {
      mechanicProfileReviewsList.innerHTML = '<p class="mechanic-profile-reviews-empty">No reviews yet.</p>';
      if (mechanicProfileReviewsPagination) mechanicProfileReviewsPagination.innerHTML = "";
      return;
    }
    const totalPages = Math.max(1, Math.ceil(reviews.length / mechanicProfileReviewsPageSize));
    mechanicProfileReviewsPage = Math.min(Math.max(1, mechanicProfileReviewsPage), totalPages);
    const startIndex = (mechanicProfileReviewsPage - 1) * mechanicProfileReviewsPageSize;
    const visibleReviews = reviews.slice(startIndex, startIndex + mechanicProfileReviewsPageSize);

    mechanicProfileReviewsList.innerHTML = visibleReviews.map((entry) => {
      const name = String(entry?.customer_name || "Customer");
      const initials = getInitials(name);
      const avatar = String(entry?.customer_avatar_url || "").trim();
      const rating = Math.max(0, Math.min(5, Number(entry?.rating || 0))) || 0;
      const stars = "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
      const dateText = entry?.created_at ? formatMechanicDateTime(entry.created_at) : "-";
      return `
        <article class="mechanic-profile-review-item">
          <div class="mechanic-profile-review-avatar">
            ${avatar ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}">` : escapeHtml(initials)}
          </div>
          <div>
            <div class="mechanic-profile-review-head">
              <span class="mechanic-profile-review-name">${escapeHtml(name)}</span>
              <span class="mechanic-profile-review-stars" aria-label="${rating} out of 5 stars">${stars}</span>
            </div>
            <p class="mechanic-profile-review-comment">${escapeHtml(entry?.comment || "No comment provided.")}</p>
            <div class="mechanic-profile-review-date">${escapeHtml(dateText)}</div>
          </div>
        </article>
      `;
    }).join("");

    if (!mechanicProfileReviewsPagination) return;
    if (totalPages <= 1) {
      mechanicProfileReviewsPagination.innerHTML = "";
      return;
    }
    mechanicProfileReviewsPagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return `<button type="button" class="mechanic-profile-reviews-dot${
        page === mechanicProfileReviewsPage ? " is-active" : ""
      }" data-mechanic-profile-reviews-page="${page}" aria-label="Go to review page ${page}"></button>`;
    }).join("");
  };

  const setMechanicAccountStatus = (el, value) => {
    if (!el) return;
    const key = String(value || "").trim().toLowerCase();
    const normalized = key || "pending";
    const labelMap = {
      active: "Active",
      pending: "Pending",
      password_pending: "Pending",
      lead_created: "Pending",
      inactive: "Inactive",
      disabled: "Disabled",
      suspended: "Suspended",
      rejected: "Rejected"
    };
    const label = labelMap[normalized] || normalized.charAt(0).toUpperCase() + normalized.slice(1);
    el.textContent = label;
    el.dataset.status = normalized;
  };
  const renderMechanicInfoRequestBlock = (element, noteText) => {
    if (!element) return;
    const introText = "SmartWorkshop requires this document in order to complete your application. Thanks";
    const requestText = String(noteText || "").trim() || "The admin requested additional information for your application.";
    element.innerHTML = "";
    const introLine = document.createElement("span");
    introLine.className = "mechanic-info-request-intro";
    introLine.textContent = introText;
    const labelLine = document.createElement("span");
    labelLine.className = "mechanic-info-request-label";
    labelLine.textContent = "Request info:";
    const noteLine = document.createElement("span");
    noteLine.className = "mechanic-info-request-note";
    noteLine.textContent = requestText;
    element.append(introLine, labelLine, noteLine);
  };

  const renderMechanicInfoRequestNotes = (user) => {
    const applicationStatus = String(user?.application_status || "").trim().toLowerCase();
    const requestNote = String(user?.info_request_note || "").trim();

    if (mechanicDocumentsInfoRequestSecondary) {
      if (applicationStatus === "info_requested") {
        mechanicDocumentsInfoRequestSecondary.classList.remove("is-hidden");
        renderMechanicInfoRequestBlock(mechanicDocumentsInfoRequestSecondary, requestNote);
      } else {
        mechanicDocumentsInfoRequestSecondary.classList.add("is-hidden");
        mechanicDocumentsInfoRequestSecondary.textContent = "";
      }
    }

    if (mechanicDashboardInfoRequestSecondary) {
      if (applicationStatus === "info_requested") {
        mechanicDashboardInfoRequestSecondary.classList.remove("is-hidden");
        renderMechanicInfoRequestBlock(mechanicDashboardInfoRequestSecondary, requestNote);
      } else {
        mechanicDashboardInfoRequestSecondary.classList.add("is-hidden");
        mechanicDashboardInfoRequestSecondary.textContent = "";
      }
    }
  };
  const resolveMechanicAccountStatus = (user) => {
    const applicationStatus = String(user?.application_status || "").trim().toLowerCase();
    const accountStatus = String(user?.account_status || "").trim().toLowerCase();
    if (applicationStatus !== "approved") {
      return "pending";
    }
    return accountStatus || "pending";
  };
  const syncMechanicSecurity2faButton = () => {
    if (!mechanicSecurity2faEnable) return;
    const hasSelection = Boolean(mechanicSecurity2faEmail?.checked || mechanicSecurity2faSms?.checked);
    mechanicSecurity2faEnable.classList.toggle("is-active", hasSelection);
  };

  const setMechanicRailState = (collapsed) => {
    const nextCollapsed = Boolean(collapsed);
    mechanicRail?.classList.toggle("is-collapsed", nextCollapsed);
    mechanicDashboard?.classList.toggle("is-rail-collapsed", nextCollapsed);
    if (mechanicRailToggle) {
      mechanicRailToggle.setAttribute("aria-expanded", String(!nextCollapsed));
      mechanicRailToggle.setAttribute("aria-label", nextCollapsed ? "Expand sidebar" : "Collapse sidebar");
    }
    localStorage.setItem(MECHANIC_RAIL_STORAGE_KEY, nextCollapsed ? "collapsed" : "expanded");
  };

  const initializeMechanicRail = () => {
    setMechanicRailState(false);
  };

  const setSimpleOptions = (select, labels, defaultLabel) => {
    if (!select) return;
    const current = select.value || "all";
    const values = Array.from(new Set((labels || []).filter(Boolean)));
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

  const setMechanicOffersStatus = (message = "") => {
    [mechanicDashboardOffersStatus, mechanicDashboardRecentStatus, mechanicBookingInformationStatus].forEach((element) => {
      if (!element) return;
      element.textContent = message;
      element.classList.toggle("is-hidden", !message);
    });
  };

  const setMechanicPaymentsStatus = (message = "") => {
    if (!mechanicPaymentsStatus) return;
    mechanicPaymentsStatus.textContent = message;
    mechanicPaymentsStatus.classList.toggle("is-hidden", !message);
  };

  const setMechanicTaxStatus = (message = "", tone = "") => {
    if (!mechanicTaxStatus) return;
    mechanicTaxStatus.textContent = message;
    mechanicTaxStatus.classList.toggle("is-hidden", !message);
    mechanicTaxStatus.classList.remove("is-success", "is-warning", "is-error");
    if (message && tone) {
      mechanicTaxStatus.classList.add(`is-${tone}`);
    }
  };

  const getMechanicCompletionFiles = (bookingId) =>
    pendingMechanicCompletionFiles.get(Number(bookingId)) || [];

  const setMechanicCompletionFiles = (bookingId, files) => {
    pendingMechanicCompletionFiles.set(
      Number(bookingId),
      Array.from(files || []).filter((file) => String(file?.type || "").startsWith("image/"))
    );
  };

  const appendMechanicCompletionFiles = (bookingId, files) => {
    const currentFiles = getMechanicCompletionFiles(bookingId);
    const nextFiles = [
      ...currentFiles,
      ...Array.from(files || []).filter((file) => String(file?.type || "").startsWith("image/"))
    ];
    pendingMechanicCompletionFiles.set(Number(bookingId), nextFiles);
  };

  const clearMechanicCompletionFiles = (bookingId) => {
    pendingMechanicCompletionFiles.delete(Number(bookingId));
  };

  const getMechanicCompletionParts = (bookingId) =>
    pendingMechanicCompletionParts.get(Number(bookingId)) || [{}];

  const setMechanicCompletionParts = (bookingId, parts) => {
    pendingMechanicCompletionParts.set(Number(bookingId), Array.isArray(parts) && parts.length ? parts : [{}]);
  };

    const clearMechanicCompletionParts = (bookingId) => {
      pendingMechanicCompletionParts.delete(Number(bookingId));
    };

    const getMechanicCancellationReason = (bookingId) =>
      pendingMechanicCancellationReasons.get(Number(bookingId)) || "";

    const setMechanicCancellationReason = (bookingId, reason) => {
      const value = String(reason || "").trim();
      if (value) pendingMechanicCancellationReasons.set(Number(bookingId), value);
      else pendingMechanicCancellationReasons.delete(Number(bookingId));
    };

    const clearMechanicCancellationReason = (bookingId) => {
      pendingMechanicCancellationReasons.delete(Number(bookingId));
    };

  const readMechanicCompletionPartsFromForm = (form) =>
    Array.from(form?.querySelectorAll(".mechanic-completion-part-row") || [])
      .map((row) => ({
        description: row.querySelector("[data-mechanic-part-description]")?.value || "",
        amount_eur: row.querySelector("[data-mechanic-part-amount]")?.value || ""
      }));

  const getMechanicPaymentStatusKey = (entry) => {
    const rawKey = String(entry?.payment?.status || "unpaid").trim().toLowerCase();
    return rawKey === "auth_captured" ? "completed" : rawKey;
  };
  const getMechanicPaymentStatusLabel = (entry) => {
    const rawKey = String(entry?.payment?.status || "unpaid").trim().toLowerCase();
    const key = rawKey === "auth_captured" ? "completed" : rawKey;
    if (key === "paid") return "Paid";
    if (key === "pending") return "Pending";
    if (key === "failed") return "Failed";
    if (key === "refunded") return "Refunded";
    if (key === "completed") return "Completed";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getMechanicPaymentMethodLabel = (entry) => {
    const value = String(entry?.payment?.payment_method || entry?.booking?.payment_method || "").trim().toLowerCase();
    if (!value) return "-";
    if (value.includes("debit")) return "Debit";
    if (value.includes("credit")) return "Credit";
    if (value.includes("visa") || value.includes("mastercard") || value.includes("master card") || value.includes("amex") || value.includes("american express")) {
      return "Credit";
    }
    return "Credit";
  };

  const getMechanicPaymentNumber = (entry) =>
    String(entry?.payment?.provider_ref || entry?.booking?.payment_number || entry?.invoice?.number || "-").trim() || "-";

  const getMechanicCardLast4 = (entry) =>
    (() => {
      const digits = String(entry?.payment?.card_last4 || entry?.booking?.payment_last4 || "").replace(/\D+/g, "").slice(-4);
      return digits.length === 4 ? digits : "-";
    })();

  const normalizeMechanicPaymentEntry = (entry) => {
    if (!entry) return null;
    if (entry.payment) return entry;
    const bookingStatus = String(entry.booking?.status || "").trim().toLowerCase();
    if (bookingStatus !== "completed" && !entry.invoice) return null;
    return {
      ...entry,
      payment: {
        status: "completed",
        amount_eur: Number(entry.booking?.total_eur || 0),
        currency: "GBP",
        provider_ref: entry.invoice?.number || entry.invoice?.pdf_url || `BOOKING-${entry.booking?.reference || entry.booking?.id || "-"}`,
        payment_method: entry.booking?.payment_method || null,
        card_last4: entry.booking?.payment_last4 || null
      }
    };
  };

  const setMechanicHeroByView = (view) => {
    const heroConfig = {
      dashboard: { title: "Dashboard", subtitle: "General information" },
      "booking-information": { title: "Booking information", subtitle: "Review assigned bookings and booking details" },
      account: { title: "Account", subtitle: "Review your profile information" },
      resolution: { title: "Resolution center", subtitle: "Manage customer issues and active resolutions" },
      procedure: { title: "Procedure", subtitle: "Review your mechanic procedures and workflow" },
      payments: { title: "Payments", subtitle: "Review payouts and payment activity" },
      profile: { title: "Profile", subtitle: "Review your public mechanic profile" },
      "edit-profile": { title: "Edit profile", subtitle: "Update your experience, coverage and fulfilment details" },
      picture: { title: "Profile picture", subtitle: "Manage your profile picture" },
      certifications: { title: "Certification", subtitle: "Review and manage your certifications" },
      tax: { title: "Tax information", subtitle: "Review your tax details" },
      documents: { title: "Document", subtitle: "Review your uploaded documents" },
      preferences: { title: "Preferences", subtitle: "Manage your mechanic preferences" },
      types: { title: "Type of work covered", subtitle: "Review the work types you cover" },
      settings: { title: "Account settings", subtitle: "Manage your profile and preferences" }
    };
    const current = heroConfig[view] || heroConfig.dashboard;
    if (mechanicHeroSectionTitle) mechanicHeroSectionTitle.textContent = current.title;
    if (mechanicHeroSectionSubtitle) mechanicHeroSectionSubtitle.textContent = current.subtitle;
  };

  if (profile) {
    try {
      const user = JSON.parse(profile);
      currentMechanicUser = user;
      const name = [user.name, user.lastname].filter(Boolean).join(" ") || user.email || "Mechanic";
      const initials = name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] || "")
        .join("")
        .toUpperCase() || "ME";
      const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : [user?.role_name || "MECHANIC"];
      const activeRole = roles.includes("MECHANIC") ? "MECHANIC" : roles[0];
      setAvatar(mechanicDashboardHeroAvatar, initials, getMechanicFallbackAvatarUrl(user));
      if (mechanicDashboardHeroName) mechanicDashboardHeroName.textContent = name;
      if (mechanicDashboardHeroRole) mechanicDashboardHeroRole.textContent = activeRole;
      if (nameEl) nameEl.textContent = name;
      if (mechanicAccountName) mechanicAccountName.textContent = name;
      if (idEl) {
        const base = (user.uuid_public || user.id || "0000").toString().slice(-4).toUpperCase();
        idEl.textContent = `AG${base}`;
      }
      setAvatar(mechanicAccountAvatar, initials, getMechanicFallbackAvatarUrl(user));
      setAvatar(mechanicAccountAvatarSecondary, initials, getMechanicFallbackAvatarUrl(user));
      setLabeledText(mechanicAccountPhone, "Phone:", user?.phone);
      setLabeledText(mechanicAccountPhoneSecondary, "Phone:", user?.phone);
      setLabeledText(mechanicAccountEmail, "Email:", user?.email);
      setLabeledText(mechanicAccountEmailSecondary, "Email:", user?.email);
      setLabeledText(mechanicAccountUsername, "Username:", user?.username);
      setLabeledText(mechanicAccountUsernameSecondary, "Username:", user?.username);
        const contactAddress = user?.contact_address || user?.address || "";
      setLabeledText(mechanicAccountAddressSecondary, "Contact address:", contactAddress);
        const premisesAddress = user?.premises_address || "";
        const premisesAddressDetails = user?.premises_address_details || null;
        const premisesAddressValue = premisesAddressDetails
          ? [premisesAddressDetails.line1, premisesAddressDetails.line2, premisesAddressDetails.city, premisesAddressDetails.postal_code, premisesAddressDetails.country]
              .filter((value) => String(value || "").trim())
              .join(", ")
          : String(premisesAddress || "").trim();
        if (premisesAddressValue) {
          if (mechanicAccountPremisesAddressSecondary) {
            mechanicAccountPremisesAddressSecondary.classList.remove("is-hidden");
            setLabeledText(mechanicAccountPremisesAddressSecondary, "Premises address:", premisesAddressValue);
          }
        } else if (mechanicAccountPremisesAddressSecondary) {
          mechanicAccountPremisesAddressSecondary.classList.add("is-hidden");
          mechanicAccountPremisesAddressSecondary.textContent = "Premises address: -";
        }
      if (mechanicAccountRole) mechanicAccountRole.textContent = activeRole;
      if (mechanicAccountRoleSecondary) mechanicAccountRoleSecondary.textContent = activeRole;
      setMechanicAccountStatus(mechanicAccountStatusSecondary, resolveMechanicAccountStatus(user));
      renderMechanicInfoRequestNotes(user);
      if (mechanicSettingsWelcomeName) mechanicSettingsWelcomeName.textContent = name;
      setAvatar(mechanicSettingsAvatarSettings, getInitials(name, activeRole), getMechanicFallbackAvatarUrl(user));
      if (mechanicSettingsFullName) mechanicSettingsFullName.textContent = name;
      if (mechanicSettingsPhone) mechanicSettingsPhone.textContent = user?.phone || "-";
      if (mechanicSettingsUsername) mechanicSettingsUsername.textContent = user?.username || "-";
      if (mechanicSettingsEmail) mechanicSettingsEmail.textContent = user?.email || "-";
      if (mechanicSettingsAddress) mechanicSettingsAddress.textContent = user?.address || "-";
      if (mechanicSecurity2faEmail) mechanicSecurity2faEmail.checked = Boolean(user?.two_factor_email_enabled);
      if (mechanicSecurity2faSms) mechanicSecurity2faSms.checked = false;
      syncMechanicSecurity2faButton();
      if (mechanicSecurityUsername) mechanicSecurityUsername.value = user?.email || user?.username || "";
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
      setAvatar(mechanicProfileAvatar, initials || "ME", getMechanicFallbackAvatarUrl(user));
      renderMechanicCertificationState();
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

  const refreshMechanicProfileFromApi = async () => {
    const token = getStoredAuthValue("userToken");
    if (!token) return null;
    try {
      const response = await fetch("/api/users/me/mechanic-profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) return null;
      const freshProfile = await response.json();
      currentMechanicUser = {
        ...(currentMechanicUser || {}),
        ...freshProfile
      };
      setStoredAuthValue("userProfile", JSON.stringify(currentMechanicUser));
      setMechanicAccountStatus(mechanicAccountStatusSecondary, resolveMechanicAccountStatus(currentMechanicUser));
      renderMechanicInfoRequestNotes(currentMechanicUser);
      return currentMechanicUser;
    } catch {
      return null;
    }
  };

  void refreshMechanicProfileFromApi();

  mechanicBackBtn?.addEventListener("click", () => {
    window.location.href = "/auth/select-role";
  });

  mechanicLogoutBtn?.addEventListener("click", () => {
    clearStoredSessionData();
    window.location.replace("/");
  });

  const closeMechanicMobileMenu = () => {
    document.body.classList.remove("mechanic-mobile-menu-open");
    mechanicMobileMenu?.classList.remove("is-open");
    mechanicMobileMenuBackdrop?.classList.remove("is-open");
    mechanicMobileMenu?.setAttribute("aria-hidden", "true");
    mechanicHeaderMobileMenuToggle?.setAttribute("aria-expanded", "false");
  };

  const openMechanicMobileMenu = () => {
    document.body.classList.add("mechanic-mobile-menu-open");
    mechanicMobileMenu?.classList.add("is-open");
    mechanicMobileMenuBackdrop?.classList.add("is-open");
    mechanicMobileMenu?.setAttribute("aria-hidden", "false");
    mechanicHeaderMobileMenuToggle?.setAttribute("aria-expanded", "true");
  };

  const syncMechanicMobileNavState = (view) => {
    mechanicMobileMenuLinks.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  };

  const mechanicMobileSession = getStoredUserSession();
  if (mechanicMobileMenuName && mechanicMobileSession?.firstName) {
    mechanicMobileMenuName.textContent = mechanicMobileSession.firstName.toUpperCase();
  }

  const mechanicToken = getStoredAuthValue("userToken");
  let mechanicProfileMap = null;
  let latestMechanicProfile = null;
  let mechanicProfileReviewsPage = 1;
  const mechanicProfileReviewsPageSize = 1;
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
  const normalizeMechanicCertificationItems = (value) => {
    const source = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
    const seen = new Set();
    const items = [];
    source.forEach((entry) => {
      const item = String(entry || "").trim();
      if (!item) return;
      const key = item.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      items.push(item);
    });
    return items;
  };
  const setMechanicCertStatus = (message = "", tone = "") => {
    if (!mechanicCertStatus) return;
    const text = String(message || "").trim();
    mechanicCertStatus.textContent = text;
    mechanicCertStatus.classList.toggle("is-hidden", !text);
    mechanicCertStatus.classList.remove("is-success", "is-warning", "is-error");
    if (tone) mechanicCertStatus.classList.add(`is-${tone}`);
  };
  const renderMechanicCertChips = (container, items, emptyText, kind, showRemove = true) => {
    if (!container) return;
    const list = normalizeMechanicCertificationItems(items);
    container.innerHTML = "";
    if (!list.length) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "mechanic-cert-chip mechanic-cert-chip--empty";
      emptyItem.textContent = emptyText;
      container.appendChild(emptyItem);
      return;
    }
    list.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = showRemove ? "mechanic-cert-chip" : "mechanic-cert-chip mechanic-cert-chip--profile";
      const label = document.createElement("span");
      label.textContent = item;
      li.appendChild(label);
      if (showRemove) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "mechanic-cert-chip-remove";
        removeBtn.dataset.certKind = kind;
        removeBtn.dataset.certIndex = String(index);
        removeBtn.textContent = "Remove";
        li.appendChild(removeBtn);
      }
      container.appendChild(li);
    });
  };
  const renderMechanicCertificationState = () => {
    renderMechanicCertChips(
      mechanicCertQualificationsList,
      latestMechanicCertificationState.qualifications,
      "No qualifications added yet.",
      "qualifications"
    );
    renderMechanicCertChips(
      mechanicCertAccreditationsList,
      latestMechanicCertificationState.accreditations,
      "No accreditations added yet.",
      "accreditations"
    );
    renderMechanicCertChips(
      mechanicCertMembershipsList,
      latestMechanicCertificationState.memberships,
      "No memberships added yet.",
      "memberships"
    );
    renderMechanicCertChips(
      mechanicProfileQualifications,
      latestMechanicCertificationState.qualifications,
      "Qualifications not added yet",
      "qualifications-profile",
      false
    );
    renderMechanicCertChips(
      mechanicProfileAccreditations,
      latestMechanicCertificationState.accreditations,
      "No accreditations added yet",
      "accreditations-profile",
      false
    );
    renderMechanicCertChips(
      mechanicProfileMemberships,
      latestMechanicCertificationState.memberships,
      "No memberships added yet",
      "memberships-profile",
      false
    );
  };
  const setMechanicCertificationState = (next = {}) => {
    latestMechanicCertificationState = {
      qualifications: normalizeMechanicCertificationItems(next.qualifications),
      accreditations: normalizeMechanicCertificationItems(next.accreditations),
      memberships: normalizeMechanicCertificationItems(next.memberships)
    };
    renderMechanicCertificationState();
  };
  const getMechanicBookingStatusLabel = (entry) => {
    const status = String(entry?.booking?.status || "").toLowerCase();
    if (status === "accepted") return "Accepted";
    if (status === "in_progress") return "In progress";
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";
    return "Requested";
  };

  const getMechanicOfferStatusKey = (entry) => String(entry?.status || "").toLowerCase();

  const getMechanicOfferStatusLabel = (entry) => {
    const bookingStatus = String(entry?.booking?.status || "").toLowerCase();
    if (bookingStatus === "completed") return "Completed";
    const status = getMechanicOfferStatusKey(entry);
    if (status === "accepted") return "Accepted";
    if (status === "cancelled" || status === "canceled") return "Cancelled";
    if (status === "declined") return "Cancelled";
    if (status === "expired") return "Expired";
    return "Pending";
  };

  const getMechanicDetailStatusKey = (entry) => {
    const bookingStatus = String(entry?.booking?.status || "").toLowerCase();
    if (bookingStatus === "completed") return "completed";
    if (bookingStatus === "in_progress") return "in_progress";
    if (bookingStatus === "accepted") return "accepted";
    if (bookingStatus === "cancelled" || bookingStatus === "canceled") return "cancelled";
    const status = getMechanicOfferStatusKey(entry);
    if (status === "declined") return "declined";
    if (status === "expired") return "expired";
    return "pending";
  };

  const getMechanicTableStatusKey = (entry) => {
    const bookingStatus = String(entry?.booking?.status || "").toLowerCase();
    if (bookingStatus === "completed") return "completed";
    if (bookingStatus === "cancelled" || bookingStatus === "canceled") return "cancelled";
    const status = getMechanicOfferStatusKey(entry);
    if (status === "accepted") return "accepted";
    if (status === "declined") return "declined";
    if (status === "expired") return "expired";
    if (status === "cancelled" || status === "canceled") return "cancelled";
    return "pending";
  };

  const buildMechanicCompletionPartRows = (parts = [{}]) =>
    parts
      .map(
        (part, index) => `
          <div class="mechanic-completion-part-row">
            <input type="text" class="mechanic-completion-part-input" placeholder="Part description" data-mechanic-part-description value="${escapeHtml(part?.description || "")}">
            <input type="number" class="mechanic-completion-part-input mechanic-completion-part-input--amount" placeholder="Amount" min="0" step="0.01" data-mechanic-part-amount value="${escapeHtml(part?.amount_eur ?? "")}">
            <button type="button" class="secondary mechanic-completion-part-remove" data-mechanic-remove-part ${index === 0 ? "disabled" : ""}>Remove</button>
          </div>
        `
      )
      .join("");

  const mechanicSettingsFieldConfig = {
    full_name: {
      label: "Full name",
      description: "Update your first, middle and last name.",
      isNameField: true
    },
    phone: {
      label: "Phone",
      description: "Update your phone number.",
      type: "tel",
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
      isAddressField: true
    }
  };

  const mechanicCompletionPhotoPicker = document.createElement("input");
  mechanicCompletionPhotoPicker.type = "file";
  mechanicCompletionPhotoPicker.accept = "image/*";
  mechanicCompletionPhotoPicker.multiple = true;
  mechanicCompletionPhotoPicker.className = "mechanic-completion-global-picker";
  document.body.appendChild(mechanicCompletionPhotoPicker);

  const getMechanicUserProfile = () => {
    try {
      return JSON.parse(getStoredAuthValue("userProfile") || "{}");
    } catch {
      return {};
    }
  };

  const closeMechanicSettingsEditModal = () => {
    activeMechanicSettingsField = "";
    mechanicSettingsEditModal?.classList.add("is-hidden");
    if (mechanicSettingsEditMessage) mechanicSettingsEditMessage.textContent = "";
    if (mechanicSettingsEditInput) mechanicSettingsEditInput.value = "";
    if (mechanicSettingsEditFirstName) mechanicSettingsEditFirstName.value = "";
    if (mechanicSettingsEditMiddleName) mechanicSettingsEditMiddleName.value = "";
    if (mechanicSettingsEditLastName) mechanicSettingsEditLastName.value = "";
    if (mechanicSettingsEditAddressLine1) mechanicSettingsEditAddressLine1.value = "";
    if (mechanicSettingsEditAddressLine2) mechanicSettingsEditAddressLine2.value = "";
    if (mechanicSettingsEditCity) mechanicSettingsEditCity.value = "";
    if (mechanicSettingsEditPostcode) mechanicSettingsEditPostcode.value = "";
  };

  const openMechanicSettingsEditModal = (field) => {
    const config = mechanicSettingsFieldConfig[field];
    const profileData = getMechanicUserProfile();
    if (!config || !mechanicSettingsEditModal || !mechanicSettingsEditInput) return;
    activeMechanicSettingsField = field;
    if (mechanicSettingsEditTitle) mechanicSettingsEditTitle.textContent = `Update ${config.label}`;
    if (mechanicSettingsEditDescription) mechanicSettingsEditDescription.textContent = config.description;
    if (mechanicSettingsNameGrid) mechanicSettingsNameGrid.classList.toggle("is-hidden", !config.isNameField);
    if (mechanicSettingsAddressGrid) mechanicSettingsAddressGrid.classList.toggle("is-hidden", !config.isAddressField);
    if (mechanicSettingsEditInput.parentElement) {
      mechanicSettingsEditInput.parentElement.classList.toggle("is-hidden", !!config.isNameField || !!config.isAddressField);
    }
    if (config.isNameField) {
      if (mechanicSettingsEditFirstName) mechanicSettingsEditFirstName.value = profileData?.name || "";
      const lastNameParts = String(profileData?.lastname || "").trim().split(/\s+/).filter(Boolean);
      if (mechanicSettingsEditLastName) mechanicSettingsEditLastName.value = lastNameParts.pop() || "";
      if (mechanicSettingsEditMiddleName) mechanicSettingsEditMiddleName.value = lastNameParts.join(" ");
    } else if (config.isAddressField) {
      const addressDetails = profileData?.address_details || {};
      if (mechanicSettingsEditAddressLine1) mechanicSettingsEditAddressLine1.value = addressDetails.line1 || "";
      if (mechanicSettingsEditAddressLine2) mechanicSettingsEditAddressLine2.value = addressDetails.line2 || "";
      if (mechanicSettingsEditCity) mechanicSettingsEditCity.value = addressDetails.city || "";
      if (mechanicSettingsEditPostcode) mechanicSettingsEditPostcode.value = addressDetails.postal_code || "";
    } else {
      if (mechanicSettingsEditLabel) mechanicSettingsEditLabel.textContent = config.label;
      mechanicSettingsEditInput.type = config.type || "text";
      mechanicSettingsEditInput.value = config.getValue ? config.getValue(profileData) || "" : "";
    }
    if (mechanicSettingsEditMessage) mechanicSettingsEditMessage.textContent = "";
    mechanicSettingsEditModal.classList.remove("is-hidden");
    if (config.isNameField) {
      mechanicSettingsEditFirstName?.focus();
    } else if (config.isAddressField) {
      mechanicSettingsEditAddressLine1?.focus();
    } else {
      mechanicSettingsEditInput.focus();
      mechanicSettingsEditInput.select();
    }
  };

  const getFilteredMechanicOffers = (offers) => {
    const searchValue = String(mechanicBookingsSearch?.value || "").trim().toLowerCase();
    const statusValue = String(mechanicBookingsStatusFilter?.value || "all");
    const dateValue = String(mechanicBookingsDateFilter?.value || "all");
    return (Array.isArray(offers) ? offers : []).filter((entry) => {
      const reference = String(entry.booking?.reference || entry.booking?.id || "");
      const customer = String(entry.customer?.name || "");
      const vehicle = [entry.vehicle?.registrationNumber, entry.vehicle?.make, entry.vehicle?.model].filter(Boolean).join(" ");
      const haystack = `${reference} ${customer} ${vehicle}`.toLowerCase();
      const statusKey = getMechanicOfferStatusKey(entry);
      const statusLabel = getMechanicOfferStatusLabel(entry);
      const matchesSearch = !searchValue || haystack.includes(searchValue);
      const matchesStatus = statusValue === "all"
        ? true
        : statusLabel === statusValue || (
          statusValue === "Cancelled" && ["declined", "expired", "cancelled", "canceled"].includes(statusKey)
        );
      const matchesDate = dateValue === "all" ? true : matchesDateFilter(entry.sent_at || entry.booking?.created_at, dateValue);
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const getFilteredMechanicPayments = (bookings) => {
    const searchValue = String(mechanicPaymentsSearch?.value || "").trim().toLowerCase();
    const statusValue = String(mechanicPaymentsStatusFilter?.value || "all");
    const dateValue = String(mechanicPaymentsDateFilter?.value || "all");
    return (Array.isArray(bookings) ? bookings : [])
      .filter((entry) => entry?.payment)
      .filter((entry) => {
        const reference = String(entry.booking?.reference || entry.booking?.id || "");
        const customer = String(entry.customer?.name || "");
        const paymentMethod = String(getMechanicPaymentMethodLabel(entry));
        const paymentRef = String(getMechanicPaymentNumber(entry));
        const cardLast4 = String(getMechanicCardLast4(entry));
        const haystack = `${reference} ${customer} ${paymentMethod} ${paymentRef} ${cardLast4}`.toLowerCase();
        const paymentStatus = getMechanicPaymentStatusLabel(entry);
        const matchesSearch = !searchValue || haystack.includes(searchValue);
        const matchesStatus = statusValue === "all" ? true : paymentStatus === statusValue;
        const matchesDate = dateValue === "all" ? true : matchesDateFilter(entry.booking?.created_at, dateValue);
        return matchesSearch && matchesStatus && matchesDate;
      });
  };

  const renderMechanicOverview = () => {
    const bookings = Array.isArray(latestMechanicOffers) ? latestMechanicOffers : [];
    const cases = Array.isArray(latestMechanicResolutionCases) ? latestMechanicResolutionCases : [];
    const requestedCount = bookings.filter((entry) => getMechanicOfferStatusKey(entry) === "pending").length;
    const acceptedCount = bookings.filter((entry) => getMechanicOfferStatusKey(entry) === "accepted").length;

    if (mechanicDashboardAssignedCount) mechanicDashboardAssignedCount.textContent = String(bookings.length);
    if (mechanicDashboardRequestedCount) mechanicDashboardRequestedCount.textContent = String(requestedCount);
    if (mechanicDashboardAcceptedCount) mechanicDashboardAcceptedCount.textContent = String(acceptedCount);
    if (mechanicDashboardOpenCasesCount) mechanicDashboardOpenCasesCount.textContent = String(cases.length);
    if (!mechanicDashboardRecentBookings) return;

    if (!bookings.length) {
      mechanicDashboardRecentBookings.innerHTML = '<p class="mechanic-overview-empty">No matching bookings available.</p>';
      return;
    }

    mechanicDashboardRecentBookings.innerHTML = bookings
      .slice(0, 4)
      .map((entry) => {
        const reference = entry.booking?.reference || entry.booking?.id || "-";
        const vehicle = [entry.vehicle?.registrationNumber, entry.vehicle?.make, entry.vehicle?.model].filter(Boolean).join(" · ") || "-";
        const firstWorkType = (entry.items || []).map((item) => item?.name).find(Boolean) || "-";
        return `
          <article class="mechanic-overview-booking-card">
            <strong>${escapeHtml(String(reference))} · ${escapeHtml(entry.customer?.name || "Customer")}</strong>
            <p class="mechanic-overview-booking-meta">${escapeHtml(vehicle)}</p>
            <p class="mechanic-overview-booking-copy">${escapeHtml(getMechanicOfferStatusLabel(entry))} · ${escapeHtml(formatDate(entry.sent_at || entry.booking?.created_at))}</p>
            <p class="mechanic-overview-booking-copy">${escapeHtml(firstWorkType)}</p>
          </article>
        `;
      })
      .join("");
  };

    const buildMechanicBookingDetailCard = (entry) => {
    const itemsMarkup = (entry.items || [])
      .map(
        (item) => `
          <div class="mechanic-booking-item">
            <strong>${item.name}</strong>
            <span>${formatMechanicLabour(item.labour_minutes || item.base_labour_minutes)}</span>
          </div>
        `
      )
      .join("");
    const reference = entry.booking?.reference || entry.booking?.id || "-";
    const statusKey = getMechanicOfferStatusKey(entry);
    const bookingStatusKey = String(entry.booking?.status || "").toLowerCase();
    const topStatusKey = bookingStatusKey === "completed"
      ? "completed"
      : getMechanicDetailStatusKey(entry);
    const topStatus = topStatusKey === "completed"
      ? "Completed"
      : topStatusKey === "accepted"
        ? "Accepted"
        : topStatusKey === "in_progress"
          ? "In progress"
          : topStatusKey === "cancelled"
            ? "Cancelled"
            : topStatusKey === "declined"
              ? "Cancelled"
              : topStatusKey === "expired"
                ? "Expired"
                : "Requested";
    const isPending = statusKey === "pending";
    const canComplete = ["accepted", "in_progress"].includes(bookingStatusKey);
    const canCancel = bookingStatusKey === "accepted";
    const isCompleted = bookingStatusKey === "completed";
    const isCancelledState = ["cancelled", "canceled"].includes(statusKey);
      const isDeclinedState = statusKey === "declined";
      const isExpiredState = statusKey === "expired";
      const showCancelCard = canCancel && Number(activeMechanicCancelBookingId) === Number(entry.booking?.id) && !isCompleted;
      const showCompletionCard = canComplete && !isCompleted && Number(activeMechanicCompletionBookingId) === Number(entry.booking?.id);
      return `
      <article class="mechanic-booking-card">
        <div class="mechanic-booking-topbar">
          <span class="mechanic-booking-topbar-status" data-status="${escapeHtml(topStatusKey)}">${escapeHtml(topStatus)}</span>
          <span class="mechanic-booking-topbar-reference">Reference: ${escapeHtml(String(reference))}</span>
          <span class="mechanic-booking-topbar-date">Sent: ${escapeHtml(formatDate(entry.sent_at || entry.booking?.created_at))}</span>
        </div>
        <div class="mechanic-booking-card-head">
          <div class="mechanic-booking-meta">
            <h4>${escapeHtml(entry.customer?.name || "Customer")}</h4>
            <span>${escapeHtml(entry.customer?.email || "-")}</span>
          </div>
        </div>
        <div class="mechanic-booking-grid">
          <div><strong>Vehicle</strong><div>${escapeHtml([entry.vehicle?.registrationNumber, entry.vehicle?.make, entry.vehicle?.model].filter(Boolean).join(" · ") || "-")}</div></div>
          <div><strong>Total</strong><div>${escapeHtml(formatMechanicCurrency(entry.booking?.total_eur))}</div></div>
          <div><strong>Address</strong><div>${escapeHtml(formatMechanicAddress(entry.address) || "-")}</div></div>
          <div><strong>Work types</strong><div>${escapeHtml((entry.items || []).map((item) => item.name).join(", ") || "-")}</div></div>
        </div>
        <div class="mechanic-booking-items">${itemsMarkup || '<div class="mechanic-booking-item"><strong>No work items</strong></div>'}</div>
        <div class="mechanic-booking-decision-row">
            ${
              isPending
                ? `
                <button class="primary mechanic-offer-decision" type="button" data-offer-action="accept" data-offer-id="${escapeHtml(String(entry.offer_id || ""))}">Accept</button>
                <button class="secondary mechanic-offer-decision mechanic-offer-decision--danger" type="button" data-offer-action="decline" data-offer-id="${escapeHtml(String(entry.offer_id || ""))}">Reject</button>
                `
                  : canComplete
                    ? `
                    <button class="primary mechanic-offer-complete-toggle" type="button" data-mechanic-complete-toggle="${escapeHtml(String(entry.booking?.id || ""))}">Complete</button>
                    ${
                      canCancel
                        ? `<button class="secondary mechanic-offer-cancel-toggle" type="button" data-mechanic-cancel-toggle="${escapeHtml(String(entry.booking?.id || ""))}">Cancel</button>`
                        : ""
                    }
                  `
                : isCompleted
                  ? ""
                : isDeclinedState
                  ? `<button class="secondary mechanic-offer-decision mechanic-offer-decision--danger" type="button" disabled>Cancelled</button>`
                : isExpiredState
                  ? `<p class="mechanic-offer-state-copy">Expired.</p>`
                : isCancelledState
                ? `<button class="secondary mechanic-offer-decision mechanic-offer-decision--danger" type="button" disabled>Cancelled</button>`
                : `<p class="mechanic-offer-state-copy">This offer is ${escapeHtml(getMechanicOfferStatusLabel(entry).toLowerCase())}.</p>`
            }
          </div>
            ${
              showCompletionCard
                ? `
                <form class="mechanic-completion-card" data-mechanic-complete-form="${escapeHtml(String(entry.booking?.id || ""))}">
                  <div class="mechanic-completion-card-head">
                    <div>
                      <h4>Complete booking</h4>
                      <p>Upload work photos and list the parts used before finalizing the labour.</p>
                    </div>
                    <button class="secondary mechanic-completion-close" type="button" data-mechanic-complete-cancel>Close</button>
                  </div>
                  <div class="mechanic-completion-field mechanic-completion-field--photos">
                    <span>Work photos</span>
                    <div class="mechanic-completion-file-picker">
                      <button class="secondary mechanic-completion-file-trigger" type="button" data-mechanic-photo-trigger>Choose files</button>
                      <span class="mechanic-completion-file-summary" data-mechanic-photo-summary>No files selected</span>
                    </div>
                  </div>
                  <div class="mechanic-completion-photos-preview is-empty" data-mechanic-completion-photos-preview>
                    <p>No photos selected yet.</p>
                  </div>
                  <div class="mechanic-completion-field">
                    <div class="mechanic-completion-parts-head">
                      <span>Added parts</span>
                      <button class="secondary mechanic-completion-add-part" type="button" data-mechanic-add-part>Add part</button>
                    </div>
                    <div class="mechanic-completion-parts" data-mechanic-completion-parts>
                      ${buildMechanicCompletionPartRows(getMechanicCompletionParts(entry.booking?.id))}
                    </div>
                  </div>
                  <div class="mechanic-completion-actions">
                    <button class="primary" type="submit">Finalize labour</button>
                  </div>
                  </form>
                `
                : ""
            }
            ${
              showCancelCard
                ? `
                  <form class="mechanic-cancel-card" data-mechanic-cancel-form="${escapeHtml(String(entry.booking?.id || ""))}">
                    <div class="mechanic-completion-card-head">
                      <div>
                        <h4>Reason of cancellation</h4>
                        <p>Explain why you are cancelling this accepted booking.</p>
                      </div>
                      <button class="secondary mechanic-completion-close" type="button" data-mechanic-cancel-close>Close</button>
                    </div>
                    <div class="mechanic-completion-field">
                      <span>Cancellation reason</span>
                      <textarea class="mechanic-completion-textarea" data-mechanic-cancel-reason rows="4" placeholder="Add a reason for cancelling this booking" required>${escapeHtml(getMechanicCancellationReason(entry.booking?.id))}</textarea>
                    </div>
                    <div class="mechanic-completion-actions">
                      <button class="primary mechanic-cancel-submit" type="submit">Confirm cancellation</button>
                    </div>
                  </form>
                `
                : ""
            }
          </article>
        `;
    };

  const buildMechanicPaymentDetailCard = (entry) => {
    const reference = entry.booking?.reference || entry.booking?.id || "-";
    return `
      <article class="mechanic-booking-card">
        <div class="mechanic-booking-topbar">
          <span class="mechanic-booking-topbar-status" data-status="${escapeHtml(getMechanicPaymentStatusKey(entry))}">${escapeHtml(getMechanicPaymentStatusLabel(entry).toUpperCase())}</span>
          <span class="mechanic-booking-topbar-reference">Reference: ${escapeHtml(String(reference))}</span>
          <span class="mechanic-booking-topbar-date">Created: ${escapeHtml(formatDate(entry.booking?.created_at))}</span>
        </div>
        <div class="mechanic-booking-grid">
          <div><strong>Customer</strong><div>${escapeHtml(entry.customer?.name || "Customer")}</div></div>
          <div><strong>Total</strong><div>${escapeHtml(formatMechanicCurrency(entry.payment?.amount_eur ?? entry.booking?.total_eur))}</div></div>
          <div><strong>Payment method</strong><div>${escapeHtml(getMechanicPaymentMethodLabel(entry))}</div></div>
          <div><strong>Payment number</strong><div>${escapeHtml(getMechanicPaymentNumber(entry))}</div></div>
          <div><strong>Card last 4</strong><div>${escapeHtml(getMechanicCardLast4(entry))}</div></div>
          <div><strong>Address</strong><div>${escapeHtml(formatMechanicAddress(entry.address) || "-")}</div></div>
          <div><strong>Work types</strong><div>${escapeHtml((entry.items || []).map((item) => item.name).join(", ") || "-")}</div></div>
        </div>
      </article>
    `;
  };

  const renderMechanicPayments = (bookings) => {
    if (!mechanicPaymentsList) return;
    const paymentBookings = (Array.isArray(bookings) ? bookings : latestMechanicAssignedBookings)
      .map((entry) => normalizeMechanicPaymentEntry(entry))
      .filter(Boolean);
    const setEmptyState = (isEmpty) => {
      mechanicPaymentsLayout?.classList.toggle("is-empty-state", Boolean(isEmpty));
    };
    mechanicPaymentsList.innerHTML = "";
    if (mechanicPaymentDetail) mechanicPaymentDetail.innerHTML = "";

    if (!Array.isArray(paymentBookings) || !paymentBookings.length) {
      setEmptyState(true);
      const emptyRow = document.createElement("tr");
      emptyRow.className = "mechanic-booking-empty-row";
      emptyRow.innerHTML = '<td colspan="7" class="mechanic-bookings-empty">No completed payments yet.</td>';
      mechanicPaymentsList.appendChild(emptyRow);
      if (mechanicPaymentsFooterCount) mechanicPaymentsFooterCount.textContent = "0 payments";
      if (mechanicPaymentsPagination) mechanicPaymentsPagination.innerHTML = "";
      return;
    }

    setSimpleOptions(
      mechanicPaymentsStatusFilter,
      paymentBookings.map((entry) => getMechanicPaymentStatusLabel(entry)),
      "Status"
    );

    const filteredPayments = getFilteredMechanicPayments(paymentBookings);
    const pageSize = Number(mechanicPaymentsRowsPerPage?.value || 10);
    const total = filteredPayments.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    mechanicPaymentsPage = Math.min(mechanicPaymentsPage, totalPages);
    const startIndex = total ? (mechanicPaymentsPage - 1) * pageSize : 0;
    const pagePayments = filteredPayments.slice(startIndex, startIndex + pageSize);

    if (!pagePayments.length) {
      setEmptyState(true);
      const emptyRow = document.createElement("tr");
      emptyRow.className = "mechanic-booking-empty-row";
      emptyRow.innerHTML = '<td colspan="7" class="mechanic-bookings-empty">No payments match the selected filters.</td>';
      mechanicPaymentsList.appendChild(emptyRow);
      activeMechanicPaymentBookingId = null;
      if (mechanicPaymentDetail) mechanicPaymentDetail.innerHTML = "";
      if (mechanicPaymentsFooterCount) mechanicPaymentsFooterCount.textContent = `0-0 of ${total} rows`;
      if (mechanicPaymentsPagination) mechanicPaymentsPagination.innerHTML = "";
      return;
    }
    setEmptyState(false);

    const selectedBookingId = pagePayments.some((entry) => Number(entry.booking?.id) === Number(activeMechanicPaymentBookingId))
      ? activeMechanicPaymentBookingId
      : Number(pagePayments[0]?.booking?.id || 0) || null;
    activeMechanicPaymentBookingId = selectedBookingId;

    pagePayments.forEach((entry) => {
      const row = document.createElement("tr");
      row.className = `mechanic-booking-summary-row${Number(entry.booking?.id) === Number(selectedBookingId) ? " is-active" : ""}`;
      row.dataset.mechanicPaymentBookingId = String(entry.booking?.id || "");
      row.innerHTML = `
        <td><strong class="mechanic-booking-summary-reference">${escapeHtml(String(entry.booking?.reference || entry.booking?.id || "-"))}</strong></td>
        <td><span class="mechanic-booking-status mechanic-booking-status--${escapeHtml(getMechanicPaymentStatusKey(entry))}">${escapeHtml(getMechanicPaymentStatusLabel(entry).toUpperCase())}</span></td>
        <td><span class="mechanic-booking-summary-customer">${escapeHtml(entry.customer?.name || "Customer")}</span></td>
        <td><span class="mechanic-booking-summary-date">${escapeHtml(getMechanicPaymentMethodLabel(entry))}</span></td>
        <td><span class="mechanic-booking-summary-date">${escapeHtml(getMechanicPaymentNumber(entry))}</span></td>
        <td><span class="mechanic-booking-summary-date">${escapeHtml(formatMechanicCurrency(entry.payment?.amount_eur ?? entry.booking?.total_eur))}</span></td>
        <td><span class="mechanic-booking-summary-date">${escapeHtml(formatDate(entry.booking?.created_at))}</span></td>
      `;
      mechanicPaymentsList.appendChild(row);
    });

    const selectedPayment = filteredPayments.find((entry) => Number(entry.booking?.id) === Number(selectedBookingId)) || null;
    if (mechanicPaymentDetail) mechanicPaymentDetail.innerHTML = selectedPayment ? buildMechanicPaymentDetailCard(selectedPayment) : "";

    if (mechanicPaymentsFooterCount) {
      const from = startIndex + 1;
      const to = startIndex + pagePayments.length;
      mechanicPaymentsFooterCount.textContent = `${from}-${to} of ${total} rows`;
    }
    if (mechanicPaymentsPagination) {
      mechanicPaymentsPagination.innerHTML = "";
      for (let page = 1; page <= totalPages; page += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(page);
        button.dataset.mechanicPaymentsPage = String(page);
        button.classList.toggle("active", page === mechanicPaymentsPage);
        mechanicPaymentsPagination.appendChild(button);
      }
    }
  };

  const renderMechanicBookings = (offers) => {
    if (!mechanicBookingsList) return;
    const bookingList = Array.isArray(offers) ? offers : latestMechanicOffers;
    mechanicBookingsList.innerHTML = "";
    if (mechanicBookingDetail) mechanicBookingDetail.innerHTML = "";
    if (!Array.isArray(bookingList) || !bookingList.length) {
      const emptyRow = document.createElement("tr");
      emptyRow.className = "mechanic-booking-empty-row";
        emptyRow.innerHTML = '<td colspan="5" class="mechanic-bookings-empty">No matching bookings available.</td>';
      mechanicBookingsList.appendChild(emptyRow);
      if (mechanicBookingsFooterCount) mechanicBookingsFooterCount.textContent = "0 offers";
      if (mechanicBookingsPagination) mechanicBookingsPagination.innerHTML = "";
      return;
    }

    setSimpleOptions(
      mechanicBookingsStatusFilter,
      [...bookingList.map((entry) => getMechanicOfferStatusLabel(entry)), "Cancelled"],
      "Status"
    );

    const filteredBookings = getFilteredMechanicOffers(bookingList);
    const pageSize = Number(mechanicBookingsRowsPerPage?.value || 10);
    const total = filteredBookings.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    mechanicBookingsPage = Math.min(mechanicBookingsPage, totalPages);
    const startIndex = total ? (mechanicBookingsPage - 1) * pageSize : 0;
    const pageBookings = filteredBookings.slice(startIndex, startIndex + pageSize);

    if (!pageBookings.length) {
      const emptyRow = document.createElement("tr");
      emptyRow.className = "mechanic-booking-empty-row";
        emptyRow.innerHTML = `<td colspan="5" class="mechanic-bookings-empty">No matching bookings available.</td>`;
      mechanicBookingsList.appendChild(emptyRow);
      activeMechanicBookingOfferId = null;
      if (mechanicBookingDetail) mechanicBookingDetail.innerHTML = "";
      if (mechanicBookingsFooterCount) mechanicBookingsFooterCount.textContent = `0-0 of ${total} rows`;
      if (mechanicBookingsPagination) mechanicBookingsPagination.innerHTML = "";
      return;
    }

    const selectedId = pageBookings.some((entry) => Number(entry.offer_id) === Number(activeMechanicBookingOfferId))
      ? activeMechanicBookingOfferId
      : null;
    activeMechanicBookingOfferId = selectedId;

    pageBookings.forEach((entry) => {
      const reference = entry.booking?.reference || entry.booking?.id || "-";
      const canDecide = getMechanicOfferStatusKey(entry) === "pending";
      const tableStatusKey = getMechanicTableStatusKey(entry);
      const item = document.createElement("tr");
      item.className = `mechanic-booking-summary-row${selectedId !== null && Number(entry.offer_id) === Number(selectedId) ? " is-active" : ""}`;
      item.dataset.mechanicOfferId = String(entry.offer_id || "");
        item.innerHTML = `
          <td><strong class="mechanic-booking-summary-reference">${escapeHtml(String(reference))}</strong></td>
          <td><span class="mechanic-booking-status mechanic-booking-status--${escapeHtml(tableStatusKey)}">${escapeHtml(getMechanicOfferStatusLabel(entry))}</span></td>
          <td><span class="mechanic-booking-summary-customer">${escapeHtml(entry.customer?.name || "Customer")}</span></td>
          <td><span class="mechanic-booking-summary-vehicle">${escapeHtml([entry.vehicle?.registrationNumber, entry.vehicle?.make, entry.vehicle?.model].filter(Boolean).join(" · ") || "-")}</span></td>
          <td><span class="mechanic-booking-summary-date">${escapeHtml(formatDate(entry.sent_at || entry.booking?.created_at))}</span></td>
        `;
      mechanicBookingsList.appendChild(item);
    });

    const selectedBooking = selectedId === null
      ? null
      : filteredBookings.find((entry) => Number(entry.offer_id) === Number(selectedId)) || null;
    if (mechanicBookingDetail) {
      mechanicBookingDetail.innerHTML = selectedBooking ? buildMechanicBookingDetailCard(selectedBooking) : "";
      if (selectedBooking && Number(activeMechanicCompletionBookingId) === Number(selectedBooking.booking?.id)) {
        renderMechanicCompletionPhotoPreviewForBooking(selectedBooking.booking?.id);
      }
    }
    if (mechanicBookingsFooterCount) {
      const from = startIndex + 1;
      const to = startIndex + pageBookings.length;
      mechanicBookingsFooterCount.textContent = `${from}-${to} of ${total} rows`;
    }
    if (mechanicBookingsPagination) {
      mechanicBookingsPagination.innerHTML = "";
      for (let page = 1; page <= totalPages; page += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(page);
        button.dataset.mechanicBookingsPage = String(page);
        button.classList.toggle("active", page === mechanicBookingsPage);
        mechanicBookingsPagination.appendChild(button);
      }
    }
  };
    const respondToMechanicOffer = async (offerId, action, reason = "") => {
      if (!mechanicToken || !offerId) return;
      try {
        await apiAuth(`/api/users/me/mechanic-offers/${encodeURIComponent(offerId)}/respond`, mechanicToken, {
          method: "POST",
          body: JSON.stringify({ action, reason })
        });
        await Promise.all([syncMechanicBookings(), syncMechanicResolutionOverview()]);
      } catch (error) {
        window.alert(error?.message || "Unable to update this booking offer.");
      }
  };

  const syncMechanicBookings = async () => {
    if (!mechanicBookingsList) return;
    if (!mechanicToken) {
      latestMechanicOffers = [];
      setMechanicOffersStatus("No active mechanic session was found. Sign out and sign in again.");
      renderMechanicBookings([]);
      renderMechanicOverview();
      return;
    }
    try {
      const offers = await apiAuth("/api/users/me/mechanic-offers", mechanicToken);
      latestMechanicOffers = Array.isArray(offers) ? offers : [];
      setMechanicOffersStatus("");
      renderMechanicBookings(latestMechanicOffers);
      renderMechanicOverview();
    } catch (error) {
      console.error("Unable to load mechanic offers.", error);
      latestMechanicOffers = [];
      const message = error?.error?.message || error?.message || "Unable to load matching bookings.";
      setMechanicOffersStatus(message);
      renderMechanicBookings([]);
      renderMechanicOverview();
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
      setMechanicAccountStatus(mechanicAccountStatusSecondary, resolveMechanicAccountStatus(profileData));
      if (mechanicTaxVat) {
        mechanicTaxVat.value = profileData.vat_id || "";
      }
      if (profileData.vat_id) {
        setMechanicTaxStatus(
          profileData.vat_registered ? "VAT number verified." : "VAT number saved, not verified.",
          profileData.vat_registered ? "success" : "warning"
        );
      } else {
        setMechanicTaxStatus("", "");
      }
      if (mechanicProfileAvatar) {
        const profileAvatarUrl = getMechanicFallbackAvatarUrl(profileData);
        if (profileAvatarUrl) {
          mechanicProfileAvatar.innerHTML = `<img src="${profileAvatarUrl}" alt="Profile photo">`;
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
      setMechanicCertificationState({
        qualifications: profileData.qualifications,
        accreditations: profileData.accreditations,
        memberships: profileData.memberships
      });
      mechanicProfileReviewsPage = 1;
      renderMechanicProfileReviews(profileData.reviews || []);
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
    const headMarkup = target.querySelector(".mechanic-resolution-table-head")?.outerHTML || "";
    if (!Array.isArray(cases) || !cases.length) {
      target.innerHTML = `
        ${headMarkup}
        <p class="mechanic-bookings-empty">No cases created yet.</p>
      `;
      return;
    }
    const rowsMarkup = cases
      .map((entry) => `
        <div class="mechanic-resolution-table-row">
          <span class="mechanic-resolution-status">${String(entry.subject || entry.type || "General enquiry").toUpperCase()}</span>
          <span>${formatResolutionReference(entry.reference, entry.booking_id)}</span>
          <span>${formatMechanicDateTime(entry.updated_at)}</span>
          <span>${entry.subject || "-"}</span>
          <button class="mechanic-resolution-link" type="button" data-resolution-case-id="${entry.id}">View</button>
        </div>
      `)
      .join("");
    target.innerHTML = `
      ${headMarkup}
      ${rowsMarkup}
    `;
  };

  const getMechanicResolutionCaseType = (entry) => {
    const subject = String(entry?.subject || entry?.type || "").toLowerCase();
    if (subject.includes("complaint")) return "complaint";
    return "general";
  };

  const getFilteredMechanicResolutionCases = (cases) => {
    if (activeMechanicResolutionFilter === "all") return cases;
    return (Array.isArray(cases) ? cases : []).filter(
      (entry) => getMechanicResolutionCaseType(entry) === activeMechanicResolutionFilter
    );
  };

  const syncMechanicResolutionFilterTabs = () => {
    mechanicResolutionFilterTabs.forEach((tab) => {
      const filter = String(tab.dataset.mechanicResolutionFilter || "all");
      tab.classList.toggle("is-active", filter === activeMechanicResolutionFilter);
    });
  };

  const renderMechanicResolutionOverviewCases = () => {
    const filtered = getFilteredMechanicResolutionCases(latestMechanicResolutionCases);
    renderMechanicResolutionCaseRows(mechanicResolutionCasesTable, filtered);
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
      const [casesResult, bookingsResult] = await Promise.allSettled([
        apiAuth("/api/users/me/mechanic-resolution-cases", mechanicToken),
        apiAuth("/api/users/me/mechanic-bookings", mechanicToken)
      ]);
      latestMechanicResolutionCases = casesResult.status === "fulfilled"
        ? normalizeMechanicListPayload(casesResult.value)
        : [];
      latestMechanicAssignedBookings = bookingsResult.status === "fulfilled"
        ? normalizeMechanicListPayload(bookingsResult.value)
        : [];
      if (casesResult.status === "rejected") {
        console.error("Unable to load mechanic resolution cases", casesResult.reason);
      }
      if (bookingsResult.status === "rejected") {
        console.error("Unable to load mechanic bookings", bookingsResult.reason);
      }
      renderMechanicOverview();
      syncMechanicResolutionFilterTabs();
      renderMechanicResolutionOverviewCases();
      renderMechanicResolutionBookings(latestMechanicAssignedBookings);
      renderMechanicPayments(latestMechanicAssignedBookings);
    } catch {
      latestMechanicResolutionCases = [];
      latestMechanicAssignedBookings = [];
      renderMechanicOverview();
      renderMechanicResolutionOverviewCases();
      renderMechanicResolutionBookings([]);
      renderMechanicPayments([]);
    }
  };

  const completeMechanicBooking = async (bookingId, parts, files) => {
    if (!mechanicToken || !bookingId) return;
    const payload = new FormData();
    payload.append("parts_json", JSON.stringify(parts));
    Array.from(files || []).forEach((file) => payload.append("photos", file));
    try {
      await apiAuth(`/api/users/me/mechanic-bookings/${encodeURIComponent(bookingId)}/complete`, mechanicToken, {
        method: "POST",
        body: payload
      });
      clearMechanicCompletionFiles(bookingId);
      clearMechanicCompletionParts(bookingId);
      activeMechanicCompletionBookingId = null;
      await Promise.all([syncMechanicBookings(), syncMechanicResolutionOverview()]);
    } catch (error) {
      window.alert(error?.error?.message || error?.message || "Unable to complete this booking.");
    }
  };

  const renderMechanicCompletionPhotoPreview = (form, files) => {
    const preview = form?.querySelector("[data-mechanic-completion-photos-preview]");
    const summary = form?.querySelector("[data-mechanic-photo-summary]");
    if (!preview) return;
    if (!files.length) {
      if (summary) summary.textContent = "No files selected";
      preview.classList.add("is-empty");
      preview.innerHTML = "<p>No photos selected yet.</p>";
      return;
    }

    if (summary) summary.textContent = `${files.length} file${files.length === 1 ? "" : "s"} selected`;
    preview.classList.remove("is-empty");
    const thumbs = files
      .map((file) => {
        const previewUrl = URL.createObjectURL(file);
        return `
          <figure class="mechanic-completion-photo-thumb">
            <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(file.name || "Work photo")}">
            <figcaption>${escapeHtml(file.name || "Photo")}</figcaption>
          </figure>
        `;
      })
      .join("");
    preview.innerHTML = `
      <p class="mechanic-completion-photos-summary">${files.length} photo${files.length === 1 ? "" : "s"} selected</p>
      <div class="mechanic-completion-photos-grid">${thumbs}</div>
    `;
  };

  const renderMechanicCompletionPhotoPreviewForBooking = (bookingId) => {
    const form = mechanicBookingDetail?.querySelector(`[data-mechanic-complete-form="${String(bookingId)}"]`);
    renderMechanicCompletionPhotoPreview(form, getMechanicCompletionFiles(bookingId));
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
    if (mechanicResolutionSidebarArrivalTime) {
      mechanicResolutionSidebarArrivalTime.textContent = detail?.booking?.arrival_time
        ? formatMechanicDateTime(detail.booking.arrival_time)
        : (detail?.booking?.assigned_at ? `Assigned on ${formatMechanicDateTime(detail.booking.assigned_at)}` : "-");
    }
    if (mechanicResolutionSidebarParts) {
      const invoiceParts = Array.isArray(detail?.invoice?.totals?.completion?.added_parts)
        ? detail.invoice.totals.completion.added_parts
        : Array.isArray(detail?.completion?.added_parts)
          ? detail.completion.added_parts
          : [];
      const bookingParts = invoiceParts.map((part) => part?.description || part?.name).filter(Boolean);
      mechanicResolutionSidebarParts.textContent = bookingParts.length ? bookingParts.join(", ") : "-";
    }
    if (mechanicResolutionSidebarTotal) {
      mechanicResolutionSidebarTotal.textContent = formatMechanicCurrency(detail?.booking?.total_eur);
    }
    if (mechanicResolutionMessages) {
      mechanicResolutionMessages.innerHTML = "";
      const messages = Array.isArray(detail?.messages) ? detail.messages : [];
      const customerAvatarUrl = String(detail?.customer?.avatar_url || "").trim();
      if (!messages.length) {
        mechanicResolutionMessages.innerHTML = '<p class="mechanic-bookings-empty">No messages yet.</p>';
      } else {
        messages.forEach((message) => {
          const senderName = String(message.sender_name || "User");
          const initials = senderName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("") || "U";
          const avatarUrl = String(message.avatar_url || "").trim();
          const resolvedAvatarUrl = avatarUrl || (message.sender_role === "customer" ? customerAvatarUrl : "");
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
                    const resolvedUrl = fileUrl.startsWith("/uploads") ? fileUrl : fileUrl;
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
          item.className = `mechanic-resolution-message ${message.sender_role === "mechanic" ? "is-mechanic" : "is-customer"}`;
          item.innerHTML = `
            <div class="mechanic-resolution-message-row">
              <div class="mechanic-resolution-message-avatar" aria-hidden="true">${avatarMarkup}</div>
              <div class="mechanic-resolution-message-content">
                ${bodyText ? `<div class="mechanic-resolution-bubble"><p>${bodyText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p></div>` : ""}
                ${attachmentsMarkup}
                <span class="mechanic-resolution-message-meta">${senderName}, ${formatMechanicDateTime(message.created_at)}</span>
              </div>
            </div>
          `;
          mechanicResolutionMessages.appendChild(item);
        });
      }
    }
    renderMechanicResolutionCaseAttachmentPreview();
  };

  const renderMechanicResolutionCaseAttachmentPreview = () => {
    if (!mechanicResolutionCaseAttachmentPreview) return;
    const files = pendingMechanicResolutionCaseAttachments.get(pendingResolutionCaseId) || [];
    mechanicResolutionCaseAttachmentPreview.innerHTML = "";
    mechanicResolutionCaseAttachmentPreview.classList.toggle("is-hidden", !files.length);
    if (!files.length) {
      mechanicResolutionCaseAttachmentPreview.innerHTML = '<span class="mechanic-resolution-compose-empty">No files selected yet.</span>';
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
      mechanicResolutionCaseAttachmentPreview.appendChild(item);
    });
  };

  const clearMechanicResolutionCaseAttachments = (caseId = pendingResolutionCaseId) => {
    if (caseId) {
      pendingMechanicResolutionCaseAttachments.set(Number(caseId), []);
    }
    if (mechanicResolutionCaseAttachmentInput) mechanicResolutionCaseAttachmentInput.value = "";
    renderMechanicResolutionCaseAttachmentPreview();
  };

  mechanicBookingsList?.addEventListener("click", async (event) => {
    const offerAction = event.target.closest(".mechanic-offer-table-action[data-offer-id][data-offer-action]");
    if (offerAction) {
      event.stopPropagation();
      await respondToMechanicOffer(Number(offerAction.dataset.offerId), offerAction.dataset.offerAction);
      return;
    }
    const summaryRow = event.target.closest("[data-mechanic-offer-id]");
    if (summaryRow) {
      activeMechanicBookingOfferId = Number(summaryRow.dataset.mechanicOfferId);
      renderMechanicBookings(latestMechanicOffers);
      return;
    }
  });

    mechanicBookingDetail?.addEventListener("click", async (event) => {
      const cancelToggle = event.target.closest("[data-mechanic-cancel-toggle]");
      if (cancelToggle) {
        const bookingId = Number(cancelToggle.dataset.mechanicCancelToggle);
        activeMechanicCancelBookingId = Number(activeMechanicCancelBookingId) === Number(bookingId) ? null : bookingId;
        if (Number(activeMechanicCancelBookingId) === Number(bookingId)) {
          activeMechanicCompletionBookingId = null;
        }
        renderMechanicBookings(latestMechanicOffers);
        return;
      }

      const photoTrigger = event.target.closest("[data-mechanic-photo-trigger]");
      if (photoTrigger) {
        const form = photoTrigger.closest("[data-mechanic-complete-form]");
        const bookingId = Number(form?.dataset.mechanicCompleteForm || 0);
        pendingMechanicPhotoBookingId = bookingId;
      setMechanicCompletionParts(bookingId, readMechanicCompletionPartsFromForm(form));
      mechanicCompletionPhotoPicker.value = "";
      mechanicCompletionPhotoPicker.click();
      return;
    }

      const completionToggle = event.target.closest("[data-mechanic-complete-toggle]");
      if (completionToggle) {
        const bookingId = Number(completionToggle.dataset.mechanicCompleteToggle);
        if (Number(activeMechanicCompletionBookingId) !== Number(bookingId) && !pendingMechanicCompletionParts.has(Number(bookingId))) {
          setMechanicCompletionParts(bookingId, [{}]);
        }
        activeMechanicCompletionBookingId =
          Number(activeMechanicCompletionBookingId) === Number(bookingId) ? null : bookingId;
        if (Number(activeMechanicCompletionBookingId) === Number(bookingId)) {
          activeMechanicCancelBookingId = null;
        }
        renderMechanicBookings(latestMechanicOffers);
        return;
      }

    const addPartButton = event.target.closest("[data-mechanic-add-part]");
    if (addPartButton) {
      const form = addPartButton.closest("[data-mechanic-complete-form]");
      const bookingId = Number(form?.dataset.mechanicCompleteForm || 0);
      const nextParts = [...readMechanicCompletionPartsFromForm(form), {}];
      setMechanicCompletionParts(bookingId, nextParts);
      renderMechanicBookings(latestMechanicOffers);
      return;
    }

    const removePartButton = event.target.closest("[data-mechanic-remove-part]");
    if (removePartButton) {
      const form = removePartButton.closest("[data-mechanic-complete-form]");
      const bookingId = Number(form?.dataset.mechanicCompleteForm || 0);
      const rows = Array.from(form?.querySelectorAll(".mechanic-completion-part-row") || []);
      const rowIndex = rows.findIndex((row) => row.contains(removePartButton));
      const nextParts = readMechanicCompletionPartsFromForm(form).filter((_, index) => index !== rowIndex);
      setMechanicCompletionParts(bookingId, nextParts.length ? nextParts : [{}]);
      renderMechanicBookings(latestMechanicOffers);
      return;
    }

      const completeCancel = event.target.closest("[data-mechanic-complete-cancel]");
      if (completeCancel) {
        const bookingId = Number(completeCancel.closest("[data-mechanic-complete-form]")?.dataset.mechanicCompleteForm || 0);
        clearMechanicCompletionFiles(bookingId);
        clearMechanicCompletionParts(bookingId);
        activeMechanicCompletionBookingId = null;
        renderMechanicBookings(latestMechanicOffers);
        return;
      }

      const cancelClose = event.target.closest("[data-mechanic-cancel-close]");
      if (cancelClose) {
        const form = cancelClose.closest("[data-mechanic-cancel-form]");
        const bookingId = Number(form?.dataset.mechanicCancelForm || 0);
        clearMechanicCancellationReason(bookingId);
        activeMechanicCancelBookingId = null;
        renderMechanicBookings(latestMechanicOffers);
        return;
      }

      const offerAction = event.target.closest(".mechanic-offer-decision[data-offer-id][data-offer-action]");
      if (offerAction) {
        await respondToMechanicOffer(Number(offerAction.dataset.offerId), offerAction.dataset.offerAction);
      }
    });

  mechanicCompletionPhotoPicker.addEventListener("change", () => {
    const bookingId = Number(pendingMechanicPhotoBookingId || 0);
    if (!bookingId) return;
    const files = Array.from(mechanicCompletionPhotoPicker.files || []).filter((file) => String(file?.type || "").startsWith("image/"));
    appendMechanicCompletionFiles(bookingId, files);
    mechanicCompletionPhotoPicker.value = "";
    renderMechanicCompletionPhotoPreviewForBooking(bookingId);
  });

  mechanicBookingDetail?.addEventListener("change", (event) => {
    const partInput = event.target.closest("[data-mechanic-part-description], [data-mechanic-part-amount]");
    if (!partInput) return;
    const form = partInput.closest("[data-mechanic-complete-form]");
    const bookingId = Number(form?.dataset.mechanicCompleteForm || 0);
    setMechanicCompletionParts(bookingId, readMechanicCompletionPartsFromForm(form));
  });

    mechanicBookingDetail?.addEventListener("input", (event) => {
      const partInput = event.target.closest("[data-mechanic-part-description], [data-mechanic-part-amount]");
      if (!partInput) return;
      const form = partInput.closest("[data-mechanic-complete-form]");
      const bookingId = Number(form?.dataset.mechanicCompleteForm || 0);
      setMechanicCompletionParts(bookingId, readMechanicCompletionPartsFromForm(form));
    });

    mechanicBookingDetail?.addEventListener("input", (event) => {
      const cancelReason = event.target.closest("[data-mechanic-cancel-reason]");
      if (!cancelReason) return;
      const form = cancelReason.closest("[data-mechanic-cancel-form]");
      const bookingId = Number(form?.dataset.mechanicCancelForm || 0);
      setMechanicCancellationReason(bookingId, cancelReason.value);
    });

    mechanicBookingDetail?.addEventListener("submit", async (event) => {
      const form = event.target.closest("[data-mechanic-complete-form]");
      if (!form) return;
      event.preventDefault();
    const bookingId = Number(form.dataset.mechanicCompleteForm);
    const parts = Array.from(form.querySelectorAll(".mechanic-completion-part-row"))
      .map((row) => {
        const description = row.querySelector("[data-mechanic-part-description]")?.value?.trim() || "";
        const amount = Number(row.querySelector("[data-mechanic-part-amount]")?.value || 0);
        if (!description) return null;
        return {
          description,
          amount_eur: Number.isFinite(amount) ? amount : 0
        };
      })
      .filter(Boolean);
      const files = getMechanicCompletionFiles(bookingId);
      await completeMechanicBooking(bookingId, parts, files);
    });

    mechanicBookingDetail?.addEventListener("submit", async (event) => {
      const form = event.target.closest("[data-mechanic-cancel-form]");
      if (!form) return;
      event.preventDefault();
      const bookingId = Number(form.dataset.mechanicCancelForm);
      const selectedBooking = latestMechanicOffers.find((entry) => Number(entry.booking?.id) === Number(bookingId));
      const reason = form.querySelector("[data-mechanic-cancel-reason]")?.value?.trim() || "";
      if (!reason) {
        window.alert("Please add a reason for cancelling this booking.");
        return;
      }
      if (selectedBooking) {
        await respondToMechanicOffer(Number(selectedBooking.offer_id || 0), "cancel", reason);
      }
      clearMechanicCancellationReason(bookingId);
      activeMechanicCancelBookingId = null;
    });

  mechanicBookingsSearch?.addEventListener("input", () => {
    mechanicBookingsPage = 1;
    renderMechanicBookings(latestMechanicOffers);
  });

  mechanicBookingsStatusFilter?.addEventListener("change", () => {
    mechanicBookingsPage = 1;
    renderMechanicBookings(latestMechanicOffers);
  });

  mechanicBookingsDateFilter?.addEventListener("change", () => {
    mechanicBookingsPage = 1;
    renderMechanicBookings(latestMechanicOffers);
  });

  mechanicBookingsRowsPerPage?.addEventListener("change", () => {
    mechanicBookingsPage = 1;
    renderMechanicBookings(latestMechanicOffers);
  });

  mechanicBookingsPagination?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mechanic-bookings-page]");
    if (!button) return;
    mechanicBookingsPage = Number(button.dataset.mechanicBookingsPage || 1);
    renderMechanicBookings(latestMechanicOffers);
  });

  mechanicBookingsExport?.addEventListener("click", () => {
    const rows = getFilteredMechanicOffers(latestMechanicOffers).map((entry) => ({
      Reference: entry.booking?.reference || entry.booking?.id || "-",
      OfferStatus: getMechanicOfferStatusLabel(entry),
      Customer: entry.customer?.name || "Customer",
      Vehicle: [entry.vehicle?.registrationNumber, entry.vehicle?.make, entry.vehicle?.model].filter(Boolean).join(" · "),
      Sent: formatDate(entry.sent_at || entry.booking?.created_at)
    }));
    downloadCsv("mechanic-booking-offers.csv", rows);
  });

  mechanicPaymentsList?.addEventListener("click", (event) => {
    const summaryRow = event.target.closest("[data-mechanic-payment-booking-id]");
    if (!summaryRow) return;
    activeMechanicPaymentBookingId = Number(summaryRow.dataset.mechanicPaymentBookingId);
    renderMechanicPayments(latestMechanicAssignedBookings);
  });

  mechanicPaymentsSearch?.addEventListener("input", () => {
    mechanicPaymentsPage = 1;
    renderMechanicPayments(latestMechanicAssignedBookings);
  });

  mechanicPaymentsStatusFilter?.addEventListener("change", () => {
    mechanicPaymentsPage = 1;
    renderMechanicPayments(latestMechanicAssignedBookings);
  });

  mechanicPaymentsDateFilter?.addEventListener("change", () => {
    mechanicPaymentsPage = 1;
    renderMechanicPayments(latestMechanicAssignedBookings);
  });

  mechanicPaymentsRowsPerPage?.addEventListener("change", () => {
    mechanicPaymentsPage = 1;
    renderMechanicPayments(latestMechanicAssignedBookings);
  });

  mechanicPaymentsPagination?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mechanic-payments-page]");
    if (!button) return;
    mechanicPaymentsPage = Number(button.dataset.mechanicPaymentsPage || 1);
    renderMechanicPayments(latestMechanicAssignedBookings);
  });

  mechanicPaymentsExport?.addEventListener("click", () => {
    const rows = getFilteredMechanicPayments(latestMechanicAssignedBookings).map((entry) => ({
      Reference: entry.booking?.reference || entry.booking?.id || "-",
      PaymentStatus: getMechanicPaymentStatusLabel(entry),
      Customer: entry.customer?.name || "Customer",
      PaymentMethod: getMechanicPaymentMethodLabel(entry),
      PaymentNumber: getMechanicPaymentNumber(entry),
      Total: formatMechanicCurrency(entry.payment?.amount_eur ?? entry.booking?.total_eur),
      Created: formatDate(entry.booking?.created_at),
    }));
    downloadCsv("mechanic-payments.csv", rows);
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

  const setMechanicCertificationsDraft = (next = {}) => {
    latestMechanicCertificationState = {
      qualifications: normalizeMechanicCertificationItems(next.qualifications),
      accreditations: normalizeMechanicCertificationItems(next.accreditations),
      memberships: normalizeMechanicCertificationItems(next.memberships)
    };
    renderMechanicCertificationState();
  };

  const addMechanicCertificationValue = (kind, rawValue) => {
    const value = String(rawValue || "").trim();
    if (!value) return;
    const next = { ...latestMechanicCertificationState };
    const items = normalizeMechanicCertificationItems(next[kind]);
    const exists = items.some((item) => item.toLowerCase() === value.toLowerCase());
    if (exists) {
      setMechanicCertStatus("That item is already added.", "warning");
      return;
    }
    items.push(value);
    next[kind] = items;
    setMechanicCertificationsDraft(next);
    setMechanicCertStatus("Unsaved changes.", "warning");
  };

  const removeMechanicCertificationValue = (kind, index) => {
    const items = normalizeMechanicCertificationItems(latestMechanicCertificationState[kind]);
    if (!Number.isInteger(index) || index < 0 || index >= items.length) return;
    items.splice(index, 1);
    const next = { ...latestMechanicCertificationState, [kind]: items };
    setMechanicCertificationsDraft(next);
    setMechanicCertStatus("Unsaved changes.", "warning");
  };

  const bindMechanicCertListRemoval = (container) => {
    container?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cert-kind][data-cert-index]");
      if (!button) return;
      const kind = button.dataset.certKind;
      const index = Number(button.dataset.certIndex);
      removeMechanicCertificationValue(kind, index);
    });
  };

  bindMechanicCertListRemoval(mechanicCertQualificationsList);
  bindMechanicCertListRemoval(mechanicCertAccreditationsList);
  bindMechanicCertListRemoval(mechanicCertMembershipsList);

  mechanicCertificationQualificationAdd?.addEventListener("click", () => {
    addMechanicCertificationValue("qualifications", mechanicCertificationQualification?.value);
  });
  mechanicCertificationAccreditationAdd?.addEventListener("click", () => {
    addMechanicCertificationValue("accreditations", mechanicCertificationAccreditation?.value);
    if (mechanicCertificationAccreditation) mechanicCertificationAccreditation.value = "";
  });
  mechanicCertificationMembershipAdd?.addEventListener("click", () => {
    addMechanicCertificationValue("memberships", mechanicCertificationMembership?.value);
    if (mechanicCertificationMembership) mechanicCertificationMembership.value = "";
  });

  mechanicCertSaveBtn?.addEventListener("click", async () => {
    if (!mechanicToken) return;
    if (mechanicCertStatus) mechanicCertStatus.textContent = "";
    try {
      mechanicCertSaveBtn.disabled = true;
      const profileData = await apiAuth("/api/users/me/mechanic-certifications", mechanicToken, {
        method: "PATCH",
        body: JSON.stringify(latestMechanicCertificationState)
      });
      if (profileData) {
        latestMechanicProfile = profileData;
        setStoredAuthValue("userProfile", JSON.stringify(profileData));
        setMechanicCertificationsDraft({
          qualifications: profileData.qualifications,
          accreditations: profileData.accreditations,
          memberships: profileData.memberships
        });
        if (mechanicProfileHeading) {
          mechanicProfileHeading.textContent = `${profileData.name || "Mechanic"}, ${profileData.location || "Surrey"}`;
        }
      }
      setMechanicCertStatus("Certifications updated.", "success");
    } catch (err) {
      setMechanicCertStatus(err?.error?.message || err?.message || "Unable to save certifications.", "error");
    } finally {
      mechanicCertSaveBtn.disabled = false;
    }
  });

  const setMechanicSettingsSubview = (subview) => {
    mechanicSettingsGeneral?.classList.toggle("is-hidden", subview !== "general");
    mechanicSettingsNotifications?.classList.toggle("is-hidden", subview !== "notifications");
    mechanicSettingsSecurity?.classList.toggle("is-hidden", subview !== "security");
    mechanicSettingsSubnavLinks.forEach((btn) => btn.classList.toggle("active", btn.dataset.mechanicSettingsSubview === subview));
    if (subview !== "security") {
      if (mechanicSecurityUsername) mechanicSecurityUsername.value = "";
      if (mechanicSecurityOldPassword) mechanicSecurityOldPassword.value = "";
      if (mechanicSecurityNewPassword) mechanicSecurityNewPassword.value = "";
      if (mechanicSecurityConfirmPassword) mechanicSecurityConfirmPassword.value = "";
      if (mechanicSecurityPasswordMessage) mechanicSecurityPasswordMessage.textContent = "";
    }
    if (mechanicSettingsPanelTitle) {
      mechanicSettingsPanelTitle.textContent =
        subview === "notifications" ? "Notifications" : subview === "security" ? "Login & security" : "General";
    }
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

  mechanicSettingsPhotoButton?.addEventListener("click", () => {
    mechanicSettingsPhotoInput?.click();
  });

  mechanicSettingsPhotoInput?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file || !mechanicToken) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${mechanicToken}` },
        body: formData
      });
      const payload = await response.json();
      if (!response.ok) throw payload;
      setStoredAuthValue("userProfile", JSON.stringify(payload));
      setAvatar(mechanicDashboardHeroAvatar, getInitials([payload?.name, payload?.lastname].filter(Boolean).join(" ") || payload?.email || "Mechanic"), payload?.avatar_url);
      setAvatar(mechanicAccountAvatar, getInitials([payload?.name, payload?.lastname].filter(Boolean).join(" ") || payload?.email || "Mechanic"), payload?.avatar_url);
      setAvatar(mechanicAccountAvatarSecondary, getInitials([payload?.name, payload?.lastname].filter(Boolean).join(" ") || payload?.email || "Mechanic"), payload?.avatar_url);
      setAvatar(mechanicSettingsAvatarSettings, getInitials([payload?.name, payload?.lastname].filter(Boolean).join(" ") || payload?.email || "Mechanic"), payload?.avatar_url);
      setAvatar(mechanicProfileAvatar, getInitials([payload?.name, payload?.lastname].filter(Boolean).join(" ") || payload?.email || "Mechanic"), payload?.avatar_url);
    } catch (err) {
      window.alert(err?.error?.message || err?.message || "Unable to upload this image.");
    } finally {
      event.target.value = "";
    }
  });

  mechanicSettingsEditButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openMechanicSettingsEditModal(button.dataset.mechanicSettingsField || "");
    });
  });

  mechanicSettingsEditCancel?.addEventListener("click", closeMechanicSettingsEditModal);
  mechanicSettingsEditClose?.addEventListener("click", closeMechanicSettingsEditModal);
  mechanicSettingsEditModal?.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeMechanicSettingsEditModal);
  });

  mechanicSettingsEditSave?.addEventListener("click", async () => {
    const field = activeMechanicSettingsField;
    const config = mechanicSettingsFieldConfig[field];
    if (!mechanicToken || !config) return;
    if (mechanicSettingsEditMessage) mechanicSettingsEditMessage.textContent = "";

    try {
      if (config.isNameField) {
        const firstName = mechanicSettingsEditFirstName?.value?.trim() || "";
        const middleName = mechanicSettingsEditMiddleName?.value?.trim() || "";
        const lastName = mechanicSettingsEditLastName?.value?.trim() || "";
        if (!firstName || !lastName) {
          throw { message: "First name and last name are required." };
        }
        const payload = await apiAuth("/api/users/me", mechanicToken, {
          method: "PATCH",
          body: JSON.stringify({
            name: firstName,
            lastname: [middleName, lastName].filter(Boolean).join(" ")
          })
        });
        setStoredAuthValue("userProfile", JSON.stringify(payload));
        closeMechanicSettingsEditModal();
        window.location.reload();
        return;
      }

      if (config.isAddressField) {
        const line1 = mechanicSettingsEditAddressLine1?.value?.trim() || "";
        const line2 = mechanicSettingsEditAddressLine2?.value?.trim() || "";
        const city = mechanicSettingsEditCity?.value?.trim() || "";
        const postal_code = mechanicSettingsEditPostcode?.value?.trim() || "";
        if (!line1 || !city || !postal_code) {
          throw { message: "Address line 1, City and Postcode are required." };
        }
        const payload = await apiAuth("/api/users/me", mechanicToken, {
          method: "PATCH",
          body: JSON.stringify({
            address: { line1, line2, city, postal_code }
          })
        });
        setStoredAuthValue("userProfile", JSON.stringify(payload));
        closeMechanicSettingsEditModal();
        window.location.reload();
        return;
      }

      const value = mechanicSettingsEditInput?.value?.trim() || "";
      if (!value) {
        throw { message: `${config.label} is required.` };
      }

      if (field === "email") {
        const payload = await apiAuth("/api/users/me/email-change", mechanicToken, {
          method: "POST",
          body: JSON.stringify({ email: value })
        });
        if (mechanicSettingsEditMessage) {
          mechanicSettingsEditMessage.textContent = payload?.message || "Confirmation email sent.";
        }
        return;
      }

      const payload = await apiAuth("/api/users/me", mechanicToken, {
        method: "PATCH",
        body: JSON.stringify({ [field]: value })
      });
      setStoredAuthValue("userProfile", JSON.stringify(payload));
      closeMechanicSettingsEditModal();
      window.location.reload();
    } catch (err) {
      if (mechanicSettingsEditMessage) {
        mechanicSettingsEditMessage.textContent = err?.error?.message || err?.message || "Unable to update this field.";
      }
    }
  });

  mechanicSecurity2faEnable?.addEventListener("click", async () => {
    const token = getStoredAuthValue("userToken");
    if (!token) return;
    if (mechanicSecurity2faMessage) mechanicSecurity2faMessage.textContent = "";
    try {
      const result = await apiAuth("/api/users/me/security/two-factor", token, {
        method: "PATCH",
        body: JSON.stringify({
          two_factor_email_enabled: Boolean(mechanicSecurity2faEmail?.checked)
        })
      });
      if (result) {
        setStoredAuthValue("userProfile", JSON.stringify(result));
      }
      syncMechanicSecurity2faButton();
      if (mechanicSecurity2faMessage) {
        mechanicSecurity2faMessage.textContent = mechanicSecurity2faEmail?.checked
          ? "Email 2FA enabled."
          : "Email 2FA disabled.";
      }
    } catch (err) {
      console.error("Unable to update mechanic two factor settings", err);
      if (mechanicSecurity2faMessage) {
        mechanicSecurity2faMessage.textContent = err?.error?.message || err?.message || "Unable to update two factor settings.";
      }
    }
  });

  mechanicSecurity2faEmail?.addEventListener("change", syncMechanicSecurity2faButton);
  mechanicSecurity2faSms?.addEventListener("change", syncMechanicSecurity2faButton);

  mechanicTaxSaveBtn?.addEventListener("click", async () => {
    if (!mechanicToken) return;
    const vat_id = mechanicTaxVat?.value?.trim() || "";
    setMechanicTaxStatus(vat_id ? "Verifying VAT number..." : "Clearing VAT number...", "warning");

    try {
      const payload = await apiAuth("/api/users/me/mechanic-tax", mechanicToken, {
        method: "PATCH",
        body: JSON.stringify({ vat_id })
      });
      if (payload) {
        latestMechanicProfile = payload;
        setStoredAuthValue("userProfile", JSON.stringify(payload));
      }
      if (mechanicTaxVat) {
        mechanicTaxVat.value = payload?.vat_id || "";
      }
      if (!payload?.vat_id) {
        setMechanicTaxStatus("VAT number cleared.", "success");
        return;
      }
      setMechanicTaxStatus(payload?.vat_registered ? "VAT number verified." : "VAT number saved.", payload?.vat_registered ? "success" : "warning");
    } catch (err) {
      setMechanicTaxStatus(err?.error?.message || err?.message || "Unable to verify VAT number.", "error");
    }
  });

  mechanicResolutionBackBtn?.addEventListener("click", () => {
    setMechanicResolutionSubview("overview");
  });

  mechanicResolutionFilterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeMechanicResolutionFilter = String(tab.dataset.mechanicResolutionFilter || "all");
      syncMechanicResolutionFilterTabs();
      renderMechanicResolutionOverviewCases();
    });
  });
  mechanicProfileReviewsPagination?.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-mechanic-profile-reviews-page]");
    if (!dot) return;
    const nextPage = Number(dot.dataset.mechanicProfileReviewsPage || 1);
    if (!Number.isFinite(nextPage) || nextPage < 1) return;
    mechanicProfileReviewsPage = nextPage;
    renderMechanicProfileReviews(latestMechanicProfile?.reviews || []);
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
  mechanicResolutionCaseAttachBtn?.addEventListener("click", () => {
    mechanicResolutionCaseAttachmentInput?.click();
  });

  mechanicResolutionCaseAttachmentInput?.addEventListener("change", () => {
    if (!pendingResolutionCaseId) return;
    const selectedFiles = Array.from(mechanicResolutionCaseAttachmentInput?.files || []);
    if (!selectedFiles.length) {
      renderMechanicResolutionCaseAttachmentPreview();
      return;
    }
    const existingFiles = pendingMechanicResolutionCaseAttachments.get(pendingResolutionCaseId) || [];
    pendingMechanicResolutionCaseAttachments.set(pendingResolutionCaseId, [...existingFiles, ...selectedFiles]);
    if (mechanicResolutionCaseAttachmentInput) mechanicResolutionCaseAttachmentInput.value = "";
    renderMechanicResolutionCaseAttachmentPreview();
  });

  mechanicResolutionSendBtn?.addEventListener("click", async () => {
    if (!pendingResolutionCaseId || !mechanicToken) return;
    const body = mechanicResolutionMessageInput?.value?.trim();
    const attachments = pendingMechanicResolutionCaseAttachments.get(pendingResolutionCaseId) || [];
    if (!body && !attachments.length) return;
    const route = `/api/users/me/mechanic-resolution-cases/${encodeURIComponent(pendingResolutionCaseId)}/messages`;
    const detail = attachments.length
      ? await apiAuth(route, mechanicToken, (() => {
          const formData = new FormData();
          formData.append("body", body);
          attachments.forEach((file) => formData.append("attachments", file));
          return {
            method: "POST",
            body: formData
          };
        })())
      : await apiAuth(route, mechanicToken, {
          method: "POST",
          body: JSON.stringify({ body })
        });
    if (mechanicResolutionMessageInput) mechanicResolutionMessageInput.value = "";
    clearMechanicResolutionCaseAttachments(pendingResolutionCaseId);
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
    setMechanicHeroByView(view);
    mechanicDashboardView?.classList.toggle("is-hidden", view !== "dashboard");
    mechanicBookingInformationView?.classList.toggle("is-hidden", view !== "booking-information");
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
    if (view === "resolution") {
      setMechanicResolutionSubview("overview");
    }
    if (view === "profile" && latestMechanicProfile) {
      setTimeout(() => renderMechanicProfileMap(latestMechanicProfile), 80);
    }
  };

  const syncMechanicNavState = (view) => {
    mechanicNavLinks.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    syncMechanicMobileNavState(view);
  };

  mechanicHeaderMobileMenuToggle?.addEventListener("click", () => {
    const isOpen = mechanicMobileMenu?.classList.contains("is-open");
    if (isOpen) {
      closeMechanicMobileMenu();
      return;
    }
    openMechanicMobileMenu();
  });

  mechanicMobileMenuBackdrop?.addEventListener("click", closeMechanicMobileMenu);

  mechanicRailToggle?.addEventListener("click", () => {
    setMechanicRailState(!mechanicRail?.classList.contains("is-collapsed"));
  });

  mechanicMobileMenuLinks.forEach((link) => {
    link.addEventListener("click", async () => {
      const action = link.dataset.action || "";
      const href = link.dataset.href || "";
      const targetView = link.dataset.view || link.dataset.targetView || "";
      const targetPage = link.dataset.targetPage || "";
      closeMechanicMobileMenu();
      if (action === "logout") {
        clearStoredSessionData();
        window.location.replace("/");
        return;
      }
      if (targetPage === "profile" || targetPage === "preferences") {
        const session = getStoredUserSession();
        const mechanicUser = session?.user || session;
        const mechanicId = mechanicUser?.id || "0";
        window.location.href = targetPage === "profile"
          ? `/mechanic/${mechanicId}/profile`
          : `/mechanic/${mechanicId}/preferences`;
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

  mechanicNavLinks.forEach((link) => {
    link.addEventListener("click", async () => {
      const view = link.dataset.view || "account";
      syncMechanicNavState(view);
      setMechanicView(view);
      if (view === "resolution") {
        await syncMechanicResolutionOverview();
      }
    });
  });

  mechanicOverviewActionButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const view = button.dataset.view;
      if (!view) return;
      syncMechanicNavState(view);
      setMechanicView(view);
      if (view === "resolution") {
        await syncMechanicResolutionOverview();
      }
    });
  });

  mechanicDashboard.addEventListener("click", (event) => {
    const overviewAction = event.target.closest(".mechanic-overview-action[data-view]");
    if (!overviewAction) return;
    const view = overviewAction.dataset.view;
    if (!view) return;
    syncMechanicNavState(view);
    setMechanicView(view);
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

  const pendingMechanicView = sessionStorage.getItem("mechanicHeaderTargetView");
  const initialMechanicView =
    pendingMechanicView && [
      "dashboard",
      "booking-information",
      "resolution",
      "procedure",
      "payments",
      "profile",
      "edit-profile",
      "certifications",
      "tax",
      "documents",
      "types",
      "account",
      "settings"
    ].includes(pendingMechanicView)
      ? pendingMechanicView
      : "dashboard";
  sessionStorage.removeItem("mechanicHeaderTargetView");
  syncMechanicNavState(initialMechanicView);
  setMechanicView(initialMechanicView);
  syncMechanicBookings();
  syncMechanicProfile();
  syncMechanicCoverage();
  syncMechanicResolutionOverview();
  setMechanicSettingsSubview("general");
  setMechanicResolutionSubview("overview");
  initializeMechanicRail();
  window.addEventListener("focus", syncMechanicBookings);
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
      state.textContent = isPdf ? "Valid format" : "Invalid file format";

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

const dashboardDocumentsView = document.getElementById("mechanicDocumentsView");
if (dashboardDocumentsView) {
  const dashboardDocumentsForm = document.getElementById("mechanicDocumentsUploadForm");
  const dashboardDocumentsInput = document.getElementById("mechanicDocumentsUpload");
  const dashboardDocumentsList = document.getElementById("mechanicDocumentsUploadList");
  const dashboardDocumentsStatus = document.getElementById("mechanicDocumentsUploadStatus");
  const dashboardDocumentsEmail = document.getElementById("mechanicDocumentsUploadEmail");
  const dashboardDocumentsToken = getStoredAuthValue("userToken");
  const dashboardDocumentsProfile = (() => {
    try {
      return JSON.parse(getStoredAuthValue("userProfile") || "{}") || {};
    } catch {
      return {};
    }
  })();
  let stagedDocuments = [];
  let uploadedDocuments = [];

  if (dashboardDocumentsEmail && dashboardDocumentsProfile?.email) {
    dashboardDocumentsEmail.value = dashboardDocumentsProfile.email;
  }

  const getMechanicDashboardEmail = () =>
    String(dashboardDocumentsEmail?.value || dashboardDocumentsProfile?.email || "").trim();

  const isPdfDocument = (file) => Boolean(file) && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));

  const setDashboardDocumentsStatus = (message, state = "") => {
    if (!dashboardDocumentsStatus) return;
    dashboardDocumentsStatus.textContent = message || "";
    dashboardDocumentsStatus.dataset.state = state;
  };

  const syncDashboardDocumentsInput = () => {
    if (!dashboardDocumentsInput) return;
    const dataTransfer = new DataTransfer();
    stagedDocuments.forEach((file) => dataTransfer.items.add(file));
    dashboardDocumentsInput.files = dataTransfer.files;
  };

  const renderDashboardDocumentsList = () => {
    if (!dashboardDocumentsList) return;
    dashboardDocumentsList.innerHTML = "";

    const renderRow = (label, fileName, stateClass, fileUrl = "") => {
      const row = document.createElement("div");
      row.className = "mechanic-documents-upload-item";

      const name = document.createElement(fileUrl ? "a" : "span");
      name.className = "mechanic-documents-upload-name";
      name.textContent = fileName;
      if (fileUrl) {
        name.href = fileUrl;
        name.target = "_blank";
        name.rel = "noopener noreferrer";
      }

      const state = document.createElement("span");
      state.className = `mechanic-documents-upload-state ${stateClass}`;
      state.textContent = label;

      row.append(name, state);
      dashboardDocumentsList.appendChild(row);
    };

    if (!uploadedDocuments.length && !stagedDocuments.length) {
      const empty = document.createElement("p");
      empty.className = "mechanic-documents-upload-status";
      empty.textContent = "No documents uploaded yet.";
      dashboardDocumentsList.appendChild(empty);
      return;
    }

    uploadedDocuments.forEach((file) => {
      renderRow("Uploaded", file.name, "is-valid", file.file_path || "");
    });

    stagedDocuments.forEach((file) => {
      renderRow(isPdfDocument(file) ? "Ready" : "Invalid", file.name, isPdfDocument(file) ? "is-pending" : "is-invalid");
    });
  };

  const loadDashboardDocuments = async () => {
    if (!dashboardDocumentsToken) {
      setDashboardDocumentsStatus("No active mechanic session found.", "error");
      return;
    }
    try {
      const response = await apiAuth("/api/users/me/mechanic-documents", dashboardDocumentsToken);
      const items = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
      uploadedDocuments = items.map((doc) => ({
        id: doc.id,
        name: doc.original_name || doc.file_path?.split("/").pop() || "document.pdf",
        file_path: doc.file_path,
        mime_type: doc.mime_type,
        created_at: doc.created_at
      }));
      renderDashboardDocumentsList();
      setDashboardDocumentsStatus(uploadedDocuments.length ? `${uploadedDocuments.length} uploaded document(s).` : "No documents uploaded yet.", "info");
    } catch (error) {
      setDashboardDocumentsStatus(error?.message || "Unable to load uploaded documents.", "error");
    }
  };

  dashboardDocumentsInput?.addEventListener("change", () => {
    stagedDocuments = Array.from(dashboardDocumentsInput.files || []);
    syncDashboardDocumentsInput();
    renderDashboardDocumentsList();
    setDashboardDocumentsStatus(stagedDocuments.length ? `${stagedDocuments.length} document(s) ready to upload.` : "");
  });

  dashboardDocumentsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = getMechanicDashboardEmail();
    if (!email) {
      setDashboardDocumentsStatus("Mechanic email is missing.", "error");
      return;
    }
    if (!stagedDocuments.length) {
      setDashboardDocumentsStatus("Choose at least one PDF before submitting.", "error");
      return;
    }
    if (stagedDocuments.some((file) => !isPdfDocument(file))) {
      setDashboardDocumentsStatus("Only PDF documents are allowed.", "error");
      renderDashboardDocumentsList();
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    stagedDocuments.forEach((file) => formData.append("documents", file));

    setDashboardDocumentsStatus("Uploading documents...", "info");

    try {
      const response = await fetch(dashboardDocumentsForm.action, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        redirect: "follow"
      });
      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      stagedDocuments = [];
      syncDashboardDocumentsInput();
      if (dashboardDocumentsInput) dashboardDocumentsInput.value = "";
      await loadDashboardDocuments();
      setDashboardDocumentsStatus("Documents uploaded and saved.", "success");
    } catch (error) {
      setDashboardDocumentsStatus(error?.message || "Unable to upload documents.", "error");
    }
  });

  void loadDashboardDocuments();
}

