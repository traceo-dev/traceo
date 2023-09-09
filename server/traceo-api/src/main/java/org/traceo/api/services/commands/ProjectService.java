package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.response.ApiResponse;

public interface ProjectService {
    ApiResponse create(ProjectDto dto);
    ApiResponse update(String id, ProjectDto dto);
    ApiResponse delete(String id);

    ApiResponse generateApiKey(String id);
    ApiResponse removeApiKey(String id);
}
