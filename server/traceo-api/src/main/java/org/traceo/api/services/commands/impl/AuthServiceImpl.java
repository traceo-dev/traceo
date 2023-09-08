package org.traceo.api.services.commands.impl;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.exceptions.UserNotExistsException;
import org.traceo.api.models.AuthCredentials;
import org.traceo.common.transport.dto.api.UpdatePasswordDto;
import org.traceo.common.transport.dto.api.UserCredentialsDto;
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
    private final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private static final String SESSION_NAME = "traceo_session";
    private static final int COOKIE_MAX_AGE = 3600 * 24; // 1 hour = 60 minutes * 60 seconds * 24 hours

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public ApiResponse login(AuthCredentials credentials, HttpServletResponse response, HttpServletRequest request) {
        try {
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

            response.addCookie(createSessionCookie(session));

            return ApiResponse.ofSuccess();
        } catch (Exception e) {
            logger.error("Failed to login.", e);
            return ApiResponse.ofError("Failed to login.");
        }
    }

    private Cookie createSessionCookie(SessionEntity session) {
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

        try {
            CookiesUtils.clearCookie(response, SESSION_NAME);
            sessionRepository.deleteBySessionID(details.getSessionId());

            return ApiResponse.ofSuccess();
        } catch (Exception e) {
            logger.error("Failed to logout. ", e);
            return ApiResponse.ofError("Failed to logout.");
        }
    }

    public record CheckCredentialsDto(boolean isCorrect) {}

    @Override
    public ApiResponse checkCredentials(UserCredentialsDto dto) {
        try {
            Optional<UserEntity> userEntity = userRepository.findByUsername(dto.username());
            if (userEntity.isPresent()) {
                UserEntity user = userEntity.get();
                boolean isOk = passwordEncoder.matches(dto.password(), user.getPassword());
                return ApiResponse.ofSuccess(new CheckCredentialsDto(isOk));
            }

            return ApiResponse.ofError(new CheckCredentialsDto(false));
        } catch (Exception e){
            logger.error("Failed to check credentials.", e);
            return ApiResponse.ofError("Failed to check credentials.");
        }
    }

    @Override
    public ApiResponse updatePassword(UpdatePasswordDto dto) {
        ContextDetails ctx = ContextHolder.getDetails();

        try {
            Optional<UserEntity> userEntity = userRepository.findById(ctx.getUserId());
            if (userEntity.isEmpty()) {
                throw new UserNotExistsException();
            }

            UserEntity user = userEntity.get();

            boolean isOkPassword = passwordEncoder.matches(dto.password(), user.getPassword());
            if (!isOkPassword) {
                return ApiResponse.ofError("Wrong password.");
            }

            user.setPassword(passwordEncoder.encode(dto.newPassword()));
            userRepository.save(user);
            return ApiResponse.ofSuccess("Password updated.");
        } catch (Exception e) {
            logger.error("Failed to update password.", e);
            return ApiResponse.ofError("Failed to update password.");
        }
    }
}
