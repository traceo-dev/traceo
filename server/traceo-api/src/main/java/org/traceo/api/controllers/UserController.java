package org.traceo.api.controllers;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.services.commands.UserService;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.api.services.queries.UserQueryService;
import org.traceo.common.transport.response.ApiResponse;

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
    public ApiResponse getUserById(@PathVariable String id) {
        return userQueryService.getUser(id);
    }


    @GetMapping("/search")
    public ApiResponse getUsersBy(
            @RequestParam(defaultValue = "ASC") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int take,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        return userQueryService.getUsers(null);
    }

    @PatchMapping()
    public ApiResponse update(@Valid @RequestBody UserDto dto) {
        return userService.update(dto);
    }

    @PostMapping("/new")
    public ApiResponse create(@Valid @RequestBody UserDto dto) {
        return userService.create(dto);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable String id) {
        return userService.delete(id);
    }
}
