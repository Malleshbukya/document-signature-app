const express =
  require("express");

const {
  getAuditLogs,
} = require(
  "../controllers/auditController"
);

const router =
  express.Router();

router.get(
  "/:fileId",
  getAuditLogs
);

module.exports =
  router;