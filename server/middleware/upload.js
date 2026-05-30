const multer = require("multer");
const path = require("path");

// Allowed file types
const allowedTypes = /jpeg|jpg|png|pdf/;

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  // Check extension
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Check mime type
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, and PDF files are allowed"
      )
    );
  }
};

// Multer setup
const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: fileFilter,
});

module.exports = upload;