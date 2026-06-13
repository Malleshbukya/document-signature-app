const express =
  require("express");

const {
  updateStatus,
  getStatus,
} = require(
  "../controllers/statusController"
);

const router =
  express.Router();

router.post(
  "/respond",
  updateStatus
);

router.get(
  "/:id",
  getStatus
);

module.exports =
  router;