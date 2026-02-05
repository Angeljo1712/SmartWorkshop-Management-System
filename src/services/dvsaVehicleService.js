const { env } = require("../config/env");
const { AppError } = require("../utils/appError");

let cachedToken = null;
let tokenExpiresAt = 0;

const getAccessToken = async () => {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt - now > 30_000) {
    return cachedToken;
  }
  if (!env.dvsa.tokenUrl || !env.dvsa.clientId || !env.dvsa.clientSecret) {
    throw new AppError("DVSA_CONFIG_MISSING", "DVSA credentials not configured", 500);
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.dvsa.clientId,
    client_secret: env.dvsa.clientSecret,
    scope: env.dvsa.scope
  });

  const response = await fetch(env.dvsa.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error_description || payload?.error || "DVSA token request failed";
    throw new AppError("DVSA_AUTH_FAILED", message, response.status);
  }

  cachedToken = payload.access_token;
  const expiresIn = Number(payload.expires_in || 0);
  tokenExpiresAt = now + expiresIn * 1000;
  return cachedToken;
};

const getVehicleByRegistration = async (registration) => {
  if (!env.dvsa.apiKey) {
    throw new AppError("DVSA_CONFIG_MISSING", "DVSA API key not configured", 500);
  }
  const token = await getAccessToken();
  const url = `${env.dvsa.baseUrl}/v1/trade/vehicles/registration/${encodeURIComponent(registration)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-Key": env.dvsa.apiKey
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.message || payload?.error || "DVSA vehicle lookup failed";
    throw new AppError("DVSA_ERROR", message, response.status);
  }

  return payload;
};

module.exports = { getVehicleByRegistration };
