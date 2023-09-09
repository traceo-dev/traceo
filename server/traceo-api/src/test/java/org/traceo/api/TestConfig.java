package org.traceo.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.traceo.api.services.commands.AuthService;
import org.traceo.api.services.commands.UserService;
import org.traceo.api.services.commands.impl.AuthServiceImpl;
import org.traceo.api.services.commands.impl.UserServiceImpl;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.common.jpa.repositories.UserRepository;

@Configuration
@ComponentScan(basePackages = "org.traceo.common.jpa")
@EnableJpaRepositories(basePackages = "org.traceo.common.jpa")
@EntityScan(basePackages = "org.traceo.common.jpa")
public class TestConfig {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SessionRepository sessionRepository;

    @Bean
    public AuthService authService() {
        return new AuthServiceImpl();
    }

    @Bean
    public UserService userService() {
        return new UserServiceImpl(userRepository, sessionRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
