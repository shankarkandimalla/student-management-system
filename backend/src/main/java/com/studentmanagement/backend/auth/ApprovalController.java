
package com.studentmanagement.backend.auth;

import com.studentmanagement.backend.enums.AccountStatus;
import com.studentmanagement.backend.enums.Role;
import com.studentmanagement.backend.user.User;
import com.studentmanagement.backend.user.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class ApprovalController {

    private final ApprovalService approvalService;
    private final UserRepository userRepository;

    public ApprovalController(
            ApprovalService approvalService,
            UserRepository userRepository) {

        this.approvalService = approvalService;
        this.userRepository = userRepository;
    }

    @GetMapping("/students")
    public List<User> getPendingStudents() {
        return userRepository.findByRoleAndStatus(
                Role.STUDENT,
                AccountStatus.PENDING
        );
    }

    @GetMapping("/faculty")
    public List<User> getPendingFaculty() {
        return userRepository.findByRoleAndStatus(
                Role.FACULTY,
                AccountStatus.PENDING
        );
    }

    @PutMapping("/students/{id}/approve")
    public User approveStudent(@PathVariable Long id) {
        return approvalService.approveStudent(id);
    }

    @PutMapping("/students/{id}/reject")
    public User rejectStudent(@PathVariable Long id) {
        return approvalService.rejectStudent(id);
    }

    @PutMapping("/faculty/{id}/approve")
    public User approveFaculty(@PathVariable Long id) {
        return approvalService.approveFaculty(id);
    }

    @PutMapping("/faculty/{id}/reject")
    public User rejectFaculty(@PathVariable Long id) {
        return approvalService.rejectFaculty(id);
    }
}
