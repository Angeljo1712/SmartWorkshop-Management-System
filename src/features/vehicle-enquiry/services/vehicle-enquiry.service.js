const { env } = require("../../../shared/config/env");
const { AppError } = require("../../../shared/utils/appError");
const { getVehicleByRegistration } = require("../../../shared/infrastructure/external/dvsa-vehicle.service");

const normalizeRegistration = (registrationNumber) =>
  String(registrationNumber || "")
    .toUpperCase()
    .replace(/\s+/g, "");

const enquireVehicle = async (registrationNumber) => {
  const normalized = normalizeRegistration(registrationNumber);
  if (!normalized) {
    throw new AppError("VALIDATION_ERROR", "registrationNumber is required", 400);
  }
  if (!env.dvla.apiKey) {
    throw new AppError("DVLA_CONFIG_MISSING", "DVLA API key not configured", 500);
  }

  const response = await fetch(`${env.dvla.baseUrl}/v1/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.dvla.apiKey
    },
    body: JSON.stringify({ registrationNumber: normalized })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const rawMessage = String(payload?.message || payload?.error || "").trim();
    const looksInvalid =
      response.status === 400 ||
      response.status === 404 ||
      response.status === 422 ||
      /invalid/i.test(rawMessage) ||
      /not found/i.test(rawMessage) ||
      /unrecognized/i.test(rawMessage);

    if (looksInvalid) {
      throw new AppError(
        "VALIDATION_ERROR",
        "The registration number looks incorrect. Please check it and try again.",
        400
      );
    }

    const message =
      !rawMessage || /dvla enquiry failed/i.test(rawMessage)
        ? "We couldn't check that vehicle right now. Please try again in a moment."
        : rawMessage;
    throw new AppError("DVLA_ERROR", message, response.status);
  }

  const needsDvsaDetails =
    !payload?.model ||
    (!payload?.mileage && !Array.isArray(payload?.motTests) && !payload?.motExpiryDate);

  if (needsDvsaDetails) {
    try {
      const dvsaPayload = await getVehicleByRegistration(normalized);
      const vehicle = Array.isArray(dvsaPayload) ? dvsaPayload[0] : dvsaPayload;
      if (vehicle?.model) {
        payload.model = vehicle.model;
      }
      if (!payload.make && vehicle?.make) {
        payload.make = vehicle.make;
      }
      if (!payload.fuelType && vehicle?.fuelType) {
        payload.fuelType = vehicle.fuelType;
      }
      if (!payload.mileage && vehicle?.odometerValue) {
        payload.mileage = vehicle.odometerValue;
      }
      if (!payload.motExpiryDate && (vehicle?.expiryDate || vehicle?.motExpiryDate)) {
        payload.motExpiryDate = vehicle.expiryDate || vehicle.motExpiryDate;
      }
      if (!payload.motStatus && (vehicle?.testResult || vehicle?.motStatus)) {
        payload.motStatus = vehicle.testResult || vehicle.motStatus;
      }
      if (!payload.motTests && vehicle) {
        payload.motTests = [vehicle];
      }
    } catch (_err) {
      // Ignore DVSA failures and return DVLA payload.
    }
  }

  return payload;
};

module.exports = { enquireVehicle, normalizeRegistration };


