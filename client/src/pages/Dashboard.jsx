import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [documents, setDocuments] =
    useState([]);

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
                  `Bearer ${token}`
              }
            }
          );

        setDocuments(
          response.data
        );

      } catch (error) {
        console.log(error);
      }
    };

return (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">
      My Documents
    </h1>

    {documents.map((doc) => (
      <div
        key={doc.id}
        className="border p-4 rounded-lg shadow mb-4"
      >
        <h3 className="font-semibold text-lg">
          {doc.file_name}
        </h3>

        <a
          href={`http://localhost:5000/${doc.file_path}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          Open PDF
        </a>
      </div>
    ))}
  </div>
);
}

export default Dashboard;