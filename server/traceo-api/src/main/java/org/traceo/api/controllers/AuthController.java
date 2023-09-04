package org.traceo.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.AuthCredentials;
import org.traceo.api.services.AuthService;
import org.traceo.api.services.impl.AuthServiceImpl;
import org.traceo.common.transport.response.ApiResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    private ApiResponse login(
            @RequestParam String username,
            @RequestParam String password,
            HttpServletResponse response,
            HttpServletRequest request
    ) {
        return authService.login(new AuthCredentials(username, password), response, request);
    }

    @GetMapping("/logout")
    private ApiResponse logout(
            HttpServletResponse response,
            HttpServletRequest request
    ) {
        return authService.logout(response, request);
    }

    @PostMapping("/check")
    private void check() {}

    @PostMapping("/update-password")
    private void updatePassword() {}
}
