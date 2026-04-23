(() => {
  const signInForm = document.getElementById("signInForm");
  if (signInForm) {
    const signInEmail = document.getElementById("signInEmail");
    const signInPassword = document.getElementById("signInPassword");
    const signInError = document.getElementById("signInError");
    const twoFactorPanel = document.getElementById("twoFactorPanel");
    const twoFactorForm = document.getElementById("twoFactorForm");
    const twoFactorCode = document.getElementById("twoFactorCode");
    const twoFactorError = document.getElementById("twoFactorError");
    const twoFactorMessage = document.getElementById("twoFactorMessage");
    const twoFactorBack = document.getElementById("twoFactorBack");

    let pendingChallengeToken = "";
    let pendingLoginIdentifier = "";
    const resolveApiErrorMessage = (payload, fallback) =>
      payload?.error?.message || payload?.message || payload?.error || fallback;

    const showTwoFactorPanel = (message, challengeToken) => {
      pendingChallengeToken = challengeToken || "";
      if (twoFactorMessage) twoFactorMessage.textContent = message || "We sent a verification code to your email.";
      signInForm.classList.add("is-hidden");
      twoFactorPanel?.classList.remove("is-hidden");
      if (twoFactorError) twoFactorError.textContent = "";
      if (twoFactorCode) twoFactorCode.value = "";
      setTimeout(() => {
        twoFactorCode?.focus();
      }, 0);
    };

    const hideTwoFactorPanel = () => {
      pendingChallengeToken = "";
      pendingLoginIdentifier = "";
      twoFactorPanel?.classList.add("is-hidden");
      signInForm.classList.remove("is-hidden");
      if (twoFactorError) twoFactorError.textContent = "";
      if (signInError) signInError.textContent = "";
      if (twoFactorCode) twoFactorCode.value = "";
    };

    twoFactorCode?.addEventListener("input", () => {
      twoFactorCode.value = String(twoFactorCode.value || "").replace(/\D+/g, "").slice(0, 6);
    });

    signInForm.reset();
    if (signInEmail) signInEmail.value = "";
    if (signInPassword) signInPassword.value = "";
    setTimeout(() => {
      if (signInEmail) signInEmail.value = "";
      if (signInPassword) signInPassword.value = "";
    }, 0);

    signInForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (signInError) signInError.textContent = "";

      const identifier = signInEmail?.value.trim() || "";
      const password = signInPassword?.value || "";

      if (!identifier || !password) {
        if (signInError) signInError.textContent = "Please enter your email or username and password.";
        return;
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw result;
        }

        if (result?.requires_2fa) {
          pendingLoginIdentifier = identifier;
          showTwoFactorPanel(result?.message || "Check your email for the verification code.", result.challenge_token);
          return;
        }

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
        if (signInError) signInError.textContent = resolveApiErrorMessage(err, "Login failed. Check your credentials.");
      }
    });

    twoFactorBack?.addEventListener("click", () => {
      hideTwoFactorPanel();
    });

    twoFactorForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (twoFactorError) twoFactorError.textContent = "";
      const code = String(twoFactorCode?.value || "").replace(/\D+/g, "").slice(0, 6);
      if (!pendingChallengeToken || !code) {
        if (twoFactorError) twoFactorError.textContent = "Please enter the verification code sent to your email.";
        return;
      }

      try {
        const response = await fetch("/api/auth/login/verify-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challenge_token: pendingChallengeToken,
            code
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw result;
        }

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
        if (twoFactorError) twoFactorError.textContent = resolveApiErrorMessage(err, "Invalid verification code.");
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
        const response = await fetch("/api/auth/password-reset-request", {
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
        const response = await fetch("/api/auth/password-reset", {
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

  const confirmEmailPage = document.getElementById("confirmEmailPage");
  if (confirmEmailPage) {
    const titleEl = document.getElementById("confirmEmailTitle");
    const statusEl = document.getElementById("confirmEmailStatus");
    const detailsEl = document.getElementById("confirmEmailDetails");
    const actionEl = document.getElementById("confirmEmailAction");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const setStatus = (title, message, details = "", actionLabel = "OK", actionHref = "/auth/login") => {
      if (titleEl) titleEl.textContent = title;
      if (statusEl) statusEl.textContent = message;
      if (detailsEl) detailsEl.textContent = details;
      if (actionEl) {
        actionEl.textContent = actionLabel;
        actionEl.setAttribute("href", actionHref);
      }
    };

    actionEl?.addEventListener("click", (event) => {
      const targetHref = actionEl.getAttribute("href") || "/auth/login";
      if (targetHref !== "/auth/login") {
        return;
      }
      event.preventDefault();
      clearStoredSessionData();
      window.location.href = targetHref;
    });

    if (!token) {
      setStatus(
        "Email confirmation",
        "Missing confirmation token.",
        "Please request a new email change.",
        "Go to sign in",
        "/auth/login"
      );
    } else {
      fetch(`/api/users/confirm-email?token=${encodeURIComponent(token)}`)
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok) {
            throw payload;
          }
          if (payload.user) {
            setStoredAuthValue("userProfile", JSON.stringify(payload.user));
          }
          setStatus(
            "Email changed successfully",
            "Your email address has been updated successfully.",
            "",
            "OK",
            "/auth/login"
          );
        })
        .catch((err) => {
          setStatus(
            "Email confirmation",
            err?.error?.message || err?.message || "Unable to confirm email.",
            "Please request a new email change.",
            "Go to sign in",
            "/auth/login"
          );
        });
    }

  }

  const rolePickerButtons = document.querySelectorAll("[data-role-target]");
  if (rolePickerButtons.length) {
    const storedProfile = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
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
})();
