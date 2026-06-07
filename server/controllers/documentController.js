const db = require("../db/database");

const uploadDocument = (
  req,
  res
) => {
  try {

    const file = req.file;

    db.prepare(`
      INSERT INTO documents
      (
        owner_id,
        file_name,
        file_path
      )
      VALUES (?,?,?)
    `).run(
      req.user.id,
      file.originalname,
      file.path
    );

    res.status(201).json({
      message:
        "Document uploaded successfully",
      file,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

module.exports = {
  uploadDocument,
};