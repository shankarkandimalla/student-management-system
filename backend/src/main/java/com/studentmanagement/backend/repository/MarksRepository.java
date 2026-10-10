package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarksRepository
        extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentUserEmail(
            String email
    );
}