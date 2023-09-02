package org.traceo.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "org.traceo")
@EnableJpaRepositories(basePackages = "org.traceo.common.jpa")
@EntityScan(basePackages = "org.traceo.common.jpa")
public class TraceoStarter {
	public static void main(String[] args) {
		SpringApplication.run(TraceoStarter.class, args);
	}
}
