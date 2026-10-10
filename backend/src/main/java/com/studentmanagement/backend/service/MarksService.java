package com.studentmanagement.backend.service;

import com.studentmanagement.backend.entity.Marks;
import com.studentmanagement.backend.entity.Student;
import com.studentmanagement.backend.exception.MarksNotFoundException;
import com.studentmanagement.backend.repository.MarksRepository;
import com.studentmanagement.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;

    public MarksService(
            MarksRepository marksRepository,
            StudentRepository studentRepository) {

        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
    }

    public List<Marks> getAllMarks() {

        return marksRepository.findAll();
    }

    public Marks getMarksById(Long id) {

        return marksRepository.findById(id)
                .orElseThrow(() ->
                        new MarksNotFoundException(id)
                );
    }

    public Marks addMarks(
            Long studentId,
            Marks marks) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with ID: "
                                        + studentId
                        )
                );

        if (marks.getMarksObtained()
                > marks.getMaximumMarks()) {

            throw new IllegalArgumentException(
                    "Marks obtained cannot be greater than maximum marks"
            );
        }

        marks.setStudent(student);

        return marksRepository.save(marks);
    }

    public Marks updateMarks(
            Long id,
            Marks updatedMarks) {

        Marks existingMarks =
                marksRepository.findById(id)
                        .orElseThrow(() ->
                                new MarksNotFoundException(id)
                        );

        if (updatedMarks.getMarksObtained()
                > updatedMarks.getMaximumMarks()) {

            throw new IllegalArgumentException(
                    "Marks obtained cannot be greater than maximum marks"
            );
        }

        existingMarks.setSubject(
                updatedMarks.getSubject()
        );

        existingMarks.setExamType(
                updatedMarks.getExamType()
        );

        existingMarks.setMarksObtained(
                updatedMarks.getMarksObtained()
        );

        existingMarks.setMaximumMarks(
                updatedMarks.getMaximumMarks()
        );

        existingMarks.setSemester(
                updatedMarks.getSemester()
        );

        return marksRepository.save(
                existingMarks
        );
    }

    public List<Marks> getMyMarks(
            String email) {

        return marksRepository
                .findByStudentUserEmail(email);
    }
}