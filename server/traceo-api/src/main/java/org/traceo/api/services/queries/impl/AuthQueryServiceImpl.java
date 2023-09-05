package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.services.queries.AuthQueryService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class AuthQueryServiceImpl implements AuthQueryService {
    @Override
    public ApiResponse getSignedInUser() {
        return null;
    }
}
