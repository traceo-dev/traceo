package org.traceo.api.services;

import org.traceo.api.models.dto.CreateUserDto;
import org.traceo.common.transport.response.ApiResponse;

public interface UserService {
    ApiResponse create(CreateUserDto dto);
}
