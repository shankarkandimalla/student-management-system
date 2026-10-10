package com.studentmanagement.backend.service;
import com.studentmanagement.backend.exception.StudentNotFoundException;
import com.studentmanagement.backend.entity.Student;
import com.studentmanagement.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import com.studentmanagement.backend.user.User;
import com.studentmanagement.backend.user.UserRepository;

import java.util.List;

@Service
public class StudentService {
    private final UserRepository userRepository;

    private final StudentRepository studentRepository;

   public StudentService(
        StudentRepository studentRepository,
        UserRepository userRepository) {

    this.studentRepository = studentRepository;
    this.userRepository = userRepository;
}

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student getStudentById(Long id) {
    return studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(id));
}
public Student updateStudent(Long id, Student updatedStudent) {

    Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(id));

    existingStudent.setRollNumber(updatedStudent.getRollNumber());
    existingStudent.setFirstName(updatedStudent.getFirstName());
    existingStudent.setLastName(updatedStudent.getLastName());
    existingStudent.setEmail(updatedStudent.getEmail());
    existingStudent.setPhoneNumber(updatedStudent.getPhoneNumber());
    existingStudent.setDepartment(updatedStudent.getDepartment());
    existingStudent.setYear(updatedStudent.getYear());
    existingStudent.setSection(updatedStudent.getSection());

    return studentRepository.save(existingStudent);
}
public void deleteStudent(Long id) {

    Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(id));

    studentRepository.delete(existingStudent);
}
public Student linkUserToStudent(
        Long studentId,
        String userEmail) {

    Student student = studentRepository.findById(studentId)
            .orElseThrow(() ->
                    new StudentNotFoundException(studentId)
            );

    User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() ->
                    new RuntimeException(
                            "User not found with email: " + userEmail
                    )
            );

    student.setUser(user);

    return studentRepository.save(student);
}
public Student getStudentProfile(String email) {

    return studentRepository.findByUserEmail(email)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Student profile not found"
                    )
            );
}
}