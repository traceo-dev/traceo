package org.traceo.api.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdatePasswordDto {
    private String password;
    private String newPassword;
}
