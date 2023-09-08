package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.response.ApiResponse;

public interface UserService {
    ApiResponse create(UserDto dto);
    ApiResponse update(UserDto dto);
    ApiResponse delete(String id);
}
