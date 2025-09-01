import React from "react";

export default function TimetableGrid({ timetable, view }) {
  return (
    <div className="my-6">
      <h2 className="text-lg font-bold mb-2">{view}-wise Timetable</h2>
      {Object.keys(timetable).map((entity) => (
        <div key={entity} className="mb-6">
          <h3 className="font-semibold mb-2">{entity}</h3>
          <table className="border-collapse border w-full text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Day</th>
                {timetable[entity]["Monday"].map((_, idx) => (
                  <th key={idx} className="border px-2 py-1">P{idx+1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(timetable[entity]).map((day) => (
                <tr key={day}>
                  <td className="border px-2 py-1 font-medium">{day}</td>
                  {timetable[entity][day].map((period, idx) => (
                    <td key={idx} className="border px-2 py-1">{period}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
