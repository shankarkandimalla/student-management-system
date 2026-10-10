
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";
import studentService from "../../services/studentService";
import axiosInstance from "../../api/axiosInstance";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const profileResponse =
          await studentService.getStudentProfile();

        setStudent(profileResponse);

        const attendanceResponse =
          await axiosInstance.get("/api/attendance/my-attendance");

        setAttendance(attendanceResponse.data);

        const marksResponse =
          await axiosInstance.get("/api/marks/my-marks");

        setMarks(marksResponse.data);
      } catch (error) {
        console.error("Student dashboard error:", error);
        setError(
          "Unable to load all student data. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="student-loading">
        <div className="student-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <header className="student-header">
        <div className="student-brand">
          <div className="student-brand-icon">SC</div>
          <div>
            <h1>Student Portal</h1>
            <p>Student Management System</p>
          </div>
        </div>

        <button
          className="student-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="student-main">
        <section className="student-welcome">
          <div>
            <p className="student-eyebrow">STUDENT PORTAL</p>
            <h2>My Dashboard</h2>
            <p className="student-subtitle">
              View your profile and academic records in one place.
            </p>
          </div>
        </section>

        {error && (
          <div className="student-error" role="alert">
            {error}
          </div>
        )}

        {student && (
          <section className="student-card">
            <div className="student-section-heading">
              <div className="student-heading-icon">ID</div>
              <div>
                <h2>My Profile</h2>
                <p>Your registered student information</p>
              </div>
            </div>

            <div className="student-profile-grid">
              <div className="student-profile-item">
                <span>Full Name</span>
                <strong>
                  {student.firstName} {student.lastName}
                </strong>
              </div>

              <div className="student-profile-item">
                <span>Roll Number</span>
                <strong>{student.rollNumber}</strong>
              </div>

              <div className="student-profile-item">
                <span>Email Address</span>
                <strong>{student.email}</strong>
              </div>

              <div className="student-profile-item">
                <span>Phone Number</span>
                <strong>{student.phoneNumber}</strong>
              </div>

              <div className="student-profile-item">
                <span>Department</span>
                <strong>{student.department}</strong>
              </div>

              <div className="student-profile-item">
                <span>Academic Year</span>
                <strong>{student.year}</strong>
              </div>

              <div className="student-profile-item">
                <span>Section</span>
                <strong>{student.section}</strong>
              </div>
            </div>
          </section>
        )}

        <section className="student-summary-grid">
          <div className="student-summary-card">
            <div className="student-summary-icon attendance-icon">
              A
            </div>
            <div>
              <p>Attendance Records</p>
              <strong>{attendance.length}</strong>
              <span>Recorded entries</span>
            </div>
          </div>

          <div className="student-summary-card">
            <div className="student-summary-icon marks-icon">
              M
            </div>
            <div>
              <p>Marks Records</p>
              <strong>{marks.length}</strong>
              <span>Recorded exam results</span>
            </div>
          </div>
        </section>

        <section className="student-card">
          <div className="student-section-heading">
            <div className="student-heading-icon attendance-heading">
              A
            </div>
            <div>
              <h2>My Attendance</h2>
              <p>Your attendance history</p>
            </div>
          </div>

          {attendance.length === 0 ? (
            <div className="student-empty-state">
              No attendance records found.
            </div>
          ) : (
            <div className="student-table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.subject}</td>
                      <td>{record.attendanceDate}</td>
                      <td>
                        <span
                          className={`student-status ${
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
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="student-card">
          <div className="student-section-heading">
            <div className="student-heading-icon marks-heading">
              M
            </div>
            <div>
              <h2>My Marks</h2>
              <p>Your examination results</p>
            </div>
          </div>

          {marks.length === 0 ? (
            <div className="student-empty-state">
              No marks records found.
            </div>
          ) : (
            <div className="student-table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Exam Type</th>
                    <th>Marks Obtained</th>
                    <th>Maximum Marks</th>
                    <th>Semester</th>
                  </tr>
                </thead>

                <tbody>
                  {marks.map((record) => (
                    <tr key={record.id}>
                      <td>{record.subject}</td>
                      <td>{record.examType}</td>
                      <td>{record.marksObtained}</td>
                      <td>{record.maximumMarks}</td>
                      <td>{record.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="student-footer">
          Student Management System
        </footer>
      </main>
    </div>
  );
}

export default StudentDashboard;
