import React from "react";

export default function UploadInput({ onFileSelect }) {
  return (
    <div>
      <label className="block mb-2 font-semibold">Upload Excel (Teachers + Classes)</label>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
