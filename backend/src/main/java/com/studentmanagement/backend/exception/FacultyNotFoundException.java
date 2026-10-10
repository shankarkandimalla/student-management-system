package com.studentmanagement.backend.exception;

public class FacultyNotFoundException
        extends RuntimeException {

    public FacultyNotFoundException(Long id) {

        super(
                "Faculty not found with ID: "
                        + id
        );
    }
}