package org.traceo.security.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.filter.OncePerRequestFilter;
import org.traceo.common.jpa.entities.SessionEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.security.model.AuthenticationContextDto;
import org.traceo.security.model.ContextDetails;
import org.traceo.utils.CookiesUtils;

import java.io.IOException;
import java.util.Optional;

public class AuthenticationFilter extends OncePerRequestFilter {
    private final String SESSION_NAME = "traceo_session";

    private final SessionRepository sessionRepository;

    public AuthenticationFilter(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String sessionId = CookiesUtils.getValue(request.getCookies(), SESSION_NAME);
        if (sessionId != null) {
            Optional<SessionEntity> sessionEntity = sessionRepository.findBySessionID(sessionId);
            if (sessionEntity.isPresent()) {
                SessionEntity session = sessionEntity.get();
                String userId = session.getUserID();

                ContextDetails details = new ContextDetails(session.getUserID(), session.getUsername(), sessionId);
                Authentication authentication = new AuthenticationContextDto(userId, details);

                ContextHolder.setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}