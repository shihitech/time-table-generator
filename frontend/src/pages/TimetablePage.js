import React from "react";
import TimetableGrid from "../components/TimetableGrid";
import TimetableDownload from "../components/TimetableDownload";

export default function TimetablePage({ timetable }) {
  if (!timetable) return <p>No timetable generated yet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Generated Timetable</h1>
      <TimetableGrid timetable={timetable.classTimetable} view="Class" />
      <TimetableGrid timetable={timetable.teacherTimetable} view="Teacher" />
      <TimetableDownload />
    </div>
  );
}
