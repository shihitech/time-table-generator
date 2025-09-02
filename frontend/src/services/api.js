const BASE_URL = "https://time-table-generator-vrwe.onrender.com/";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function generateTimetable(data) {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function downloadExcel() {
  const res = await fetch(`${BASE_URL}/download/excel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "timetable.xlsx";
  a.click();
}

export async function downloadPDF() {
  const res = await fetch(`${BASE_URL}/download/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "timetable.pdf";
  a.click();
}
