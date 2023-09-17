package org.traceo.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.AuthCredentials;
import org.traceo.api.models.response.CheckCredentialsResponse;
import org.traceo.api.services.commands.impl.AuthServiceImpl;
import org.traceo.common.transport.dto.api.UpdatePasswordDto;
import org.traceo.common.transport.dto.api.UserCredentialsDto;
import org.traceo.api.services.commands.AuthService;
import org.traceo.api.services.queries.AuthQueryService;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.enums.ResponseStatus;
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
    public ResponseEntity<ApiResponse> getSignedInUser() {
        UserDto response = authQueryService.getSignedInUser();

        return new ResponseEntity<>(
                ApiResponse.ofSuccess(response),
                HttpStatus.OK
        );
    }

    @PostMapping("/login")
    private ResponseEntity<ApiResponse> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpServletResponse response,
            HttpServletRequest request
    ) {
        authService.login(new AuthCredentials(username, password), response, request);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.CREATED);
    }

    @GetMapping("/logout")
    private ResponseEntity<ApiResponse> logout(
            HttpServletResponse response,
            HttpServletRequest request
    ) {
        authService.logout(response, request);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.OK);
    }

    @PostMapping("/check")
    private ResponseEntity<ApiResponse> checkCredentials(@RequestBody UserCredentialsDto dto) {
        boolean response = authService.checkCredentials(dto);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess(new CheckCredentialsResponse(response)),
                HttpStatus.OK
        );
    }

    @PostMapping("/update-password")
    private ResponseEntity<ApiResponse> updatePassword(@RequestBody UpdatePasswordDto dto) {
        authService.updatePassword(dto);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess("Password updated."),
                HttpStatus.NO_CONTENT
        );
    }
}
