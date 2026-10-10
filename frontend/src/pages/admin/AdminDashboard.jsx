
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import studentService from "../../services/studentService";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);

  const [formData, setFormData] = useState({
    rollNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    year: "",
    section: "",
  });

  const resetForm = () => {
    setFormData({
      rollNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      department: "",
      year: "",
      section: "",
    });

    setIsEditing(false);
    setEditingStudentId(null);
  };

  const loadStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await studentService.getAllStudents();
      setStudents(response);
    } catch (error) {
      console.error("Error loading students:", error);
      setError("Unable to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOpenAddForm = () => {
    resetForm();
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setFormData({
      rollNumber: student.rollNumber ?? "",
      firstName: student.firstName ?? "",
      lastName: student.lastName ?? "",
      email: student.email ?? "",
      phoneNumber: student.phoneNumber ?? "",
      department: student.department ?? "",
      year: student.year == null ? "" : String(student.year),
      section: student.section ?? "",
    });

    setEditingStudentId(student.id);
    setIsEditing(true);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const studentData = {
      ...formData,
      year: Number(formData.year),
    };

    try {
      await studentService.addStudent(studentData);
      setMessage("Student added successfully.");
      resetForm();
      setShowForm(false);
      await loadStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      setError(
        error.response?.data?.message ||
          "Unable to add student. Check the entered details."
      );
    }
  };

  const handleUpdateStudent = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const studentData = {
      ...formData,
      year: Number(formData.year),
    };

    try {
      await studentService.updateStudent(editingStudentId, studentData);
      setMessage("Student updated successfully.");
      resetForm();
      setShowForm(false);
      await loadStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      setError(
        error.response?.data?.message ||
          "Unable to update student. Check the entered details."
      );
    }
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await studentService.deleteStudent(id);
      setMessage("Student deleted successfully.");
      await loadStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Unable to delete student.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">STUDENT MANAGEMENT SYSTEM</p>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            Manage student records and keep student information up to date.
          </p>
        </div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <section className="admin-summary-grid">
        <div className="admin-summary-card">
          <div className="admin-summary-icon">S</div>
          <div>
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="admin-summary-card">
          <div className="admin-summary-icon">D</div>
          <div>
            <p>Departments</p>
            <h2>
              {new Set(
                students
                  .map((student) => student.department)
                  .filter(Boolean)
              ).size}
            </h2>
          </div>
        </div>

        <div className="admin-summary-card">
          <div className="admin-summary-icon">Y</div>
          <div>
            <p>Academic Years</p>
            <h2>
              {new Set(
                students
                  .map((student) => student.year)
                  .filter((year) => year != null && year !== "")
              ).size}
            </h2>
          </div>
        </div>
      </section>

      {message && (
        <div className="admin-alert admin-alert-success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          {error}
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Student Management</h2>
            <p>Add, edit, view, and remove student records.</p>
          </div>

          <div className="admin-toolbar">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={loadStudents}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Students"}
            </button>

            <button
              type="button"
              className="admin-primary-button"
              onClick={handleOpenAddForm}
              disabled={showForm && !isEditing}
            >
              + Add Student
            </button>
          </div>
        </div>

        {showForm && (
          <form
            className="admin-student-form"
            onSubmit={isEditing ? handleUpdateStudent : handleAddStudent}
          >
            <div className="admin-form-heading">
              <div>
                <h3>{isEditing ? "Edit Student" : "Add New Student"}</h3>
                <p>Enter the student's details below.</p>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label htmlFor="rollNumber">Roll Number</label>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="year">Year</label>
                <input
                  id="year"
                  type="number"
                  name="year"
                  min="1"
                  max="4"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="section">Section</label>
                <input
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-button">
                {isEditing ? "Update Student" : "Save Student"}
              </button>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={handleCancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="admin-list-heading">
          <div>
            <h3>Student List</h3>
            <p>
              {students.length} student{students.length === 1 ? "" : "s"}{" "}
              registered
            </p>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No students found</h3>
            <p>Add a student to see their information here.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>
                      <span className="admin-roll-number">
                        {student.rollNumber}
                      </span>
                    </td>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.email}</td>
                    <td>{student.phoneNumber}</td>
                    <td>{student.department}</td>
                    <td>{student.year}</td>
                    <td>{student.section}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
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
    </div>
  );
}

export default AdminDashboard;
