const { env } = require("../../config/env");
const { AppError } = require("../../utils/appError");

let cachedToken = null;
let tokenExpiresAt = 0;

const normalizeVatNumber = (value) =>
  String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const isLikelyUkVatNumber = (value) => {
  const normalized = normalizeVatNumber(value);
  if (!normalized) return false;
  const vat = normalized.startsWith("GB") ? normalized.slice(2) : normalized;
  return /^(\d{9}|\d{12})$/.test(vat);
};

const getAccessToken = async () => {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt - now > 30_000) {
    return cachedToken;
  }

  if (!env.taxApi.tokenUrl || !env.taxApi.clientId || !env.taxApi.clientSecret) {
    throw new AppError("TAX_CONFIG_MISSING", "Tax API credentials not configured", 500);
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.taxApi.clientId,
    client_secret: env.taxApi.clientSecret
  });
  if (env.taxApi.scope) {
    body.set("scope", env.taxApi.scope);
  }

  const response = await fetch(env.taxApi.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error_description || payload?.error || "Tax API token request failed";
    throw new AppError("TAX_AUTH_FAILED", message, response.status);
  }

  cachedToken = payload.access_token;
  const expiresIn = Number(payload.expires_in || 0);
  tokenExpiresAt = now + expiresIn * 1000;
  return cachedToken;
};

const buildCandidateRequests = (vatNumber) => {
  const normalized = normalizeVatNumber(vatNumber);
  const baseUrl = String(env.taxApi.baseUrl || "").trim().replace(/\/+$/, "");
  const candidates = [];

  if (env.taxApi.verifyUrl) {
    candidates.push({
      url: env.taxApi.verifyUrl,
      method: "POST",
      body: {
        vat_number: normalized,
        vatNumber: normalized,
        vat: normalized
      }
    });
  }

  if (baseUrl) {
    candidates.push(
      { url: `${baseUrl}/vat/check?vat_number=${encodeURIComponent(normalized)}`, method: "GET" },
      { url: `${baseUrl}/vat/check?vatNumber=${encodeURIComponent(normalized)}`, method: "GET" },
      { url: `${baseUrl}/vat/check/${encodeURIComponent(normalized)}`, method: "GET" },
      {
        url: `${baseUrl}/vat/check`,
        method: "POST",
        body: {
          vat_number: normalized,
          vatNumber: normalized,
          vat: normalized
        }
      },
      { url: `${baseUrl}/vat/verify?vat_number=${encodeURIComponent(normalized)}`, method: "GET" },
      { url: `${baseUrl}/vat/verify/${encodeURIComponent(normalized)}`, method: "GET" },
      {
        url: `${baseUrl}/vat/verify`,
        method: "POST",
        body: {
          vat_number: normalized,
          vatNumber: normalized,
          vat: normalized
        }
      },
      {
        url: `${baseUrl}/vat`,
        method: "POST",
        body: {
          vat_number: normalized,
          vatNumber: normalized,
          vat: normalized
        }
      }
    );
  }

  return candidates.filter((candidate) => candidate.url);
};

const readVerificationState = (payload) => {
  const root = payload?.data ?? payload?.result ?? payload?.response ?? payload;
  const explicitValid = root?.valid ?? root?.is_valid ?? root?.registered ?? root?.verified ?? root?.success;
  const explicitInvalid = root?.invalid ?? root?.is_invalid ?? root?.not_registered ?? root?.notVerified;

  const valid =
    explicitValid === true
      ? true
      : explicitValid === false
        ? false
        : explicitInvalid === true
          ? false
          : null;

  const reference =
    root?.reference ||
    root?.verification_reference ||
    root?.check_reference ||
    root?.referenceNumber ||
    null;

  return {
    valid,
    reference,
    raw: payload
  };
};

const verifyVatNumber = async (vatNumber) => {
  const normalizedVat = normalizeVatNumber(vatNumber);
  if (!normalizedVat) {
    throw new AppError("VALIDATION_ERROR", "VAT number is required", 400);
  }

  const token = await getAccessToken();
  const candidates = buildCandidateRequests(normalizedVat);
  if (!candidates.length) {
    throw new AppError("TAX_CONFIG_MISSING", "Tax API base URL not configured", 500);
  }

  let lastError = null;
  for (const candidate of candidates) {
    try {
      const init = {
        method: candidate.method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      if (candidate.method !== "GET") {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(candidate.body || {});
      }

      const response = await fetch(candidate.url, init);
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        const result = readVerificationState(payload);
        return {
          vat_number: normalizedVat,
          valid: result.valid === null ? true : Boolean(result.valid),
          reference: result.reference,
          raw: result.raw
        };
      }

      if (response.status === 404 || response.status === 405) {
        lastError = new AppError("TAX_ENDPOINT_NOT_FOUND", "Tax verification endpoint not found", response.status);
        continue;
      }

      if (response.status === 401 || response.status === 403) {
        const message = payload?.error_description || payload?.error || "Tax API authentication failed";
        throw new AppError("TAX_AUTH_FAILED", message, response.status);
      }

      const result = readVerificationState(payload);
      if (result.valid === false) {
        return {
          vat_number: normalizedVat,
          valid: false,
          reference: result.reference,
          raw: result.raw
        };
      }

      lastError = new AppError(
        "TAX_VERIFICATION_FAILED",
        payload?.message || payload?.error || `Tax verification failed (${response.status})`,
        response.status
      );
    } catch (err) {
      if (err instanceof AppError) {
        if (err.status === 404 || err.status === 405) {
          lastError = err;
          continue;
        }
        throw err;
      }
      lastError = err;
    }
  }

  if (lastError instanceof AppError) {
    throw lastError;
  }

  throw new AppError("TAX_VERIFICATION_FAILED", "Tax verification failed", 502);
};

module.exports = {
  normalizeVatNumber,
  isLikelyUkVatNumber,
  verifyVatNumber
};
