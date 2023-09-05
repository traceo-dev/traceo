package org.traceo.api.services.queries;

import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.models.query.UsersQueryDto;
import org.traceo.common.transport.response.ApiResponse;

public interface UserQueryService {
    ApiResponse getUser(String id);
    ApiResponse getUsers(UsersQueryDto query);
    ApiResponse getUserProjects(String id, ProjectsQueryDto query);
}
