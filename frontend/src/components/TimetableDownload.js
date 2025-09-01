import React from "react";
import { downloadExcel, downloadPDF } from "../services/api";

export default function TimetableDownload() {
  const handleDownload = async (type) => {
    if (type === "excel") await downloadExcel();
    else await downloadPDF();
  };

  return (
    <div className="mt-6 space-x-4">
      <button
        onClick={() => handleDownload("excel")}
        className="px-6 py-2 bg-green-600 text-white rounded-lg"
      >
        Download Excel
      </button>
      <button
        onClick={() => handleDownload("pdf")}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Download PDF
      </button>
    </div>
  );
}
