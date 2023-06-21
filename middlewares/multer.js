const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    const randomString =
      Math.random().toString(36).substring(2, 15).toUpperCase() +
      Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + randomString + fileExtension;
    cb(null, fileName);
  },
});

const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("image");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else if (!mimeType) {
    return cb(new Error("Hanya image yang diizinkan"));
  } else if (file.mimetype === "application/pdf") {
    return cb(new Error("Tidak bisa memasukkan file pdf"));
  } else {
    return cb(new Error("Tipe file yang dimasukkan tidak valid"));
  }
}

module.exports = { uploadSingle, uploadMultiple };
