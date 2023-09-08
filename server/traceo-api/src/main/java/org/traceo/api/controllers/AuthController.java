package org.traceo.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.AuthCredentials;
import org.traceo.common.transport.dto.api.UpdatePasswordDto;
import org.traceo.common.transport.dto.api.UserCredentialsDto;
import org.traceo.api.services.commands.AuthService;
import org.traceo.api.services.queries.AuthQueryService;
import org.traceo.common.transport.response.ApiResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthQueryService authQueryService;

    public AuthController(AuthService authService, AuthQueryService authQueryService) {
        this.authService = authService;
        this.authQueryService = authQueryService;
    }

    @GetMapping("/signed-in")
    public ApiResponse getSignedInUser() {
        return authQueryService.getSignedInUser();
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
    private ApiResponse checkCredentials(@RequestBody UserCredentialsDto dto) {
        return authService.checkCredentials(dto);
    }

    @PostMapping("/update-password")
    private ApiResponse updatePassword(@RequestBody UpdatePasswordDto dto) {
        return authService.updatePassword(dto);
    }
}
