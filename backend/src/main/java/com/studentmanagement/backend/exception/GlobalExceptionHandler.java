package com.studentmanagement.backend.exception;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<String> handleStudentNotFoundException(
            StudentNotFoundException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.NOT_FOUND
        );
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> handleValidationExceptions(
        MethodArgumentNotValidException exception) {

    Map<String, String> errors = new HashMap<>();

    exception.getBindingResult()
            .getFieldErrors()
            .forEach(error ->
                    errors.put(
                            error.getField(),
                            error.getDefaultMessage()
                    )
            );

    return new ResponseEntity<>(
            errors,
            HttpStatus.BAD_REQUEST
    );
}

@ExceptionHandler(FacultyNotFoundException.class)
public ResponseEntity<Map<String, String>>
handleFacultyNotFoundException(
        FacultyNotFoundException exception) {

    Map<String, String> error = new HashMap<>();

    error.put(
            "message",
            exception.getMessage()
    );

    return new ResponseEntity<>(
            error,
            HttpStatus.NOT_FOUND
    );
}

@ExceptionHandler(AttendanceNotFoundException.class)
public ResponseEntity<Map<String, String>>
handleAttendanceNotFoundException(
        AttendanceNotFoundException exception) {

    Map<String, String> error = new HashMap<>();

    error.put(
            "message",
            exception.getMessage()
    );

    return new ResponseEntity<>(
            error,
            HttpStatus.NOT_FOUND
    );
}

@ExceptionHandler(MarksNotFoundException.class)
public ResponseEntity<Map<String, String>>
handleMarksNotFoundException(
        MarksNotFoundException exception) {

    Map<String, String> error = new HashMap<>();

    error.put(
            "message",
            exception.getMessage()
    );

    return new ResponseEntity<>(
            error,
            HttpStatus.NOT_FOUND
    );
}

}