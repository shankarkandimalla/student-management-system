package com.studentmanagement.backend.auth;

import com.studentmanagement.backend.enums.Role;

public class AuthResponse {

    private Long id;
    private String email;
    private Role role;
    private String token;

    public AuthResponse(
            Long id,
            String email,
            Role role,
            String token) {

        this.id = id;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}