package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.dto.CreateProjectDto;
import org.traceo.api.models.dto.UpdateProjectDto;
import org.traceo.api.services.commands.ProjectService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Override
    public ApiResponse create(CreateProjectDto dto) {
        return null;
    }

    @Override
    public ApiResponse update(UpdateProjectDto dto) {
        return null;
    }

    @Override
    public ApiResponse delete(String id) {
        return null;
    }

    @Override
    public ApiResponse generateApiKey(String id) {
        return null;
    }

    @Override
    public ApiResponse removeApiKey(String id) {
        return null;
    }
}
