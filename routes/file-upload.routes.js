const express = require("express");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "public" });

router.post("/", upload.single("file"), (req, res, next) => {
  const originalName = req.file.originalname;
  const path = req.file.path;

  const newPath = path + "_" + originalName

  fs.renameSync(path, newPath);
  res.send("Fichero subido correctamente!");
});

module.exports = { fileUploadRouter: router };
