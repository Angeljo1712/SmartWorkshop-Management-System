if (document.body.classList.contains("mechanic-welcome")) {
  const mechanicWelcomeStartBtn = document.getElementById("mechanicWelcomeStartBtn");
  const passwordCard = document.getElementById("mechanicSetPasswordCard");
  const passwordForm = document.getElementById("setMechanicPasswordForm");
  const passwordEmail = document.getElementById("mechanicPasswordEmail");
  const passwordChallengeToken = document.getElementById("mechanicPasswordChallengeToken");
  const passwordSubmitBtn = document.getElementById("mechanicPasswordSubmit");
  const verificationStep = document.getElementById("mechanicVerificationStep");
  const passwordCodeInput = document.getElementById("mechanicPasswordCode");
  const resendCodeBtn = document.getElementById("mechanicResendCodeBtn");
  const passwordError = document.getElementById("mechanicPasswordError");

  const storedLead = sessionStorage.getItem("mechanicLead");
  if (storedLead) {
    try {
      const leadData = JSON.parse(storedLead);
      if (passwordEmail) passwordEmail.value = leadData.email || "";
    } catch {}
  }

  const setVerificationStepVisible = (visible) => {
    verificationStep?.classList.toggle("is-hidden", !visible);
    if (resendCodeBtn) {
      resendCodeBtn.classList.toggle("is-hidden", !visible);
    }
    if (visible) {
      passwordCodeInput?.focus();
    }
  };

  mechanicWelcomeStartBtn?.addEventListener("click", () => {
    passwordCard?.classList.remove("is-hidden");
    passwordCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  passwordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (passwordError) passwordError.textContent = "";

    const email = passwordEmail?.value || "";
    const password = document.getElementById("mechanicPasswordValue")?.value || "";
    const confirm = document.getElementById("mechanicPasswordConfirm")?.value || "";
    const challengeToken = passwordChallengeToken?.value || "";
    const code = passwordCodeInput?.value || "";

    try {
      if (verificationStep && !verificationStep.classList.contains("is-hidden")) {
        if (!challengeToken) {
          throw new Error("Verification code session expired. Please send a new code.");
        }
        if (!code.trim()) {
          throw new Error("Verification code is required.");
        }

        await api("/mechanic/set-password", {
          method: "POST",
          body: JSON.stringify({
            email,
            challenge_token: challengeToken,
            code: code.trim()
          })
        });

        sessionStorage.removeItem("mechanicLead");
        sessionStorage.removeItem("homeFlashMessage");
        window.location.href = "/";
        return;
      }

      const result = await api("/mechanic/set-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          confirm
        })
      });

      if (passwordChallengeToken && result?.challenge_token) {
        passwordChallengeToken.value = result.challenge_token;
      }

      setVerificationStepVisible(true);
    } catch (err) {
      if (passwordError) {
        passwordError.textContent = err?.error?.message || err?.message || "Unable to set password.";
      }
    }
  });

  resendCodeBtn?.addEventListener("click", async () => {
    if (passwordError) passwordError.textContent = "";
    const email = passwordEmail?.value || "";
    const password = document.getElementById("mechanicPasswordValue")?.value || "";
    const confirm = document.getElementById("mechanicPasswordConfirm")?.value || "";

    try {
      const result = await api("/mechanic/set-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          confirm
        })
      });
      if (passwordChallengeToken && result?.challenge_token) {
        passwordChallengeToken.value = result.challenge_token;
      }
      if (passwordError) {
        passwordError.textContent = "A new verification code has been sent.";
      }
      passwordCodeInput?.focus();
    } catch (err) {
      if (passwordError) {
        passwordError.textContent = err?.error?.message || err?.message || "Unable to resend code.";
      }
    }
  });
}
