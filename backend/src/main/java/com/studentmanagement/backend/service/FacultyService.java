package com.studentmanagement.backend.service;
import com.studentmanagement.backend.exception.FacultyNotFoundException;
import com.studentmanagement.backend.entity.Faculty;
import com.studentmanagement.backend.repository.FacultyRepository;
import org.springframework.stereotype.Service;
import com.studentmanagement.backend.user.User;
import com.studentmanagement.backend.user.UserRepository;
import java.util.List;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    public FacultyService(
        FacultyRepository facultyRepository,
        UserRepository userRepository) {

    this.facultyRepository = facultyRepository;
    this.userRepository = userRepository;
}

    public List<Faculty> getAllFaculty() {

        return facultyRepository.findAll();
    }

    public Faculty getFacultyById(Long id) {

        return facultyRepository.findById(id)
                .orElseThrow(() ->
        new FacultyNotFoundException(id)
);
    }

    public Faculty addFaculty(Faculty faculty) {

        return facultyRepository.save(faculty);
    }

    public Faculty updateFaculty(
            Long id,
            Faculty updatedFaculty) {

        Faculty existingFaculty = facultyRepository
                .findById(id)
                .orElseThrow(() ->
        new FacultyNotFoundException(id)
);

        existingFaculty.setEmployeeId(
                updatedFaculty.getEmployeeId()
        );

        existingFaculty.setFirstName(
                updatedFaculty.getFirstName()
        );

        existingFaculty.setLastName(
                updatedFaculty.getLastName()
        );

        existingFaculty.setEmail(
                updatedFaculty.getEmail()
        );

        existingFaculty.setPhoneNumber(
                updatedFaculty.getPhoneNumber()
        );

        existingFaculty.setDepartment(
                updatedFaculty.getDepartment()
        );

        existingFaculty.setDesignation(
                updatedFaculty.getDesignation()
        );

        return facultyRepository.save(existingFaculty);
    }

    public void deleteFaculty(Long id) {

        Faculty existingFaculty = facultyRepository
                .findById(id)
                .orElseThrow(() ->
                        new FacultyNotFoundException(id)
                );

        facultyRepository.delete(existingFaculty);
    }

    public Faculty linkUserToFaculty(
        Long facultyId,
        String userEmail) {

    Faculty faculty = facultyRepository.findById(facultyId)
            .orElseThrow(() ->
                    new FacultyNotFoundException(facultyId)
            );

    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() ->
                new RuntimeException(
                        "User not found with email: "
                                + userEmail
                )
        );

    faculty.setUser(user);

    return facultyRepository.save(faculty);
}

public Faculty getFacultyProfile(String email) {

    return facultyRepository.findByUserEmail(email)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Faculty profile not found"
                    )
            );
}
}