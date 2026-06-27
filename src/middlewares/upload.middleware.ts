import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/profile";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const fileName =
      Date.now() + path.extname(file.originalname);

    cb(null, fileName);
  },
});

export default multer({ storage });