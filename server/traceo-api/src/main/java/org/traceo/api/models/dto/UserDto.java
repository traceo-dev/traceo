package org.traceo.api.models.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.UserStatusEnum;

@Getter @Setter
public class UserDto {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Username is required")
    private String username;

    @Email
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private UserStatusEnum status;
    private boolean isAdmin;
}
