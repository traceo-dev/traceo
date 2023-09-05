package org.traceo.api.services.commands;

import org.traceo.api.models.dto.CreateUserDto;
import org.traceo.api.models.dto.UpdateUserDto;
import org.traceo.common.transport.response.ApiResponse;

public interface UserService {
    ApiResponse create(CreateUserDto dto);
    ApiResponse update(UpdateUserDto dto);
    ApiResponse delete(String id);
}
