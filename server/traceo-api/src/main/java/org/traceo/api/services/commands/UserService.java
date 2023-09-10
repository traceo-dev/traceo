package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.response.ApiResponse;

public interface UserService {
    String create(UserDto dto);
    void update(UserDto dto);
    void delete(String id);
}
