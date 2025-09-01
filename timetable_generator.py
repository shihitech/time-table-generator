import random
import pandas as pd

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
PERIODS = [7, 7, 7, 7, 7, 6]  # Saturday has 6 periods

def generate_timetable(data):
    teachers = data["teachers"]   # list of dicts: {name, subject, load}
    classes = data["classes"]     # list of class names (sheet names)

    teacher_load = {t["name"]: t["load"] for t in teachers}
    subjects = {t["name"]: t["subject"] for t in teachers}

    # initialize empty timetables
    class_timetable = {
        c: {day: ["" for _ in range(p)] for day, p in zip(DAYS, PERIODS)} 
        for c in classes
    }
    teacher_timetable = {
        t["name"]: {day: ["" for _ in range(p)] for day, p in zip(DAYS, PERIODS)} 
        for t in teachers
    }

    # assignment loop
    for c in classes:
        for day, num_periods in zip(DAYS, PERIODS):
            for p in range(num_periods):

                # pick teachers with remaining load
                available_teachers = [
                    t for t in teachers 
                    if teacher_load[t["name"]] > 0 and teacher_timetable[t["name"]][day][p] == ""
                ]

                if not available_teachers:
                    continue  # leave blank if no teacher available

                # sort by remaining load (so high-load teachers get priority)
                available_teachers.sort(key=lambda x: teacher_load[x["name"]], reverse=True)

                # pick one (weighted by load to spread fairly)
                teacher = random.choice(available_teachers[:3]) if len(available_teachers) > 3 else random.choice(available_teachers)

                tname, subj = teacher["name"], teacher["subject"]

                # assign
                class_timetable[c][day][p] = f"{subj} ({tname})"
                teacher_timetable[tname][day][p] = f"{subj} ({c})"
                teacher_load[tname] -= 1

    return {"classTimetable": class_timetable, "teacherTimetable": teacher_timetable}
