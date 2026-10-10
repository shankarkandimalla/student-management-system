package com.studentmanagement.backend.service;

import com.studentmanagement.backend.entity.Attendance;
import com.studentmanagement.backend.entity.Student;
import com.studentmanagement.backend.exception.AttendanceNotFoundException;
import com.studentmanagement.backend.repository.AttendanceRepository;
import com.studentmanagement.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {

        return attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new AttendanceNotFoundException(id)
                );
    }

    public Attendance addAttendance(
            Long studentId,
            Attendance attendance) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with ID: "
                                        + studentId
                        )
                );

        attendance.setStudent(student);

        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(
            Long id,
            Attendance updatedAttendance) {

        Attendance existingAttendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new AttendanceNotFoundException(id)
                        );

        existingAttendance.setSubject(
                updatedAttendance.getSubject()
        );

        existingAttendance.setAttendanceDate(
                updatedAttendance.getAttendanceDate()
        );

        existingAttendance.setStatus(
                updatedAttendance.getStatus()
        );

        return attendanceRepository.save(
                existingAttendance
        );
    }

    public List<Attendance> getMyAttendance(
            String email) {

        return attendanceRepository
                .findByStudentUserEmail(email);
    }
}