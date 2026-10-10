package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.entity.Marks;
import com.studentmanagement.backend.service.MarksService;
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
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(
            MarksService marksService) {

        this.marksService = marksService;
    }

    @GetMapping
    public List<Marks> getAllMarks() {

        return marksService.getAllMarks();
    }

    @GetMapping("/{id}")
    public Marks getMarksById(
            @PathVariable Long id) {

        return marksService.getMarksById(id);
    }

    @PostMapping
    public ResponseEntity<Marks> addMarks(
            @RequestParam Long studentId,
            @Valid
            @RequestBody Marks marks) {

        Marks savedMarks = marksService.addMarks(
                studentId,
                marks
        );

        return new ResponseEntity<>(
                savedMarks,
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public Marks updateMarks(
            @PathVariable Long id,
            @Valid
            @RequestBody Marks marks) {

        return marksService.updateMarks(
                id,
                marks
        );
    }

    @GetMapping("/my-marks")
    public List<Marks> getMyMarks(
            Authentication authentication) {

        String email = authentication.getName();

        return marksService.getMyMarks(email);
    }
}