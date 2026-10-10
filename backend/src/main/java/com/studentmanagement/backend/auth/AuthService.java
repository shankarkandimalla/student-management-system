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

    String email = request.getEmail().trim().toLowerCase();

    if (userRepository.findByEmail(email).isPresent()) {
        throw new RuntimeException("Email is already registered");
    }

    User user = new User();

    user.setEmail(email);
    user.setPassword(
            passwordEncoder.encode(request.getPassword())
    );

    // Public registration can create STUDENT accounts only.
    user.setRole(com.studentmanagement.backend.enums.Role.STUDENT);

    return userRepository.save(user);
}

    public User login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
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

    return user;
}
}