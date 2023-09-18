package org.traceo.common.jpa.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Flyway configuration to run migration after hibernate startup operations.
 */

@Configuration
public class FlywayConfig {

    @Autowired
    public FlywayConfig(DataSource dataSource) {
        Flyway
                .configure()
                .baselineOnMigrate(true)
                .dataSource(dataSource)
                .load()
                .migrate();
    }
}
