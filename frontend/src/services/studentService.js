
import axiosInstance from "../api/axiosInstance";

const getStudentProfile = async () => {
  const response = await axiosInstance.get(
    "/api/students/profile"
  );

  return response.data;
};

const getAllStudents = async () => {
  const response = await axiosInstance.get(
    "/api/students"
  );

  return response.data;
};

const getStudentById = async (id) => {
  const response = await axiosInstance.get(
    `/api/students/${id}`
  );

  return response.data;
};

const addStudent = async (student) => {
  const response = await axiosInstance.post(
    "/api/students",
    student
  );

  return response.data;
};

const updateStudent = async (id, student) => {
  const response = await axiosInstance.put(
    `/api/students/${id}`,
    student
  );

  return response.data;
};

const deleteStudent = async (id) => {
  const response = await axiosInstance.delete(
    `/api/students/${id}`
  );

  return response.data;
};

const studentService = {
  getStudentProfile: getStudentProfile,
  getAllStudents: getAllStudents,
  getStudentById: getStudentById,
  addStudent: addStudent,
  updateStudent: updateStudent,
  deleteStudent: deleteStudent,
};

export default studentService;
