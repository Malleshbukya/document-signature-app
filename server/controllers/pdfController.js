const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const generateSignedPdf = async (
  req,
  res
) => {
  try {
    const inputPath =
      path.join(
        __dirname,
        "../uploads/1780812699150-Adnoc_CV_Mallesh1.pdf"
      );

    const existingPdf =
      fs.readFileSync(inputPath);

    const pdfDoc =
      await PDFDocument.load(
        existingPdf
      );

    const pages =
      pdfDoc.getPages();

    const firstPage =
      pages[0];

    firstPage.drawText(
      "Mallesh Signature",
      {
        x: 120,
        y: 250,
        size: 18,
      }
    );

    const pdfBytes =
      await pdfDoc.save();

    const outputPath =
      path.join(
        __dirname,
        "../uploads/signed.pdf"
      );

    fs.writeFileSync(
      outputPath,
      pdfBytes
    );

    res.json({
      message:
        "Signed PDF generated",
      file:
        "/uploads/signed.pdf",
    });

  } catch (error) {

    res.status(500).json({
      error:
        error.message,
    });

  }
};

module.exports = {
  generateSignedPdf,
};