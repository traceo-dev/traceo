package org.traceo.api.services.queries;

import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.common.transport.response.ApiResponse;

public interface ProjectQueryService {
    ApiResponse getProject(String id);
    ApiResponse getProjects(ProjectsQueryDto query);
    ApiResponse getPermission(String id);
    ApiResponse getDashboards(String id);
}
