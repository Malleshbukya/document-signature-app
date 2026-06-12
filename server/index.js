require("dotenv").config();
require("./db/initDb");
require("./db/initDocsTable");
require("./db/initSignatureTable");

const express = require("express");
const cors = require("cors");

const authRoutes =
  require("./routes/authRoutes");

const userRoutes =
  require("./routes/userRoutes");

const documentRoutes =
  require("./routes/documentRoutes");

const signatureRoutes =
  require("./routes/signatureRoutes");

const pdfRoutes =
  require("./routes/pdfRoutes");
  const shareRoutes =
  require("./routes/shareRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Document Signature API Running"
  );
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/docs",
  documentRoutes
);

app.use(
  "/api/signatures",
  signatureRoutes
);

app.use(
  "/api/pdf",
  pdfRoutes
);

app.use(
  "/uploads",
  express.static("uploads")
);


app.use(
  "/api/share",
  shareRoutes
);
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});