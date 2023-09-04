package org.traceo.api;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.traceo.api.models.AuthCredentials;
import org.traceo.api.services.AuthService;
import org.traceo.common.jpa.entities.SessionEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.enums.ResponseStatus;
import org.traceo.common.transport.enums.UserStatusEnum;
import org.traceo.common.transport.response.ApiResponse;
import org.traceo.security.config.ContextHolder;
import org.traceo.security.model.AuthenticationContextDto;
import org.traceo.security.model.ContextDetails;
import org.traceo.utils.CookiesUtils;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ContextConfiguration(classes = TestConfig.class)
@TestPropertySource("classpath:test.properties")
public class AuthServiceTest {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        UserEntity user = new UserEntity();
        user.setUsername("test_user");
        user.setPassword(passwordEncoder.encode("test_password"));
        user.setStatus(UserStatusEnum.ACTIVE);
        userRepository.save(user);

        UserEntity disabledUser = new UserEntity();
        disabledUser.setUsername("disabled_user");
        disabledUser.setPassword(passwordEncoder.encode("test_password"));
        disabledUser.setStatus(UserStatusEnum.DISABLED);
        userRepository.save(disabledUser);
    }

    @Test
    public void testCorrectLoginCredentials() {
        final String username = "test_user";
        final String password = "test_password";

        AuthCredentials credentials = new AuthCredentials(username, password);
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        ApiResponse apiResponse = authService.login(credentials, response, request);

        assertEquals(ResponseStatus.SUCCESS, apiResponse.getStatus());

        // Check if a session was created in the database
        UserEntity user = userRepository.findByUsername(username).orElse(null);
        assertNotNull(user);

        SessionEntity session = sessionRepository.findByUserID(user.getId()).orElse(null);
        assertNotNull(session);
    }

    @Test
    public void testWrongLoginCredentials() {
        AuthCredentials credentials = new AuthCredentials("invalid_username", "test_password");
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        ApiResponse apiResponse = authService.login(credentials, response, request);
        assertEquals(ResponseStatus.ERROR, apiResponse.getStatus());

        AuthCredentials credentials2 = new AuthCredentials("test_user", "invalid_password");
        MockHttpServletRequest request2 = new MockHttpServletRequest();
        MockHttpServletResponse response2 = new MockHttpServletResponse();

        ApiResponse apiResponse2 = authService.login(credentials2, response2, request2);
        assertEquals(ResponseStatus.ERROR, apiResponse2.getStatus());

        // Ensure no session was created in the database
        UserEntity user = userRepository.findByUsername("test_user").orElse(null);
        assertNotNull(user);

        SessionEntity session = sessionRepository.findByUserID(user.getId()).orElse(null);
        assertNull(session);
    }

    @Test
    public void testBlockAuthForDisabledUser() {
        AuthCredentials credentials = new AuthCredentials("disabled_user", "test_password");
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        ApiResponse apiResponse = authService.login(credentials, response, request);
        assertEquals(ResponseStatus.ERROR, apiResponse.getStatus());
    }

    @Test
    @Disabled // TODO:
    public void testLogout() {
        final String username = "test_user";
        final String password = "test_password";

        AuthCredentials credentials = new AuthCredentials(username, password);

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        ApiResponse loginApiResponse = authService.login(credentials, response, request);

        assertEquals(ResponseStatus.SUCCESS, loginApiResponse.getStatus());

        String sessionId = CookiesUtils.getValue(response.getCookies(), "traceo_session");

        // Mock auth context holder
        ContextDetails contextDetails = new ContextDetails(null, username, sessionId);
        Authentication authentication = new AuthenticationContextDto(null, contextDetails);

        ContextHolder.setAuthentication(authentication);

        ContextDetails details = ContextHolder.getDetails();
        assertNotNull(details);

        ApiResponse logoutApiResponse = authService.logout(response, request);

        assertEquals(ResponseStatus.SUCCESS, logoutApiResponse.getStatus());

        // Ensure the session was deleted from the database
        SessionEntity session = sessionRepository.findBySessionID(details.getSessionId()).orElse(null);
        assertNull(session);
    }
}