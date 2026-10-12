
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import studentService from "../../services/studentService";
import "./FacultyDashboard.css";

const API_URL = "http://localhost:8080";

function FacultyDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get the JWT stored after login.
  const getToken = () => {
  const storedUser = localStorage.getItem("user");

  if (storedUser === null) {
    return null;
  }

  const user = JSON.parse(storedUser);
  return user.token;
};

  const loadStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await studentService.getAllStudents();
      setStudents(response);
    } catch (error) {
      console.error("Error loading students:", error);
      setError("Unable to load students. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    setRequestsLoading(true);
    setRequestMessage("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/api/requests/students`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load pending requests.");
      }

      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error("Error loading pending requests:", error);
      setRequestMessage("Unable to load pending student requests.");
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    loadPendingRequests();
  }, []);

  const handleRequest = async (studentId, action) => {
    const actionText = action === "approve" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} this student registration?`
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(studentId);
    setRequestMessage("");

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/requests/students/${studentId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Failed to ${actionText} registration.`);
      }

      setRequestMessage(
        `Student registration ${action === "approve" ? "approved" : "rejected"} successfully.`
      );

      await loadPendingRequests();
      await loadStudents();
    } catch (error) {
      console.error(`Error trying to ${actionText} student:`, error);
      setRequestMessage(
        error.message || `Unable to ${actionText} this registration.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const departments = [
    ...new Set(
      students
        .map((student) => student.department)
        .filter((department) => department)
    ),
  ].sort();

  const sections = [
    ...new Set(
      students
        .map((student) => student.section)
        .filter((section) => section)
    ),
  ].sort();

  const filteredStudents = students.filter((student) => {
    const searchValue = searchTerm.toLowerCase().trim();

    const fullName =
      `${student.firstName || ""} ${student.lastName || ""}`
        .toLowerCase()
        .trim();

    const matchesSearch =
      fullName.includes(searchValue) ||
      (student.rollNumber || "").toLowerCase().includes(searchValue) ||
      (student.email || "").toLowerCase().includes(searchValue);

    const matchesDepartment =
      departmentFilter === "" ||
      student.department === departmentFilter;

    const matchesYear =
      yearFilter === "" || String(student.year) === yearFilter;

    const matchesSection =
      sectionFilter === "" || student.section === sectionFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesYear &&
      matchesSection
    );
  });

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setYearFilter("");
    setSectionFilter("");
  };

  return (
    <div className="faculty-dashboard">
      <header className="faculty-header">
        <div className="faculty-brand">
          <div className="faculty-brand-icon">SC</div>
          <div>
            <h1>Faculty Portal</h1>
            <p>Student Management System</p>
          </div>
        </div>

        <button className="faculty-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="faculty-main">
        <section className="faculty-welcome">
          <div>
            <p className="faculty-eyebrow">FACULTY WORKSPACE</p>
            <h2>Faculty Dashboard</h2>
            <p>Manage student information and academic records.</p>
          </div>
        </section>

        <section className="faculty-actions">
          <button
            className="faculty-action-button"
            onClick={() => navigate("/faculty/attendance")}
          >
            <span className="faculty-action-icon">A</span>
            <span>
              <strong>Attendance Management</strong>
              <small>View and record attendance</small>
            </span>
          </button>

          <button
            className="faculty-action-button"
            onClick={() => navigate("/faculty/marks")}
          >
            <span className="faculty-action-icon marks-action-icon">M</span>
            <span>
              <strong>Marks Management</strong>
              <small>View and record exam marks</small>
            </span>
          </button>
        </section>

        {/* Pending student registration requests */}
        <section className="faculty-card">
          <div className="faculty-section-heading">
            <div>
              <h2>Pending Student Requests</h2>
              <p>Review student registrations and approve or reject them.</p>
            </div>

            <button
              className="faculty-secondary-button"
              onClick={loadPendingRequests}
              disabled={requestsLoading}
            >
              {requestsLoading ? "Refreshing..." : "Refresh Requests"}
            </button>
          </div>

          {requestMessage && (
            <div className="faculty-request-message" role="status">
              {requestMessage}
            </div>
          )}

          {requestsLoading ? (
            <div className="faculty-message">
              Loading pending requests...
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="faculty-message">
              No pending student registration requests.
            </div>
          ) : (
            <div className="faculty-table-wrapper">
              <table className="faculty-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.email}</td>
                      <td>
                        <span className="faculty-pending-status">
                          PENDING
                        </span>
                      </td>
                      <td>
                        <div className="faculty-request-actions">
                          <button
                            className="faculty-approve-button"
                            onClick={() =>
                              handleRequest(request.id, "approve")
                            }
                            disabled={processingId !== null}
                          >
                            {processingId === request.id
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            className="faculty-reject-button"
                            onClick={() =>
                              handleRequest(request.id, "reject")
                            }
                            disabled={processingId !== null}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="faculty-stat-card">
          <div className="faculty-stat-icon">S</div>
          <div>
            <p>Total Students</p>
            <strong>{students.length}</strong>
            <span>Registered student records</span>
          </div>
        </section>

        <section className="faculty-card">
          <div className="faculty-section-heading">
            <div>
              <h2>Student Management</h2>
              <p>Search and filter student records.</p>
            </div>

            <button
              className="faculty-secondary-button"
              onClick={loadStudents}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Students"}
            </button>
          </div>

          <div className="faculty-filter-grid">
            <div className="faculty-field faculty-search-field">
              <label htmlFor="studentSearch">Search Students</label>
              <input
                id="studentSearch"
                type="text"
                placeholder="Name, roll number, or email"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="faculty-field">
              <label htmlFor="departmentFilter">Department</label>
              <select
                id="departmentFilter"
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="faculty-field">
              <label htmlFor="yearFilter">Academic Year</label>
              <select
                id="yearFilter"
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="faculty-field">
              <label htmlFor="sectionFilter">Section</label>
              <select
                id="sectionFilter"
                value={sectionFilter}
                onChange={(event) => setSectionFilter(event.target.value)}
              >
                <option value="">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="faculty-filter-footer">
            <p>
              Showing <strong>{filteredStudents.length}</strong> of{" "}
              <strong>{students.length}</strong> students
            </p>

            <button
              className="faculty-clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          {error && (
            <div className="faculty-error" role="alert">
              {error}
              <button onClick={loadStudents} disabled={loading}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="faculty-message">Loading students...</div>
          ) : error ? null : filteredStudents.length === 0 ? (
            <div className="faculty-message">
              No students match your search or filters.
            </div>
          ) : (
            <div className="faculty-table-wrapper">
              <table className="faculty-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.rollNumber}</td>
                      <td>
                        {student.firstName} {student.lastName}
                      </td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td>{student.section}</td>
                      <td>
                        <button
                          className="faculty-view-button"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedStudent && (
          <section className="faculty-card faculty-details-card">
            <div className="faculty-section-heading">
              <div>
                <h2>Student Details</h2>
                <p>Complete registered student information.</p>
              </div>

              <button
                className="faculty-secondary-button"
                onClick={() => setSelectedStudent(null)}
              >
                Close Details
              </button>
            </div>

            <div className="faculty-profile-grid">
              <div>
                <span>ID</span>
                <strong>{selectedStudent.id}</strong>
              </div>
              <div>
                <span>Roll Number</span>
                <strong>{selectedStudent.rollNumber}</strong>
              </div>
              <div>
                <span>Full Name</span>
                <strong>
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{selectedStudent.email}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{selectedStudent.phoneNumber}</strong>
              </div>
              <div>
                <span>Department</span>
                <strong>{selectedStudent.department}</strong>
              </div>
              <div>
                <span>Year</span>
                <strong>{selectedStudent.year}</strong>
              </div>
              <div>
                <span>Section</span>
                <strong>{selectedStudent.section}</strong>
              </div>
            </div>
          </section>
        )}

        <footer className="faculty-footer">
          Student Management System
        </footer>
      </main>
    </div>
  );
}

export default FacultyDashboard;
