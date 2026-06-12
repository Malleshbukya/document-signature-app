const express =
  require("express");

const {
  generateLink,
  getDocumentByToken,
} = require(
  "../controllers/shareController"
);

const router =
  express.Router();

router.post(
  "/:id",
  generateLink
);

router.get(
  "/public/:token",
  getDocumentByToken
);

module.exports =
  router;