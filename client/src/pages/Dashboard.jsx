import { useEffect, useState } from "react";
import axios from "axios";

import UploadDocument from "../components/UploadDocument";
import UploadSignature from "../components/UploadSignature";
import PDFEditor from "../components/PDFEditor";

function Dashboard() {
  const [documents, setDocuments] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [selectedDocument,
    setSelectedDocument] =
    useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";
  };

 const fetchDocuments =
  async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          "https://document-signature-app-lgxn.onrender.com/api/docs",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "Documents:",
        response.data
      );

      setDocuments(
        response.data
      );

    } catch (error) {

      console.log(error);

    }
  };

  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this document?"
        );

      if (!confirmDelete) {
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `https://document-signature-app-lgxn.onrender.com/api/docs/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Document deleted successfully"
        );

        fetchDocuments();
      } catch (error) {
        console.log(error);

        alert(
          "Delete failed"
        );
      }
    };

    const handleReject = async (id) => {

  const reason = prompt(
    "Enter rejection reason:"
  );

  if (!reason) return;

  try {

   const token =
  localStorage.getItem(
    "token"
  );

await axios.post(
  "https://document-signature-app-lgxn.onrender.com/api/status/respond",
  {
    documentId: id,
    status: "Rejected",
    reason,
  },
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }
);

    alert(
      "Document Rejected"
    );

    fetchDocuments();

  } catch (error) {

    console.log(error);

    alert(
      "Failed to reject document"
    );

  }

};
  const filteredDocs =
  filter === "All"
    ? documents
    : documents.filter(
        (doc) =>
          (
            doc.status ||
            "Pending"
          ).toLowerCase() ===
          filter.toLowerCase()
      );

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              My Documents
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all your PDFs
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-5
              py-2
              rounded-lg
              shadow
            "
          >
            Logout
          </button>

        </div>

        {/* Upload PDF */}

        <div className="mb-8">
          <UploadDocument />
        </div>

        {/* Upload Signature */}

        <div className="mb-8">
          <UploadSignature />
        </div>

        {/* Total Documents */}

        <div className="mb-6">

          <span className="text-lg text-gray-600">
            Total Documents:
          </span>

          <span className="ml-2 font-bold text-xl">
            {filteredDocs.length}
          </span>

        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-3 mb-8">

          <button
            onClick={() =>
              setFilter("All")
            }
            className="
              px-5 py-2
              bg-gray-600
              text-white
              rounded-lg
            "
          >
            All
          </button>

          <button
            onClick={() =>
              setFilter("Pending")
            }
            className="
              px-5 py-2
              bg-yellow-500
              text-white
              rounded-lg
            "
          >
            Pending
          </button>

          <button
            onClick={() =>
              setFilter("Signed")
            }
            className="
              px-5 py-2
              bg-green-600
              text-white
              rounded-lg
            "
          >
            Signed
          </button>

          <button
            onClick={() =>
              setFilter("Rejected")
            }
            className="
              px-5 py-2
              bg-red-600
              text-white
              rounded-lg
            "
          >
            Rejected
          </button>

        </div>

        {/* Document Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredDocs.length === 0 && (
            <div className="text-gray-500">
              No documents found
            </div>
          )}

          {filteredDocs.map(
            (doc) => (

              <div
                key={doc.id}
                className="
                  bg-white
                  rounded-xl
                  shadow-lg
                  p-5
                  border
                "
              >
<h3
  className="
    text-xl
    font-bold
    mb-4
    break-all
  "
>
  {doc.file_name}
</h3>

                <p className="mb-4">

                  Status:

                 <span
  className={`
    ml-2
    px-3
    py-1
    rounded-full
    text-white
    ${
      doc.status === "Signed"
        ? "bg-green-500"
        : doc.status === "Rejected"
        ? "bg-red-500"
        : "bg-yellow-500"
    }
  `}
>
                    {doc.status ||
                      "Pending"}
                  </span>

                </p>

                <div className="flex flex-col gap-3">

                  <a
                    href={`https://document-signature-app-lgxn.onrender.com/${doc.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      text-blue-600
                      hover:underline
                    "
                  >
                    📄 Open PDF
                  </a>
{(doc.status || "Pending") === "Pending" && (
  <button
    onClick={() =>
      setSelectedDocument(doc)
    }
    className="
      bg-blue-500
      hover:bg-blue-600
      text-white
      px-4
      py-2
      rounded-lg
    "
  >
    ✍ Sign PDF
  </button>
)}
{(doc.status || "Pending") === "Pending" && (
  <button
    onClick={() =>
      handleReject(doc.id)
    }
    className="
      bg-red-600
      hover:bg-red-700
      text-white
      px-4
      py-2
      rounded-lg
    "
  >
    ❌ Reject Document
  </button>
)}

                  {/* FIXED DOWNLOAD LINK */}

                 {doc.status === "Signed" && (
  <a
    href={`https://document-signature-app-lgxn.onrender.com/uploads/signed-${doc.id}.pdf`}
    target="_blank"
    rel="noreferrer"
    className="
      text-green-600
      hover:underline
    "
  >
    ⬇ Download Signed PDF
  </a>
)}

                  <button
                    onClick={() =>
                      handleDelete(doc.id)
                    }
                    className="
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    🗑 Delete Document
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {/* PDF Editor */}

        {selectedDocument && (

          <div className="mt-10">

            <PDFEditor
              document={
                selectedDocument
              }
            />

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;