package com.studentmanagement.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Exam type is required")
    private String examType;

    @NotNull(message = "Marks obtained is required")
    @Min(
            value = 0,
            message = "Marks obtained cannot be negative"
    )
    private Integer marksObtained;

    @NotNull(message = "Maximum marks is required")
    @Min(
            value = 1,
            message = "Maximum marks must be at least 1"
    )
    private Integer maximumMarks;

    @NotNull(message = "Semester is required")
    @Min(
            value = 1,
            message = "Semester must be at least 1"
    )
    @Max(
            value = 8,
            message = "Semester cannot be greater than 8"
    )
    private Integer semester;

    public Marks() {
    }

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public Student getStudent() {

        return student;
    }

    public void setStudent(Student student) {

        this.student = student;
    }

    public String getSubject() {

        return subject;
    }

    public void setSubject(String subject) {

        this.subject = subject;
    }

    public String getExamType() {

        return examType;
    }

    public void setExamType(String examType) {

        this.examType = examType;
    }

    public Integer getMarksObtained() {

        return marksObtained;
    }

    public void setMarksObtained(
            Integer marksObtained) {

        this.marksObtained = marksObtained;
    }

    public Integer getMaximumMarks() {

        return maximumMarks;
    }

    public void setMaximumMarks(
            Integer maximumMarks) {

        this.maximumMarks = maximumMarks;
    }

    public Integer getSemester() {

        return semester;
    }

    public void setSemester(Integer semester) {

        this.semester = semester;
    }
}   