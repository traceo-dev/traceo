package org.traceo.api;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.traceo.api.services.commands.impl.AuthServiceImpl;
import org.traceo.api.services.commands.impl.UserServiceImpl;

@Configuration
@ComponentScan(basePackages = "org.traceo.common.jpa")
@EnableJpaRepositories(basePackages = "org.traceo.common.jpa")
@EntityScan(basePackages = "org.traceo.common.jpa")
public class TestConfig {
    @Bean
    public AuthServiceImpl authService() {
        return new AuthServiceImpl();
    }

    @Bean
    public UserServiceImpl userService() {
        return new UserServiceImpl();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
