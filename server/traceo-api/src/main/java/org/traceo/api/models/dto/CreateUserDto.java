package org.traceo.api.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateUserDto {
    private String name;
    private String username;
    private String email;
    private String password;
}
