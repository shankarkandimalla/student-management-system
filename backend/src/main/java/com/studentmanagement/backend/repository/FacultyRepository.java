package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyRepository
        extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByUserEmail(String email);
}