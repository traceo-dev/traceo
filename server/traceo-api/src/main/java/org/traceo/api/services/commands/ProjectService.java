package org.traceo.api.services.commands;

import org.traceo.api.models.dto.ProjectDto;
import org.traceo.common.transport.response.ApiResponse;

public interface ProjectService {
    ApiResponse create(ProjectDto dto);
    ApiResponse update(ProjectDto dto);
    ApiResponse delete(String id);

    ApiResponse generateApiKey(String id);
    ApiResponse removeApiKey(String id);
}
