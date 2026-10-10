package com.studentmanagement.backend.repository;
import java.util.Optional;
import com.studentmanagement.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
Optional<Student> findByUserEmail(String email);
}