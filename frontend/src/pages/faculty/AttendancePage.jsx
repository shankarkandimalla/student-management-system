
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import studentService from "../../services/studentService";
import "./AttendancePage.css";

function AttendancePage() {
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [subject, setSubject] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [status, setStatus] = useState("PRESENT");
    const [message, setMessage] = useState("");

    async function loadData() {
        try {
            const studentData = await studentService.getAllStudents();
            setStudents(studentData);

            const response = await axiosInstance.get("/api/attendance");
            setAttendance(response.data);

            setMessage("");
        } catch (error) {
            console.error("Error loading attendance data:", error);
            setMessage("Failed to load data. Please try again.");
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function markAttendance(event) {
        event.preventDefault();
        setMessage("");

        try {
            await axiosInstance.post(
                `/api/attendance?studentId=${studentId}`,
                {
                    subject: subject,
                    attendanceDate: attendanceDate,
                    status: status
                }
            );

            setMessage("Attendance marked successfully.");
            setSubject("");
            await loadData();
        } catch (error) {
            console.error("Error marking attendance:", error);
            setMessage(
                "Failed to mark attendance. Check the details and try again."
            );
        }
    }

    return (
        <div className="attendance-page">
            <header className="attendance-header">
                <div>
                    <p className="attendance-eyebrow">
                        STUDENT MANAGEMENT SYSTEM
                    </p>
                    <h1>Attendance Management</h1>
                    <p className="attendance-subtitle">
                        Mark attendance and review student attendance records.
                    </p>
                </div>
            </header>

            {message && (
                <div
                    className={`attendance-message ${
                        message.includes("successfully")
                            ? "attendance-success"
                            : "attendance-error"
                    }`}
                    role="status"
                >
                    {message}
                </div>
            )}

            <section className="attendance-panel">
                <div className="attendance-panel-heading">
                    <div>
                        <h2>Mark Attendance</h2>
                        <p>Enter the details to record student attendance.</p>
                    </div>
                </div>

                <form className="attendance-form" onSubmit={markAttendance}>
                    <div className="attendance-field attendance-student-field">
                        <label htmlFor="attendance-student">Student</label>
                        <select
                            id="attendance-student"
                            value={studentId}
                            onChange={(event) =>
                                setStudentId(event.target.value)
                            }
                            required
                        >
                            <option value="">Select Student</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName} -{" "}
                                    {student.rollNumber}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="attendance-field">
                        <label htmlFor="attendance-subject">Subject</label>
                        <input
                            id="attendance-subject"
                            value={subject}
                            onChange={(event) =>
                                setSubject(event.target.value)
                            }
                            placeholder="Enter subject"
                            required
                        />
                    </div>

                    <div className="attendance-field">
                        <label htmlFor="attendance-date">Date</label>
                        <input
                            id="attendance-date"
                            type="date"
                            value={attendanceDate}
                            onChange={(event) =>
                                setAttendanceDate(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="attendance-field">
                        <label htmlFor="attendance-status">Status</label>
                        <select
                            id="attendance-status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                        >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                        </select>
                    </div>

                    <div className="attendance-form-actions">
                        <button
                            type="submit"
                            className="attendance-primary-button"
                        >
                            Save Attendance
                        </button>
                    </div>
                </form>
            </section>

            <section className="attendance-panel">
                <div className="attendance-panel-heading attendance-records-heading">
                    <div>
                        <h2>Attendance Records</h2>
                        <p>
                            {attendance.length} record
                            {attendance.length === 1 ? "" : "s"} available
                        </p>
                    </div>

                    <button
                        type="button"
                        className="attendance-secondary-button"
                        onClick={loadData}
                    >
                        Refresh Records
                    </button>
                </div>

                <div className="attendance-table-wrapper">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {attendance.map((record) => (
                                <tr key={record.id}>
                                    <td className="attendance-student-name">
                                        {record.student?.firstName}{" "}
                                        {record.student?.lastName}
                                    </td>
                                    <td>{record.subject}</td>
                                    <td>{record.attendanceDate}</td>
                                    <td>
                                        <span
                                            className={`attendance-status ${
                                                record.status === "PRESENT"
                                                    ? "status-present"
                                                    : "status-absent"
                                            }`}
                                        >
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {attendance.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="attendance-empty"
                                    >
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default AttendancePage;
