import { useEffect, useState } from "react";
import axios from "axios";
import PDFEditor from "../components/PDFEditor";

function Dashboard() {
  const [documents, setDocuments] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            "http://localhost:5000/api/docs",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setDocuments(
          response.data
        );

      } catch (error) {
        console.log(error);
      }
    };

  const filteredDocs =
    filter === "All"
      ? documents
      : documents.filter(
          (doc) =>
            doc.status === filter
        );

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-4">
        My Documents
      </h1>

      <p className="mb-6 text-gray-600">
        Total Documents:
        <span className="font-bold ml-2">
          {filteredDocs.length}
        </span>
      </p>

      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={() =>
            setFilter("All")
          }
          className="
            px-4 py-2
            bg-gray-500
            text-white
            rounded
          "
        >
          All
        </button>

        <button
          onClick={() =>
            setFilter("Pending")
          }
          className="
            px-4 py-2
            bg-yellow-500
            text-white
            rounded
          "
        >
          Pending
        </button>

        <button
          onClick={() =>
            setFilter("Signed")
          }
          className="
            px-4 py-2
            bg-green-600
            text-white
            rounded
          "
        >
          Signed
        </button>

        <button
          onClick={() =>
            setFilter("Rejected")
          }
          className="
            px-4 py-2
            bg-red-600
            text-white
            rounded
          "
        >
          Rejected
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {filteredDocs.length === 0 && (
          <div className="p-4 text-gray-500">
            No documents found
          </div>
        )}

        {filteredDocs.map(
          (doc) => (
            <div
              key={doc.id}
              className="
                border
                rounded-xl
                shadow-lg
                p-5
                bg-white
              "
            >
              <h3 className="text-xl font-semibold mb-3">
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
                    text-sm
                    ${
                      doc.status ===
                      "Signed"
                        ? "bg-green-500"
                        : doc.status ===
                          "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }
                  `}
                >
                  {doc.status ||
                    "Pending"}
                </span>

              </p>

              <a
                href={`http://localhost:5000/${doc.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="
                  text-blue-600
                  hover:underline
                "
              >
                Open PDF
              </a>

            </div>
          )
        )}

      </div>

      <div className="mt-8">
        <PDFEditor />
      </div>

    </div>
  );
}

export default Dashboard;