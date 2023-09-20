package org.traceo.api.services.commands.impl;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.exceptions.AuthenticationException;
import org.traceo.api.exceptions.PermissionException;
import org.traceo.api.exceptions.ResourceNotFoundException;
import org.traceo.api.models.AuthCredentials;
import org.traceo.api.models.response.LoginResponse;
import org.traceo.common.transport.dto.api.UpdatePasswordDto;
import org.traceo.common.transport.dto.api.UserCredentialsDto;
import org.traceo.api.services.commands.AuthService;
import org.traceo.common.jpa.entities.SessionEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.enums.UserStatus;
import org.traceo.security.model.ContextDetails;
import org.traceo.security.config.ContextHolder;
import org.traceo.utils.CookiesUtils;
import org.traceo.utils.TimeUtils;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Transactional
@Service
public class AuthServiceImpl implements AuthService {
    private static final String SESSION_NAME = "traceo_session";
    private static final int COOKIE_MAX_AGE = 3600 * 24; // 1 hour = 60 minutes * 60 seconds * 24 hours

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public LoginResponse login(AuthCredentials credentials, HttpServletResponse response, HttpServletRequest request) {
        UserEntity user = userRepository
                .findByUsername(credentials.username())
                .orElseThrow(() -> new ResourceNotFoundException("User with provided username does not exists."));

        checkCredentials(credentials.password(), user.getPassword());

        if (user.getStatus().equals(UserStatus.DISABLED)) {
            throw new PermissionException("User suspended. Contact with administrator of this Traceo Platform.");
        }

        try {
            if (user.getStatus().equals(UserStatus.INACTIVE)) {
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
            }

            SessionEntity session = createSession(user, request);
            sessionRepository.save(session);

            response.addCookie(createSessionCookie(session));

            return new LoginResponse(user.getId(), session.getSessionID());
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to login.", e);
        }
    }

    private void checkCredentials(CharSequence rawPassword, String encodedPassword) {
        boolean isCorrect = passwordEncoder.matches(rawPassword, encodedPassword);
        if (!isCorrect) {
            throw new AuthenticationException("Wrong password.");
        }
    }

    private Cookie createSessionCookie(SessionEntity session) {
        Cookie cookie = new Cookie(SESSION_NAME, session.getSessionID());
//        TODO: temporary
//        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(COOKIE_MAX_AGE);

        return cookie;
    }

    public SessionEntity createSession(UserEntity user, HttpServletRequest request) {
        SessionEntity session = new SessionEntity();
        LocalDateTime maxAge = LocalDateTime.now().plusHours(24);

        session.setSessionID(UUID.randomUUID().toString());
        session.setExpiryAt(TimeUtils.wrapToEpoch(maxAge));
        session.setUsername(user.getUsername());
        session.setUserID(user.getId());
        session.setUserIP(request.getRemoteAddr());

        return session;
    }

    public void logout(HttpServletResponse response, HttpServletRequest request) {
        ContextDetails details = ContextHolder.getDetails();

        Cookie[] cookies = request.getCookies();

        Cookie cookie = CookiesUtils.get(cookies, SESSION_NAME);
        if (cookie == null) {
            throw new ResourceNotFoundException("Cookie with session id not found!");
        }

        try {
            CookiesUtils.clearCookie(response, SESSION_NAME);
            sessionRepository.deleteBySessionID(details.getSessionId());
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to logout.", e);
        }
    }

    @Override
    public boolean checkCredentials(UserCredentialsDto dto) {
        try {
            UserEntity user = userRepository
                    .findByUsername(dto.username())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found."));

            return passwordEncoder.matches(dto.password(), user.getPassword());
        } catch (RuntimeException e){
            throw new RuntimeException("Failed to check credentials.", e);
        }
    }

    @Override
    public void updatePassword(UpdatePasswordDto dto) {
        ContextDetails ctx = ContextHolder.getDetails();

        try {
            UserEntity user = userRepository
                    .findById(ctx.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            boolean isOkPassword = passwordEncoder.matches(dto.password(), user.getPassword());
            if (!isOkPassword) {
                throw new AuthenticationException("Wrong password");
            }

            user.setPassword(passwordEncoder.encode(dto.newPassword()));
            userRepository.save(user);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to update password.", e);
        }
    }
}
