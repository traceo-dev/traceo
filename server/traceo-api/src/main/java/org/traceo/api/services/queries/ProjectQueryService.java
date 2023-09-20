package org.traceo.api.services.queries;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.enums.MemberRole;

import java.util.List;

public interface ProjectQueryService {
    ProjectDto getProject(String id);
    List<ProjectDto> getProjects(ProjectsQueryDto query);
    MemberRole getPermission(String id);
    List<DashboardDto> getDashboards(String id);

    List<ProjectDto> getUserProjects(String userId);
}
