package org.traceo.core.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.traceo.common.jpa.entities.SessionEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.security.config.AuthenticationFilter;
import org.traceo.security.config.ContextHolder;
import org.traceo.security.model.ContextDetails;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ContextConfiguration(classes = TestConfig.class)
@TestPropertySource("classpath:test.properties")
public class AuthenticationFilterTest {

    @Autowired
    SessionRepository sessionRepository;

    private AuthenticationFilter authenticationFilter;

    @BeforeEach
    public void setUp() {
        authenticationFilter = new AuthenticationFilter(sessionRepository);
    }

    @Test
    public void testDoFilterInternalWithValidSession() throws ServletException, IOException {
        SessionEntity sessionEntity = new SessionEntity();
        sessionEntity.setSessionID("validSessionId");
        sessionEntity.setUserID("userId");
        sessionEntity.setUsername("username");
        sessionEntity.setUserIP("userip");

        SessionEntity session = sessionRepository.save(sessionEntity);
        assertNotNull(session);

        MockHttpServletResponse response = new MockHttpServletResponse();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("traceo_session", "validSessionId"));

        ContextDetails contextDetails = new ContextDetails(
                session.getUserID(), session.getUsername(), session.getSessionID()
        );

        FilterChain filterChain = (req, res) -> {
            Authentication authentication = ContextHolder.getContext().getAuthentication();
            assertNotNull(authentication);

            assertEquals(authentication.getPrincipal(), "userId");

            ContextDetails authCtxDetails = (ContextDetails) authentication.getDetails();
            assertEquals(authCtxDetails.getSessionId(), contextDetails.getSessionId());
            assertEquals(authCtxDetails.getUsername(), contextDetails.getUsername());
            assertEquals(authCtxDetails.getUserId(), contextDetails.getUserId());
        };

        authenticationFilter.doFilterInternal(request, response, filterChain);
    }

    @Test
    @Disabled //TODO:
    public void testDoFilterInternalWithInvalidSession() throws ServletException, IOException {
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("traceo_session", "invalidSessionId"));

        FilterChain filterChain = (req, res) -> {
            assertNull(ContextHolder.getContext().getAuthentication());
        };

        authenticationFilter.doFilterInternal(request, response, filterChain);
    }
}
