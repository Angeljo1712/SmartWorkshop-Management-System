if (document.body.classList.contains("mechanic-welcome")) {
  const mechanicWelcomeStartBtn = document.getElementById("mechanicWelcomeStartBtn");
  const passwordCard = document.getElementById("mechanicSetPasswordCard");
  const passwordForm = document.getElementById("setMechanicPasswordForm");
  const passwordEmail = document.getElementById("mechanicPasswordEmail");
  const passwordError = document.getElementById("mechanicPasswordError");

  const storedLead = sessionStorage.getItem("mechanicLead");
  if (storedLead) {
    try {
      const leadData = JSON.parse(storedLead);
      if (passwordEmail) passwordEmail.value = leadData.email || "";
    } catch {}
  }

  mechanicWelcomeStartBtn?.addEventListener("click", () => {
    passwordCard?.classList.remove("is-hidden");
    passwordCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  passwordForm?.addEventListener("submit", async (event) => {
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
      sessionStorage.removeItem("mechanicLead");
      window.location.href = "/mechanic/dashboard";
    } catch (err) {
      if (passwordError) {
        passwordError.textContent = err?.error?.message || err?.message || "Unable to set password.";
      }
    }
  });
}






