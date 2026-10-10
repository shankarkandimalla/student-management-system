package com.studentmanagement.backend.exception;

public class MarksNotFoundException
        extends RuntimeException {

    public MarksNotFoundException(Long id) {

        super(
                "Marks record not found with ID: "
                        + id
        );
    }
}