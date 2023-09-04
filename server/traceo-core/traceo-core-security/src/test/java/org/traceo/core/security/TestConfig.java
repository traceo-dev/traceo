package org.traceo.core.security;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan(basePackages = "org.traceo.common.jpa") // Adjust the package name
@EnableJpaRepositories(basePackages = "org.traceo.common.jpa")
@EntityScan(basePackages = "org.traceo.common.jpa")
public class TestConfig {
}
