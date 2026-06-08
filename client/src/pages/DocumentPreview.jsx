import { Document, Page } from "react-pdf";
import { useState } from "react";

function DocumentPreview({ fileUrl }) {
  const [numPages, setNumPages] =
    useState(null);

  function onLoadSuccess({
    numPages,
  }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={fileUrl}
        onLoadSuccess={
          onLoadSuccess
        }
      >
        {Array.from(
          new Array(numPages),
          (el, index) => (
            <Page
              key={index}
              pageNumber={
                index + 1
              }
            />
          )
        )}
      </Document>
    </div>
  );
}

export default DocumentPreview;