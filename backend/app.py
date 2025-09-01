import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from timetable_generator import generate_timetable

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return {"status": "ok", "message": "Timetable Generator Backend Running"}


@app.route("/upload", methods=["POST"])
def upload():
    try:
        file = request.files["file"]
        df = pd.read_excel(file, sheet_name=None)  # multiple sheets

        teachers = []
        classes = list(df.keys())
        errors = []  # collect validation issues

        for sheet, data in df.items():
            # Normalize column names (case-insensitive + strip spaces)
            data.columns = [str(c).strip().lower() for c in data.columns]

            required_cols = {"teacher", "subject", "weekly_load"}
            available_cols = set(data.columns)

            if required_cols.issubset(available_cols):
                # Keep only relevant columns
                clean_data = data[list(required_cols)]

                for _, row in clean_data.iterrows():
                    teachers.append({
                        "name": row["teacher"],
                        "subject": row["subject"],
                        "load": int(row["weekly_load"])
                    })
            else:
                missing = required_cols - available_cols
                errors.append(
                    {"sheet": sheet, "missing_columns": list(missing)}
                )

        if errors:
            return jsonify({
                "status": "error",
                "message": "Validation failed: required columns missing.",
                "validationErrors": errors
            }), 400

        return jsonify({
            "status": "success",
            "teachers": teachers,
            "classes": classes
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        timetable = generate_timetable(data)
        return jsonify(timetable)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/download/excel", methods=["POST"])
def download_excel():
    try:
        data = request.json
        timetable = generate_timetable(data)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            # Cover Page
            cover = pd.DataFrame(
                [[data.get("schoolName", "School"), data.get("academicYear", "2025-26")]],
                columns=["School", "Academic Year"]
            )
            cover.to_excel(writer, sheet_name="Cover Page", index=False)

            # Class-wise sheets
            for c, schedule in timetable["classTimetable"].items():
                df = pd.DataFrame(schedule)
                df.to_excel(writer, sheet_name=f"Class_{c}", index=False)

            # Teacher-wise sheets
            for t, schedule in timetable["teacherTimetable"].items():
                df = pd.DataFrame(schedule)
                df.to_excel(writer, sheet_name=f"Teacher_{t}", index=False)

        output.seek(0)
        return send_file(output, as_attachment=True, download_name="timetable.xlsx")

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/download/pdf", methods=["POST"])
def download_pdf():
    try:
        data = request.json
        timetable = generate_timetable(data)

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)

        # Cover Page
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(300, 800, data.get("schoolName", "School Timetable"))
        c.setFont("Helvetica", 14)
        c.drawCentredString(300, 770, f"Academic Year: {data.get('academicYear', '2025-26')}")
        c.showPage()

        # Class-wise pages
        for c_name, schedule in timetable["classTimetable"].items():
            c.setFont("Helvetica-Bold", 14)
            c.drawString(50, 800, f"Class: {c_name}")
            y = 770
            for day, periods in schedule.items():
                c.setFont("Helvetica", 10)
                c.drawString(50, y, f"{day}: {periods}")
                y -= 15
            c.showPage()

        # Teacher-wise pages
        for t_name, schedule in timetable["teacherTimetable"].items():
            c.setFont("Helvetica-Bold", 14)
            c.drawString(50, 800, f"Teacher: {t_name}")
            y = 770
            for day, periods in schedule.items():
                c.setFont("Helvetica", 10)
                c.drawString(50, y, f"{day}: {periods}")
                y -= 15
            c.showPage()

        c.save()
        buffer.seek(0)
        return send_file(buffer, as_attachment=True, download_name="timetable.pdf")

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
