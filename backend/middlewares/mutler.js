import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
}).single("file");

// For multiple files upload
export const projectUpload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB per file
  },
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]);
