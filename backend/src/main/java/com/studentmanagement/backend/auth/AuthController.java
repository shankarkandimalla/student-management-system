
package com.studentmanagement.backend.auth;
import com.studentmanagement.backend.security.JwtService;
import com.studentmanagement.backend.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService) {

        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {

        User registeredUser = authService.register(request);

        AuthResponse response = new AuthResponse(
                registeredUser.getId(),
                registeredUser.getEmail(),
                registeredUser.getRole(),
                null
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        User loggedInUser = authService.login(request);

        String token = jwtService.generateToken(loggedInUser);

        AuthResponse response = new AuthResponse(
                loggedInUser.getId(),
                loggedInUser.getEmail(),
                loggedInUser.getRole(),
                token
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.OK
        );
    }
}
