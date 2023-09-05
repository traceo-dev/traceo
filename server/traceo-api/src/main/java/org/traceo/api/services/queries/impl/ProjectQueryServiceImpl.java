package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.services.queries.ProjectQueryService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class ProjectQueryServiceImpl implements ProjectQueryService {
    @Override
    public ApiResponse getProject(String id) {
        return null;
    }

    @Override
    public ApiResponse getProjects(ProjectsQueryDto query) {
        return null;
    }

    @Override
    public ApiResponse getPermission(String id) {
        return null;
    }

    @Override
    public ApiResponse getDashboards(String id) {
        return null;
    }
}
