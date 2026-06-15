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
  (req, res, next) => {

    console.log(
      "PDF ROUTE HIT"
    );

    next();

  },
  generateSignedPdf
);

module.exports =
  router;