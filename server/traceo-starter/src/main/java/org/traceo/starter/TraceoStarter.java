package org.traceo.starter;

import org.springframework.boot.Banner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.traceo.security.config.SecurityConfig;

@SpringBootApplication(scanBasePackages = "org.traceo")
@EnableJpaRepositories(basePackages = "org.traceo.common.jpa")
@EntityScan(basePackages = "org.traceo.common.jpa")
@Import(SecurityConfig.class)
public class TraceoStarter {
	public static void main(String[] args) {
		new SpringApplicationBuilder(TraceoStarter.class)
				.bannerMode(Banner.Mode.OFF)
				.run(args);
	}
}
