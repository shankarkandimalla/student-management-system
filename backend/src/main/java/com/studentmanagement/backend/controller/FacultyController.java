package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.entity.Faculty;
import com.studentmanagement.backend.service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(
            FacultyService facultyService) {

        this.facultyService = facultyService;
    }

    @GetMapping
    public List<Faculty> getAllFaculty() {

        return facultyService.getAllFaculty();
    }

    @GetMapping("/{id}")
    public Faculty getFacultyById(
            @PathVariable Long id) {

        return facultyService.getFacultyById(id);
    }

    @PostMapping
    public ResponseEntity<Faculty> addFaculty(
            @Valid
            @RequestBody Faculty faculty) {

        Faculty savedFaculty =
                facultyService.addFaculty(faculty);

        return new ResponseEntity<>(
                savedFaculty,
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public Faculty updateFaculty(
            @PathVariable Long id,
            @Valid
            @RequestBody Faculty faculty) {

        return facultyService.updateFaculty(
                id,
                faculty
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(
            @PathVariable Long id) {

        facultyService.deleteFaculty(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{facultyId}/link-user")
public Faculty linkUserToFaculty(
        @PathVariable Long facultyId,
        @RequestParam String email) {

    return facultyService.linkUserToFaculty(
            facultyId,
            email
    );
}
@GetMapping("/profile")
public Faculty getFacultyProfile(
        Authentication authentication) {

    String email = authentication.getName();

    return facultyService.getFacultyProfile(email);
}
}