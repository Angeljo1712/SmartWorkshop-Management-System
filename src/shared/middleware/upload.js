const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { AppError } = require("../utils/appError");

const uploadRoot = path.join(__dirname, "../uploads/avatars");
const documentsUploadRoot = path.join(__dirname, "../uploads/mechanic-documents");
const bookingCompletionUploadRoot = path.join(__dirname, "../uploads/booking-completion");
fs.mkdirSync(uploadRoot, { recursive: true });
fs.mkdirSync(documentsUploadRoot, { recursive: true });
fs.mkdirSync(bookingCompletionUploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext && ext.length <= 8 ? ext : "";
    cb(null, `user-${req.user?.userId || "anon"}-${Date.now()}${safeExt}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new AppError("INVALID_FILE", "Only image uploads are allowed", 400));
  }
  return cb(null, true);
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const documentsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, documentsUploadRoot);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext && ext.length <= 8 ? ext : "";
    cb(null, `mechanic-doc-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});

const documentsFileFilter = (_req, file, cb) => {
  const allowedMimeTypes = new Set([
    "application/pdf"
  ]);
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new AppError("INVALID_FILE", "Formato incorrecto", 400));
  }
  return cb(null, true);
};

const uploadMechanicDocuments = multer({
  storage: documentsStorage,
  fileFilter: documentsFileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 }
});

const bookingCompletionStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, bookingCompletionUploadRoot);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext && ext.length <= 8 ? ext : "";
    cb(null, `booking-${req.params?.bookingId || "unknown"}-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});

const uploadBookingCompletionPhotos = multer({
  storage: bookingCompletionStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 }
});

module.exports = { uploadAvatar, uploadMechanicDocuments, uploadBookingCompletionPhotos };
