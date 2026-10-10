package com.studentmanagement.backend.controller;
import jakarta.validation.Valid;
import com.studentmanagement.backend.entity.Student;
import com.studentmanagement.backend.service.StudentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
public Student addStudent(@Valid @RequestBody Student student) {
    return studentService.addStudent(student);
}

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

   @PutMapping("/{id}")
public Student updateStudent(
        @PathVariable Long id,
        @Valid @RequestBody Student updatedStudent) {

    return studentService.updateStudent(id, updatedStudent);
}


@DeleteMapping("/{id}")
public String deleteStudent(@PathVariable Long id) {

    studentService.deleteStudent(id);

    return "Student deleted successfully";
}

@PutMapping("/{studentId}/link-user")
public Student linkUserToStudent(
        @PathVariable Long studentId,
        @RequestParam String email) {

    return studentService.linkUserToStudent(
            studentId,
            email
    );
}

@GetMapping("/profile")
public Student getStudentProfile(
        Authentication authentication) {

    String email = authentication.getName();

    return studentService.getStudentProfile(email);
}

}