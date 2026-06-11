const express =
  require("express");

const router =
  express.Router();

const {
  generateSignedPdf,
} = require(
  "../controllers/pdfController"
);

router.post(
  "/generate",
  generateSignedPdf
);

module.exports =
  router;