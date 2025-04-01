const teachers = [
    { name: "Mr. Smith", schedule: [{ time: "8:00 AM", class: "Math", absent: false, replacement: null }] },
    { name: "Ms. Johnson", schedule: [{ time: "9:00 AM", class: "Biology", absent: false, replacement: null }] },
    { name: "Mr. Brown", schedule: [{ time: "10:00 AM", class: "English", absent: false, replacement: null }] },
    { name: "Ms. Wilson", schedule: [{ time: "11:00 AM", class: "History", absent: false, replacement: null }] },
    { name: "Mr. Taylor", schedule: [{ time: "8:00 AM", class: "Physics", absent: false, replacement: null }] },
    { name: "Ms. Martinez", schedule: [{ time: "9:00 AM", class: "Spanish", absent: false, replacement: null }] }
];

// Update the schedule display for teachers
function generateSchedule() {
    const scheduleTable = document.getElementById('schedule').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = "";

    teachers.forEach((teacher, teacherIndex) => {
        teacher.schedule.forEach((session, sessionIndex) => {
            const row = document.createElement('tr');
            row.classList.add(session.absent ? 'absent' : 'available');

            const teacherCell = document.createElement('td');
            teacherCell.innerText = teacher.name;
            row.appendChild(teacherCell);

            const timeCell = document.createElement('td');
            timeCell.innerText = session.time;
            row.appendChild(timeCell);

            const classCell = document.createElement('td');
            classCell.innerText = session.class;
            row.appendChild(classCell);

            const statusCell = document.createElement('td');
            statusCell.innerText = session.absent ? 'Absent' : 'Present';
            row.appendChild(statusCell);

            const actionsCell = document.createElement('td');
            const presentBtn = document.createElement('button');
            presentBtn.classList.add('present-btn');
            presentBtn.innerText = "Present";
            presentBtn.addEventListener('click', () => {
                updateAbsence(teacherIndex, sessionIndex, false);
                updatePresentTeachers();
            });

            const absentBtn = document.createElement('button');
            absentBtn.classList.add('absent-btn');
            absentBtn.innerText = "Absent";
            absentBtn.addEventListener('click', () => {
                updateAbsence(teacherIndex, sessionIndex, true);
                updatePresentTeachers();
            });

            actionsCell.appendChild(presentBtn);
            actionsCell.appendChild(absentBtn);
            row.appendChild(actionsCell);

            const replacementCell = document.createElement('td');
            replacementCell.innerText = session.replacement ? session.replacement : "-";
            row.appendChild(replacementCell);

            scheduleTable.appendChild(row);
        });
    });
}

// Update the attendance status and replacement for teachers
function updateAbsence(teacherIndex, sessionIndex, isAbsent) {
    teachers[teacherIndex].schedule[sessionIndex].absent = isAbsent;
    teachers[teacherIndex].schedule[sessionIndex].replacement = null;

    if (isAbsent) {
        assignReplacement(teacherIndex, sessionIndex);
    }

    generateSchedule();
}

// Assign a replacement teacher if the teacher is absent
function assignReplacement(absentTeacherIndex, absentSessionIndex) {
    const absentTeacher = teachers[absentTeacherIndex];
    const sessionTime = absentTeacher.schedule[absentSessionIndex].time;
    const subject = absentTeacher.schedule[absentSessionIndex].class;

    // Find a replacement teacher who is free at the same time
    for (let i = 0; i < teachers.length; i++) {
        if (i !== absentTeacherIndex) {
            const availableTeacher = teachers[i];
            const freeSession = availableTeacher.schedule.find(session => !session.absent && session.time === sessionTime);

            if (freeSession) {
                absentTeacher.schedule[absentSessionIndex].replacement = availableTeacher.name;
                break;
            }
        }
    }
}

// Update the list of present teachers
function updatePresentTeachers() {
    const presentTeachersList = document.getElementById("present-teachers-list");
    presentTeachersList.innerHTML = "";

    teachers.forEach(teacher => {
        const presentSessions = teacher.schedule.filter(session => !session.absent);
        if (presentSessions.length > 0) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${teacher.name}</strong>: ${presentSessions.map(session => `${session.time} - ${session.class}`).join(", ")}`;
            presentTeachersList.appendChild(listItem);
        }
    });

    // Update the absent teachers list
    updateAbsentTeachers();
}

// Update the list of absent teachers
function updateAbsentTeachers() {
    const absentTeachersList = document.getElementById("absent-teachers-list");
    absentTeachersList.innerHTML = "";

    teachers.forEach(teacher => {
        const absentSessions = teacher.schedule.filter(session => session.absent);
        if (absentSessions.length > 0) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${teacher.name}</strong>: ${absentSessions.map(session => `${session.time} - ${session.class}`).join(", ")}`;
            absentTeachersList.appendChild(listItem);
        }
    });
}

// Initialize the schedule and start with empty Present and Absent lists
generateSchedule();
document.getElementById("present-teachers-list").innerHTML = "";
document.getElementById("absent-teachers-list").innerHTML = "";
