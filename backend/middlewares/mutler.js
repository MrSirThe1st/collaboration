import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
}).single("file");

// For multiple files upload
export const multipleUpload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB per file
  },
}).array("files", 10); // Allow up to 10 files at once
