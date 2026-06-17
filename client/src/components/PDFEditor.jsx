import {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import pdfWorker from
  "pdfjs-dist/build/pdf.worker.min.mjs?url";

import
  "react-pdf/dist/Page/TextLayer.css";

import
  "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  pdfWorker;

function PDFEditor({
  document: pdfDocument,
}) {

  const [numPages, setNumPages] =
    useState(null);

  const [signaturePos,
    setSignaturePos] =
    useState({
      x: 120,
      y: 250,
    });

  if (!pdfDocument) {
    return null;
  }

  const pdfUrl =
    `https://document-signature-app-lgxn.onrender.com/${pdfDocument.file_path}`;
    
console.log("PDF PATH:", pdfDocument.file_path);

  const [signatureImage,
  setSignatureImage] =
  useState("");

  const loadLatestSignature =
async () => {

  try {

    const response =
      await axios.get(
        "https://document-signature-app-lgxn.onrender.com/api/signatures/latest"
      );

    console.log(
      "Latest Signature:",
      response.data.path
    );

    setSignatureImage(
      `https://document-signature-app-lgxn.onrender.com/${response.data.path}?t=${Date.now()}`
    );

  } catch (error) {

    console.log(error);

  }

};


  const loadSignaturePosition =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            `https://document-signature-app-lgxn.onrender.com/api/signatures/${pdfDocument.id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          response.data &&
          response.data.length > 0
        ) {

          const latest =
            response.data[
              response.data.length - 1
            ];

          setSignaturePos({
            x:
              Number(
                latest.x
              ),
            y:
              Number(
                latest.y
              ),
          });

        }

      } catch (error) {

        console.log(error);

      }

    };
 useEffect(() => {

  loadSignaturePosition();

  loadLatestSignature();

}, [pdfDocument]);
  


  const saveSignature =
    async (x, y) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          "https://document-signature-app-lgxn.onrender.com/api/signatures",
          {
            documentId:
              pdfDocument.id,
            x,
            y,
            page: 1,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      } catch (error) {

        console.log(error);

      }

    };

  const handleMouseDown =
    (e) => {

      const startX =
        e.clientX;

      const startY =
        e.clientY;

      const initialX =
        signaturePos.x;

      const initialY =
        signaturePos.y;

      const handleMouseMove =
        (e) => {

          setSignaturePos({
            x:
              initialX +
              (
                e.clientX -
                startX
              ),

            y:
              initialY +
              (
                e.clientY -
                startY
              ),
          });

        };

      const handleMouseUp =
        async (e) => {

          const finalX =
            initialX +
            (
              e.clientX -
              startX
            );

          const finalY =
            initialY +
            (
              e.clientY -
              startY
            );

          window.document.removeEventListener(
            "mousemove",
            handleMouseMove
          );

          window.document.removeEventListener(
            "mouseup",
            handleMouseUp
          );

          await saveSignature(
            finalX,
            finalY
          );

        };

      window.document.addEventListener(
        "mousemove",
        handleMouseMove
      );

      window.document.addEventListener(
        "mouseup",
        handleMouseUp
      );

    };

  const generateSignedPdf =
    async () => {

      try {

        const response =
          await axios.post(
            "https://document-signature-app-lgxn.onrender.com/api/pdf/generate",
            {
              documentId:
                pdfDocument.id,
            }
          );

        window.open(
          `https://document-signature-app-lgxn.onrender.com${response.data.file}`,
          "_blank"
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div
      id="pdf-container"
      style={{
        position:
          "relative",
        width:
          "700px",
        margin:
          "20px auto",
      }}
    >

      <Document
        file={pdfUrl}
        onLoadSuccess={(
          { numPages }
        ) =>
          setNumPages(
            numPages
          )
        }
      >

        {Array.from(
          new Array(
            numPages || 0
          ),
          (_, index) => (
            <Page
              key={index}
              pageNumber={
                index + 1
              }
              width={700}
            />
          )
        )}

      </Document>

     <img
  key={signatureImage}
  src={signatureImage}
  alt="Signature"
  onMouseDown={handleMouseDown}
  style={{
    position: "absolute",
    left: signaturePos.x,
    top: signaturePos.y,
    width: "150px",
    height: "80px",
    cursor: "move",
    zIndex: 9999,
    userSelect: "none",
    border: "2px dashed red",
    background: "white",
  }}
/>

      <button
        onClick={
          generateSignedPdf
        }
        style={{
          marginTop:
            "20px",
          padding:
            "10px 20px",
          background:
            "green",
          color:
            "white",
          border:
            "none",
          borderRadius:
            "8px",
          cursor:
            "pointer",
          fontWeight:
            "bold",
        }}
      >
        Generate Signed PDF
      </button>

    </div>

  );

}

export default PDFEditor;