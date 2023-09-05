package org.traceo.api.services.commands;

import org.traceo.api.models.dto.UserDto;
import org.traceo.common.transport.response.ApiResponse;

public interface UserService {
    ApiResponse create(UserDto dto);
    ApiResponse update(UserDto dto);
    ApiResponse delete(String id);
}
