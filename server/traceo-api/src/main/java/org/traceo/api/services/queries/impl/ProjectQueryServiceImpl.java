package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.services.queries.ProjectQueryService;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.enums.MemberRole;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

@Service
public class ProjectQueryServiceImpl implements ProjectQueryService {
    @Override
    public ProjectDto getProject(String id) {
        return null;
    }

    @Override
    public List<ProjectDto> getProjects(ProjectsQueryDto query) {
        return null;
    }

    @Override
    public MemberRole getPermission(String id) {
        return null;
    }

    @Override
    public List<DashboardDto> getDashboards(String id) {
        return null;
    }
}
