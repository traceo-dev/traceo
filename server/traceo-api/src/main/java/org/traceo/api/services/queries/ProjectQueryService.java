package org.traceo.api.services.queries;

import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.enums.MemberRole;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

public interface ProjectQueryService {
    ProjectDto getProject(String id);
    List<ProjectDto> getProjects(ProjectsQueryDto query);
    MemberRole getPermission(String id);
    List<DashboardDto> getDashboards(String id);
}
