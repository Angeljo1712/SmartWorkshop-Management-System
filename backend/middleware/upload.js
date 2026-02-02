const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { AppError } = require("../../frontend/src/utils/appError");

const uploadRoot = path.join(__dirname, "../uploads/avatars");
fs.mkdirSync(uploadRoot, { recursive: true });

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

module.exports = { uploadAvatar };
