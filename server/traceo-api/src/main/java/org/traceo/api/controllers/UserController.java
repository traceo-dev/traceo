package org.traceo.api.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.response.CreateResponse;
import org.traceo.api.services.commands.UserService;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.api.services.queries.UserQueryService;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserQueryService userQueryService;

    public UserController(UserService userService, UserQueryService userQueryService) {
        this.userService = userService;
        this.userQueryService = userQueryService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable String id) {
        UserDto response = userQueryService.getUser(id);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess(response),
                HttpStatus.OK
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> getUsersBy(
            @RequestParam(defaultValue = "ASC") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int take,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        List<UserDto> response = userQueryService.getUsers(null);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }

    @PatchMapping()
    public ResponseEntity<ApiResponse> update(@Valid @RequestBody UserDto dto) {
        userService.update(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess("User updated"), HttpStatus.OK);
    }

    @PostMapping("/new")
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody UserDto dto) {
        String userId = userService.create(dto);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess("New user account has been created",
                        new CreateResponse(userId)
                ),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String id) {
        userService.delete(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess("New user account has been removed"), HttpStatus.OK);
    }
}
