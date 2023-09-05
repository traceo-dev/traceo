package org.traceo.api.services.commands;

import org.traceo.api.models.dto.CreateProjectDto;
import org.traceo.api.models.dto.UpdateProjectDto;
import org.traceo.common.transport.response.ApiResponse;

public interface ProjectService {
    ApiResponse create(CreateProjectDto dto);
    ApiResponse update(UpdateProjectDto dto);
    ApiResponse delete(String id);

    ApiResponse generateApiKey(String id);
    ApiResponse removeApiKey(String id);
}
