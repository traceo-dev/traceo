package org.traceo.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.services.UserService;
import org.traceo.api.services.impl.UserServiceImpl;
import org.traceo.api.models.dto.CreateUserDto;
import org.traceo.common.transport.response.ApiResponse;
import org.traceo.security.config.ContextHolder;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    @ResponseBody
    public Authentication getAuthUser() {
        return ContextHolder.getAuthentication();
    }

    @GetMapping("/{id}")
    public void getUserById(@PathVariable String id) {}


    @GetMapping("/search")
    public void getUsersBy(
            @RequestParam(defaultValue = "ASC") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int take,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "id") String sortBy
    ) {}

    @PatchMapping()
    public void update() {}

    @PostMapping("/new")
    public ApiResponse create(@RequestBody CreateUserDto dto) {
        return userService.create(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {}
}
