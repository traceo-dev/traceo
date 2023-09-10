package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.models.query.UsersQueryDto;
import org.traceo.api.services.queries.UserQueryService;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

@Service
public class UserQueryServiceImpl implements UserQueryService {
    @Override
    public UserDto getUser(String id) {
        return null;
    }

    @Override
    public List<UserDto> getUsers(UsersQueryDto query) {
        return null;
    }

    @Override
    public List<ProjectDto> getUserProjects(String id, ProjectsQueryDto query) {
        return null;
    }
}
