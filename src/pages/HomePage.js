import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadInput from "../components/UploadInput";
import { uploadFile, generateTimetable } from "../services/api";

export default function HomePage({ onGenerated }) {
  const [file, setFile] = useState(null);
  const [schoolName, setSchoolName] = useState("My School");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setError(null);
    setSuccess(null);

    try {
      let inputData = {};
      if (file) {
        inputData = await uploadFile(file);

        if (inputData.status === "error") {
          let msg = inputData.message || "File validation failed.";
          if (inputData.validationErrors && inputData.validationErrors.length > 0) {
            msg += "\n\nDetails:\n";
            inputData.validationErrors.forEach((err) => {
              msg += `- Sheet "${err.sheet}" is missing: ${err.missing_columns.join(", ")}\n`;
            });
          }
          setError(msg);
          return;
        }
      }

      const timetable = await generateTimetable({ 
        ...inputData,
        schoolName,
        academicYear 
      });

      if (timetable.status === "error") {
        setError(timetable.message || "Failed to generate timetable.");
        return;
      }

      setSuccess("Timetable generated successfully!");
      onGenerated(timetable);
      navigate("/timetable");

    } catch (err) {
      setError("Unexpected error: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">School Timetable Generator</h1>

      <UploadInput onFileSelect={setFile} />

      <div className="mt-4">
        <label className="block mb-1">School Name</label>
        <input 
          type="text" 
          value={schoolName} 
          onChange={(e) => setSchoolName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1">Academic Year</label>
        <input 
          type="text" 
          value={academicYear} 
          onChange={(e) => setAcademicYear(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button 
        onClick={handleGenerate}
        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg"
      >
        Generate Timetable
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg whitespace-pre-line">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
}
