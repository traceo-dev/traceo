package org.traceo.common.transport.dto.api;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.UserStatusEnum;

@Getter @Setter
public class UserDto {
    private String name;
    private String username;
    private String email;
    private String password;
    private String gravatar;

    private UserStatusEnum status;
    private boolean isAdmin;
}
