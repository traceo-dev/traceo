package org.traceo.api.models.dto;

import jakarta.validation.ValidationException;
import lombok.Getter;
import lombok.Setter;

public record UpdatePasswordDto(String password, String newPassword) {
    public UpdatePasswordDto {
        if (password() == null) {
            throw new ValidationException("Password is required!");
        }

        if (newPassword() == null) {
            throw new ValidationException("New password is required!");
        }
    }
}
