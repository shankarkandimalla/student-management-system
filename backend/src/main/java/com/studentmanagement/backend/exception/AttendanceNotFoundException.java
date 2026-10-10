package com.studentmanagement.backend.exception;

public class AttendanceNotFoundException
        extends RuntimeException {

    public AttendanceNotFoundException(Long id) {

        super(
                "Attendance record not found with ID: "
                        + id
        );
    }
}