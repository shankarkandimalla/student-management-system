

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";



import authService from "../../services/authService";

import studentService from "../../services/studentService";

import axiosInstance from "../../api/axiosInstance";



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



  const [pendingFaculty, setPendingFaculty] = useState([]);

  const [facultyLoading, setFacultyLoading] = useState(false);

  const [facultyError, setFacultyError] = useState("");

  const [facultyMessage, setFacultyMessage] = useState("");

  const [processingFacultyId, setProcessingFacultyId] = useState(null);

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);



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



  const loadPendingFaculty = async () => {

    setFacultyLoading(true);

    setFacultyError("");



    try {

      const response = await axiosInstance.get(

        "/api/requests/faculty"

      );



      setPendingFaculty(

        Array.isArray(response.data) ? response.data : []

      );

    } catch (error) {

      console.error("Error loading pending faculty:", error);



      setFacultyError(

        error.response?.data?.message ||

          "Unable to load pending faculty requests."

      );

    } finally {

      setFacultyLoading(false);

    }

  };



  const handleFacultyRequest = async (facultyId, action) => {

    const actionLabel = action === "approve" ? "approve" : "reject";



    const confirmed = window.confirm(

      `Are you sure you want to ${actionLabel} this faculty registration?`

    );



    if (!confirmed) {

      return;

    }



    setFacultyError("");

    setFacultyMessage("");

    setProcessingFacultyId(facultyId);



    try {

      await axiosInstance.put(

        `/api/requests/faculty/${facultyId}/${action}`

      );



      setFacultyMessage(

        `Faculty registration ${actionLabel}d successfully.`

      );



      await loadPendingFaculty();

    } catch (error) {

      console.error("Error processing faculty request:", error);



      setFacultyError(

        error.response?.data?.message ||

          `Unable to ${actionLabel} faculty registration.`

      );

    } finally {

      setProcessingFacultyId(null);

    }

  };



  useEffect(() => {

    loadStudents();

    loadPendingFaculty();

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

      await studentService.updateStudent(

        editingStudentId,

        studentData

      );



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



  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    setAdminMessage("");
    setAdminError("");

    const email = adminEmail.trim().toLowerCase();

    if (!email) {
      setAdminError("Please enter an email address.");
      return;
    }
    if (adminPassword !== adminConfirmPassword) {
      setAdminError("Passwords do not match.");
      return;
    }
    if (adminPassword.length < 8) {
      setAdminError("Password must contain at least 8 characters.");
      return;
    }

    setAdminLoading(true);
    try {
      const response = await axiosInstance.post("/api/admin/users", {
        email: email,
        password: adminPassword,
      });
      setAdminMessage(
        response.data?.email
          ? `Admin account created successfully for ${response.data.email}.`
          : "Admin account created successfully."
      );
      setAdminEmail("");
      setAdminPassword("");
      setAdminConfirmPassword("");
      setShowAdminForm(false);
    } catch (error) {
      console.error("Error creating admin:", error);
      setAdminError(
        error.response?.data?.message ||
          "Unable to create admin account. Please check the details."
      );
    } finally {
      setAdminLoading(false);
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

          <p className="admin-eyebrow">

            STUDENT MANAGEMENT SYSTEM

          </p>



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

              {

                new Set(

                  students

                    .map((student) => student.department)

                    .filter(Boolean)

                ).size

              }

            </h2>

          </div>

        </div>



        <div className="admin-summary-card">

          <div className="admin-summary-icon">Y</div>

          <div>

            <p>Academic Years</p>

            <h2>

              {

                new Set(

                  students

                    .map((student) => student.year)

                    .filter((year) => year != null && year !== "")

                ).size

              }

            </h2>

          </div>

        </div>

      </section>



      {message && (

        <div

          className="admin-alert admin-alert-success"

          role="status"

        >

          {message}

        </div>

      )}



      {error && (

        <div

          className="admin-alert admin-alert-error"

          role="alert"

        >

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

            onSubmit={

              isEditing ? handleUpdateStudent : handleAddStudent

            }

          >

            <div className="admin-form-heading">

              <div>

                <h3>

                  {isEditing ? "Edit Student" : "Add New Student"}

                </h3>

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

              <button

                type="submit"

                className="admin-primary-button"

              >

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

              {students.length} student

              {students.length === 1 ? "" : "s"} registered

            </p>

          </div>

        </div>



        {loading ? (

          <div className="admin-empty-state">

            Loading students...

          </div>

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



      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Admin Account Management</h2>
            <p>Create another administrator account.</p>
          </div>
          <button
            type="button"
            className="admin-primary-button"
            onClick={() => {
              setShowAdminForm(!showAdminForm);
              setAdminError("");
              setAdminMessage("");
            }}
          >
            {showAdminForm ? "Cancel" : "+ Register New Admin"}
          </button>
        </div>

        {adminMessage && (
          <div className="admin-alert admin-alert-success" role="status">
            {adminMessage}
          </div>
        )}
        {adminError && (
          <div className="admin-alert admin-alert-error" role="alert">
            {adminError}
          </div>
        )}

        {showAdminForm && (
          <form className="admin-student-form" onSubmit={handleCreateAdmin}>
            <h3>Register New Admin</h3>
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label htmlFor="adminEmail">Admin Email</label>
                <input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="admin-form-field">
                <label htmlFor="adminPassword">Password</label>
                <input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="admin-form-field">
                <label htmlFor="adminConfirmPassword">Confirm Password</label>
                <input
                  id="adminConfirmPassword"
                  type="password"
                  value={adminConfirmPassword}
                  onChange={(event) => setAdminConfirmPassword(event.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-button" disabled={adminLoading}>
                {adminLoading ? "Creating Admin..." : "Create Admin"}
              </button>
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => {
                  setShowAdminForm(false);
                  setAdminError("");
                  setAdminMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>Pending Faculty Requests</h2>

            <p>

              Review faculty registrations and approve or reject them.

            </p>

          </div>



          <button

            type="button"

            className="admin-secondary-button"

            onClick={loadPendingFaculty}

            disabled={facultyLoading}

          >

            {facultyLoading ? "Refreshing..." : "Refresh Requests"}

          </button>

        </div>



        {facultyMessage && (

          <div

            className="admin-alert admin-alert-success"

            role="status"

          >

            {facultyMessage}

          </div>

        )}



        {facultyError && (

          <div

            className="admin-alert admin-alert-error"

            role="alert"

          >

            {facultyError}

          </div>

        )}



        {facultyLoading ? (

          <div className="admin-empty-state">

            Loading faculty requests...

          </div>

        ) : pendingFaculty.length === 0 ? (

          <div className="admin-empty-state">

            <h3>No pending faculty requests</h3>

            <p>

              New faculty registrations will appear here.

            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-student-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Email</th>

                  <th>Role</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>



              <tbody>

                {pendingFaculty.map((faculty) => (

                  <tr key={faculty.id}>

                    <td>{faculty.id}</td>

                    <td>{faculty.email}</td>

                    <td>{faculty.role}</td>

                    <td>{faculty.status}</td>

                    <td>

                      <div className="admin-row-actions">

                        <button

                          type="button"

                          className="admin-edit-button"

                          disabled={

                            processingFacultyId === faculty.id

                          }

                          onClick={() =>

                            handleFacultyRequest(

                              faculty.id,

                              "approve"

                            )

                          }

                        >

                          {processingFacultyId === faculty.id

                            ? "Processing..."

                            : "Approve"}

                        </button>



                        <button

                          type="button"

                          className="admin-delete-button"

                          disabled={

                            processingFacultyId === faculty.id

                          }

                          onClick={() =>

                            handleFacultyRequest(

                              faculty.id,

                              "reject"

                            )

                          }

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

    </div>

  );

}



export default AdminDashboard;
