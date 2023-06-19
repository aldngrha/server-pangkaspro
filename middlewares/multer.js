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
  const fileTypes = /"jpeg"|"jpg"|"png"|"gif"/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else if (!mimeType) {
    cb("Error: Only images are allowed");
  } else if (file.mimetype === "application/pdf") {
    cb("Error: PDFs are not allowed");
  } else {
    cb("Error: Invalid file type");
  }
}

module.exports = { uploadSingle, uploadMultiple };
