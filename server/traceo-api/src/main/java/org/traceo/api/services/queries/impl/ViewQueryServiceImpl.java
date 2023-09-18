package org.traceo.api.services.queries.impl;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.traceo.api.models.response.ViewConfigResponse;
import org.traceo.api.services.queries.ViewQueryService;
import org.traceo.common.jpa.entities.SessionEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.enums.EnvType;
import org.traceo.utils.CookiesUtils;

@Service
public class ViewQueryServiceImpl implements ViewQueryService {
    private static final String SESSION_NAME = "traceo_session";

    @Value("${traceo.demo:false}")
    private boolean isDemo;

    @Value("${traceo.env:development}")
    private EnvType env;

    @Value("${traceo.env:version}")
    private String version;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public ViewConfigResponse getViewConfigData(HttpServletRequest request) {
        ViewConfigResponse config = new ViewConfigResponse();

        String sessionId = CookiesUtils.getValue(request.getCookies(), SESSION_NAME);
        if (sessionId != null) {
            SessionEntity session = sessionRepository.findBySessionID(sessionId).orElse(null);
            if (session != null) {
                UserDto user = userRepository.findById(session.getUserID()).map(UserEntity::mapToModel).orElse(null);
                config.setUser(user);
            }
        }

        config.setEnv(env);
        config.setVersion(version);
        config.setDemoMode(isDemo);

        return null;
    }
}
