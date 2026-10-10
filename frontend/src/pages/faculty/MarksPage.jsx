
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import studentService from "../../services/studentService";
import "./MarksPage.css";

function MarksPage() {
    const [marks, setMarks] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [subject, setSubject] = useState("");
    const [examType, setExamType] = useState("Mid-1");
    const [marksObtained, setMarksObtained] = useState("");
    const [maximumMarks, setMaximumMarks] = useState("100");
    const [semester, setSemester] = useState("5");
    const [message, setMessage] = useState("");

    async function loadData() {
        try {
            const studentData = await studentService.getAllStudents();
            setStudents(studentData);

            const response = await axiosInstance.get("/api/marks");
            setMarks(response.data);
            setMessage("");
        } catch (error) {
            console.error("Error loading marks:", error);
            setMessage("Failed to load marks.");
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function saveMarks(event) {
        event.preventDefault();
        setMessage("");

        if (
            !studentId ||
            !subject.trim() ||
            marksObtained === "" ||
            maximumMarks === "" ||
            !semester ||
            !examType.trim()
        ) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (
            Number(marksObtained) < 0 ||
            Number(maximumMarks) < 1 ||
            Number(marksObtained) > Number(maximumMarks)
        ) {
            setMessage(
                "Enter valid marks. Obtained marks cannot exceed maximum marks."
            );
            return;
        }

        try {
            await axiosInstance.post(
                `/api/marks?studentId=${studentId}`,
                {
                    subject: subject.trim(),
                    examType: examType.trim(),
                    marksObtained: Number(marksObtained),
                    maximumMarks: Number(maximumMarks),
                    semester: Number(semester)
                }
            );

            setMessage("Marks saved successfully.");
            setSubject("");
            setMarksObtained("");
            await loadData();
        } catch (error) {
            console.error("Error saving marks:", error);
            setMessage(
                "Failed to save marks. Check the fields and try again."
            );
        }
    }

    return (
        <div className="marks-page">
            <header className="marks-header">
                <div>
                    <p className="marks-eyebrow">
                        STUDENT MANAGEMENT SYSTEM
                    </p>
                    <h1>Marks Management</h1>
                    <p className="marks-subtitle">
                        Record student marks and review academic results.
                    </p>
                </div>
            </header>

            {message && (
                <div
                    className={`marks-message ${
                        message.includes("successfully")
                            ? "marks-success"
                            : "marks-error"
                    }`}
                    role="status"
                >
                    {message}
                </div>
            )}

            <section className="marks-panel">
                <div className="marks-panel-heading">
                    <div>
                        <h2>Add Marks</h2>
                        <p>Enter the student's assessment details.</p>
                    </div>
                </div>

                <form className="marks-form" onSubmit={saveMarks}>
                    <div className="marks-field">
                        <label htmlFor="marks-student">Student</label>
                        <select
                            id="marks-student"
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

                    <div className="marks-field">
                        <label htmlFor="marks-subject">Subject</label>
                        <input
                            id="marks-subject"
                            value={subject}
                            onChange={(event) =>
                                setSubject(event.target.value)
                            }
                            placeholder="Enter subject"
                            required
                        />
                    </div>

                    <div className="marks-field">
                        <label htmlFor="marks-exam-type">Exam Type</label>
                        <select
                            id="marks-exam-type"
                            value={examType}
                            onChange={(event) =>
                                setExamType(event.target.value)
                            }
                        >
                            <option value="Mid-1">Mid-1</option>
                            <option value="Mid-2">Mid-2</option>
                            <option value="Internal">Internal</option>
                            <option value="Semester">Semester</option>
                            <option value="Lab">Lab</option>
                        </select>
                    </div>

                    <div className="marks-field">
                        <label htmlFor="marks-obtained">Marks Obtained</label>
                        <input
                            id="marks-obtained"
                            type="number"
                            min="0"
                            value={marksObtained}
                            onChange={(event) =>
                                setMarksObtained(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="marks-field">
                        <label htmlFor="marks-maximum">Maximum Marks</label>
                        <input
                            id="marks-maximum"
                            type="number"
                            min="1"
                            value={maximumMarks}
                            onChange={(event) =>
                                setMaximumMarks(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="marks-field">
                        <label htmlFor="marks-semester">Semester</label>
                        <select
                            id="marks-semester"
                            value={semester}
                            onChange={(event) =>
                                setSemester(event.target.value)
                            }
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </div>

                    <div className="marks-form-actions">
                        <button
                            type="submit"
                            className="marks-primary-button"
                        >
                            Save Marks
                        </button>
                    </div>
                </form>
            </section>

            <section className="marks-panel">
                <div className="marks-panel-heading marks-records-heading">
                    <div>
                        <h2>Marks Records</h2>
                        <p>
                            {marks.length} record
                            {marks.length === 1 ? "" : "s"} available
                        </p>
                    </div>

                    <button
                        type="button"
                        className="marks-secondary-button"
                        onClick={loadData}
                    >
                        Refresh Records
                    </button>
                </div>

                <div className="marks-table-wrapper">
                    <table className="marks-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Subject</th>
                                <th>Exam Type</th>
                                <th>Obtained</th>
                                <th>Maximum</th>
                                <th>Semester</th>
                            </tr>
                        </thead>

                        <tbody>
                            {marks.map((record) => (
                                <tr key={record.id}>
                                    <td className="marks-student-name">
                                        {record.student?.firstName}{" "}
                                        {record.student?.lastName}
                                    </td>
                                    <td>{record.subject}</td>
                                    <td>{record.examType}</td>
                                    <td>{record.marksObtained}</td>
                                    <td>{record.maximumMarks}</td>
                                    <td>{record.semester}</td>
                                </tr>
                            ))}

                            {marks.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="marks-empty">
                                        No marks records found.
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

export default MarksPage;
