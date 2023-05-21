//import { Request } from "express";
const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./uploads");
  },
});

const upload = multer({ storage });

module.exports = upload;
