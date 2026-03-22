const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/** Tamaño máximo por archivo (bytes). Override: MAX_UPLOAD_BYTES en el entorno. */
const MAX_FILE_SIZE =
  Number.parseInt(process.env.MAX_UPLOAD_BYTES ?? "", 10) || 100 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const base = path.basename(file.originalname, ext).replace(/[^\w.-]/g, "_");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Tipo no permitido (${file.mimetype}). Solo imágenes y vídeos (JPEG, PNG, GIF, WebP, MP4, WebM, MOV, AVI, MKV, etc.).`
        )
      );
    }
  },
});

function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "Archivo demasiado grande",
        maxBytes: MAX_FILE_SIZE,
      });
    }
    return res.status(400).json({ error: err.message, code: err.code });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "invitacion-quince-backend" });
});

app.post(
  "/api/album/:token/upload",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo (campo: file)" });
    }
    res.json({
      message: "Archivo guardado",
      token: req.params.token,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
    });
  },
  handleUploadError
);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
