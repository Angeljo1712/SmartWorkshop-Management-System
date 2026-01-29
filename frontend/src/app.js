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
  const titleEl = document.getElementById("shopTitle");
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
      window.location.href = `/pages/Shop/index.html?${params.toString()}`;
    } catch (err) {
      const message = err?.error?.message || err?.message || "Unable to look up vehicle details.";
      errorEl.textContent = message;
    }
  });
}

renderVehicleSummary();

const adminOutput = document.getElementById("adminOutput");
const writeAdmin = (data) => {
  if (!adminOutput) {
    return;
  }
  adminOutput.textContent = JSON.stringify(data, null, 2);
};

const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
  const adminEmail = document.getElementById("adminEmail");
  const adminPassword = document.getElementById("adminPassword");
  const adminLoginError = document.getElementById("adminLoginError");

  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminLoginError.textContent = "";
    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: adminEmail.value.trim(),
          password: adminPassword.value
        })
      });
      sessionStorage.setItem("adminToken", result.token);
      writeAdmin({ status: "logged_in", user: result.user });
    } catch (err) {
      adminLoginError.textContent = err?.error?.message || "Login failed";
    }
  });
}

const getAdminToken = () => sessionStorage.getItem("adminToken");

const createMechanicForm = document.getElementById("createMechanicForm");
if (createMechanicForm) {
  const mechanicName = document.getElementById("mechanicName");
  const mechanicEmail = document.getElementById("mechanicEmail");
  const mechanicPassword = document.getElementById("mechanicPassword");
  const mechanicError = document.getElementById("mechanicError");

  createMechanicForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    mechanicError.textContent = "";
    const token = getAdminToken();
    if (!token) {
      mechanicError.textContent = "Login as admin first.";
      return;
    }
    try {
      const result = await apiAuth("/api/admin/users", token, {
        method: "POST",
        body: JSON.stringify({
          full_name: mechanicName.value.trim(),
          email: mechanicEmail.value.trim(),
          password: mechanicPassword.value,
          role: "MECHANIC"
        })
      });
      writeAdmin({ created: result });
      createMechanicForm.reset();
    } catch (err) {
      mechanicError.textContent = err?.error?.message || "Unable to create mechanic.";
    }
  });
}

const createWorkshopForm = document.getElementById("createWorkshopForm");
if (createWorkshopForm) {
  const workshopName = document.getElementById("workshopName");
  const workshopAddress = document.getElementById("workshopAddress");
  const workshopPostcode = document.getElementById("workshopPostcode");
  const workshopPhone = document.getElementById("workshopPhone");
  const workshopDescription = document.getElementById("workshopDescription");
  const workshopError = document.getElementById("workshopError");

  createWorkshopForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    workshopError.textContent = "";
    const token = getAdminToken();
    if (!token) {
      workshopError.textContent = "Login as admin first.";
      return;
    }
    try {
      const result = await apiAuth("/api/admin/workshops", token, {
        method: "POST",
        body: JSON.stringify({
          name: workshopName.value.trim(),
          address: workshopAddress.value.trim(),
          postcode: workshopPostcode.value.trim(),
          phone: workshopPhone.value.trim(),
          description: workshopDescription.value.trim()
        })
      });
      writeAdmin({ created: result });
      createWorkshopForm.reset();
    } catch (err) {
      workshopError.textContent = err?.error?.message || "Unable to create workshop.";
    }
  });
}

const loadWorkshops = document.getElementById("loadWorkshops");
if (loadWorkshops) {
  loadWorkshops.addEventListener("click", async () => {
    const token = getAdminToken();
    if (!token) {
      writeAdmin({ error: "Login as admin first." });
      return;
    }
    try {
      const result = await apiAuth("/api/admin/workshops", token);
      writeAdmin(result);
    } catch (err) {
      writeAdmin(err);
    }
  });
}

const loadUsers = document.getElementById("loadUsers");
if (loadUsers) {
  loadUsers.addEventListener("click", async () => {
    const token = getAdminToken();
    if (!token) {
      writeAdmin({ error: "Login as admin first." });
      return;
    }
    try {
      const result = await apiAuth("/api/admin/users", token);
      writeAdmin(result);
    } catch (err) {
      writeAdmin(err);
    }
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
