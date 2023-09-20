package org.traceo.api.services.queries;

import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.models.query.UsersQueryDto;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

public interface UserQueryService {
    UserDto getUser(String id);
    List<UserDto> getUsers(UsersQueryDto query);
}
