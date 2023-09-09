package org.traceo.common.transport.dto.api;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.UserStatus;

@Getter @Setter
public class UserDto {
    private String name;
    private String username;
    private String email;
    private String password;
    private String gravatar;

    private UserStatus status;
    private boolean isAdmin;
}
