package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.models.query.UsersQueryDto;
import org.traceo.api.services.queries.UserQueryService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class UserQueryServiceImpl implements UserQueryService {
    @Override
    public ApiResponse getUser(String id) {
        return null;
    }

    @Override
    public ApiResponse getUsers(UsersQueryDto query) {
        return null;
    }

    @Override
    public ApiResponse getUserProjects(String id, ProjectsQueryDto query) {
        return null;
    }
}
