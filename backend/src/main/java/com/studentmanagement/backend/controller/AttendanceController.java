package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.entity.Attendance;
import com.studentmanagement.backend.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    @GetMapping("/{id}")
    public Attendance getAttendanceById(
            @PathVariable Long id) {

        return attendanceService.getAttendanceById(id);
    }

    @PostMapping
    public ResponseEntity<Attendance> addAttendance(
            @RequestParam Long studentId,
            @Valid
            @RequestBody Attendance attendance) {

        Attendance savedAttendance =
                attendanceService.addAttendance(
                        studentId,
                        attendance
                );

        return new ResponseEntity<>(
                savedAttendance,
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @Valid
            @RequestBody Attendance attendance) {

        return attendanceService.updateAttendance(
                id,
                attendance
        );
    }

    @GetMapping("/my-attendance")
    public List<Attendance> getMyAttendance(
            Authentication authentication) {

        String email = authentication.getName();

        return attendanceService.getMyAttendance(email);
    }
}