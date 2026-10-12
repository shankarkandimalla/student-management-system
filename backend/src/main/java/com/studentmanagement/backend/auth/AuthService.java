
package com.studentmanagement.backend.auth;

import com.studentmanagement.backend.user.User;
import com.studentmanagement.backend.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 8) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }

        if (request.getRole() == null) {
            throw new RuntimeException("Role is required");
        }

        if (request.getRole() ==
                com.studentmanagement.backend.enums.Role.ADMIN) {
            throw new RuntimeException(
                    "Admin accounts can only be created by an existing admin"
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();

        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(request.getRole());
        user.setStatus(
                com.studentmanagement.backend.enums.AccountStatus.PENDING
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getStatus() !=
                com.studentmanagement.backend.enums.AccountStatus.APPROVED) {
            throw new RuntimeException(
                    "Your account is not approved. Please contact the administrator or faculty."
            );
        }

        return user;
    }

    public User createAdmin(RegisterRequest request) {

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 8) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();

        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(
                com.studentmanagement.backend.enums.Role.ADMIN
        );
        user.setStatus(
                com.studentmanagement.backend.enums.AccountStatus.APPROVED
        );

        return userRepository.save(user);
    }
}
