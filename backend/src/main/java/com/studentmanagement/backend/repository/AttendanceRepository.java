package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentUserEmail(
            String email
    );
}