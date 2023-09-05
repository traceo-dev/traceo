package org.traceo.api.services.queries;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.traceo.api.TestConfig;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ContextConfiguration(classes = TestConfig.class)
@TestPropertySource("classpath:test.properties")
class IncidentQueryServiceTest {

    @Test
    void getIncident() {
    }

    @Test
    void getIncidents() {
    }
}