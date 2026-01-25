const output = document.getElementById("output");
let token = null;

const write = (data) => {
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

document.getElementById("loginCustomer").addEventListener("click", async () => {
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

document.getElementById("getRequests").addEventListener("click", async () => {
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
