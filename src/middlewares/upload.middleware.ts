import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("unsupported_file_type"));
    }

    cb(null, true);
  },
});

export default upload;