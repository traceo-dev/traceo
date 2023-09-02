package org.traceo.common.jpa.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.core.services.UserService;

import java.util.List;

@RestController
public class DemoController {

    @Autowired
    UserService userService;

    @GetMapping("/test/hello")
    private List<UserEntity> test() {
        return userService.getUser();
    }
}
