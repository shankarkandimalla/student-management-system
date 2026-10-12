
package com.studentmanagement.backend.auth;

import com.studentmanagement.backend.enums.AccountStatus;
import com.studentmanagement.backend.enums.Role;
import com.studentmanagement.backend.user.User;
import com.studentmanagement.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApprovalService {

    private final UserRepository userRepository;

    public ApprovalService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User approveStudent(Long id) {
        return updateStatus(id, Role.STUDENT, AccountStatus.APPROVED);
    }

    @Transactional
    public User rejectStudent(Long id) {
        return updateStatus(id, Role.STUDENT, AccountStatus.REJECTED);
    }

    @Transactional
    public User approveFaculty(Long id) {
        return updateStatus(id, Role.FACULTY, AccountStatus.APPROVED);
    }

    @Transactional
    public User rejectFaculty(Long id) {
        return updateStatus(id, Role.FACULTY, AccountStatus.REJECTED);
    }

    private User updateStatus(
            Long id,
            Role expectedRole,
            AccountStatus newStatus) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (user.getRole() != expectedRole) {
            throw new RuntimeException(
                    "This request cannot be processed by this approval operation"
            );
        }

        if (user.getStatus() != AccountStatus.PENDING) {
            throw new RuntimeException(
                    "This account has already been processed"
            );
        }

        user.setStatus(newStatus);

        return userRepository.save(user);
    }
}
