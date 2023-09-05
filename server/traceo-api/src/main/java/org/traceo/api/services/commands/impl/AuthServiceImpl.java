package org.traceo.api.services.commands.impl;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.models.AuthCredentials;
import org.traceo.api.models.dto.UpdatePasswordDto;
import org.traceo.api.models.dto.UserCredentialsDto;
import org.traceo.api.services.commands.AuthService;
import org.traceo.common.jpa.entities.SessionEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.enums.UserStatusEnum;
import org.traceo.common.transport.response.ApiResponse;
import org.traceo.security.model.ContextDetails;
import org.traceo.security.config.ContextHolder;
import org.traceo.utils.CookiesUtils;
import org.traceo.utils.TimeUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Transactional
@Service
public class AuthServiceImpl implements AuthService {
    private final String SESSION_NAME = "traceo_session";
    private final int COOKIE_MAX_AGE = 3600 * 24; // 1 hour = 60 minutes * 60 seconds * 24 hours

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public ApiResponse login(AuthCredentials credentials, HttpServletResponse response, HttpServletRequest request) {
        Optional<UserEntity> userEntity = userRepository.findByUsername(credentials.username());
        if (userEntity.isEmpty()) {
            return ApiResponse.ofError("User with provided username does not exists.");
        }

        UserEntity user = userEntity.get();
       if (!passwordEncoder.matches(credentials.password(), user.getPassword())) {
           return ApiResponse.ofError("Bad password.");
       }

        if (user.getStatus().equals(UserStatusEnum.DISABLED)) {
            return ApiResponse.ofError("User suspended. Contact with administrator of this Traceo Platform.");
        }

        if (user.getStatus().equals(UserStatusEnum.INACTIVE)) {
            user.setStatus(UserStatusEnum.ACTIVE);
            userRepository.save(user);
        }

        SessionEntity session = createSession(user, request);
        sessionRepository.save(session);

        response.addCookie(getSessionCookie(session));

        return ApiResponse.ofSuccess();
    }

    private Cookie getSessionCookie(SessionEntity session) {
        Cookie cookie = new Cookie(SESSION_NAME, session.getSessionID());
        cookie.setHttpOnly(true);
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

    public ApiResponse logout(HttpServletResponse response, HttpServletRequest request) {
        ContextDetails details = ContextHolder.getDetails();

        Cookie[] cookies = request.getCookies();

        Cookie cookie = CookiesUtils.get(cookies, SESSION_NAME);
        if (cookie == null) {
            return ApiResponse.ofError("Cookie with session id not found!");
        }

        CookiesUtils.clearCookie(response, SESSION_NAME);
        sessionRepository.deleteBySessionID(details.getSessionId());

        return ApiResponse.ofSuccess();
    }

    @Override
    public ApiResponse checkCredentials(UserCredentialsDto dto) {
        return null;
    }

    @Override
    public ApiResponse updatePassword(UpdatePasswordDto dto) {
        return null;
    }
}
