package org.traceo.api.models.dto;

import jakarta.validation.ValidationException;
import lombok.Getter;
import lombok.Setter;

public record UserCredentialsDto(String username, String password) {
    public UserCredentialsDto {
        if (username() == null) {
            throw new ValidationException("Username is required!");
        }

        if (password() == null) {
            throw new ValidationException("Password is required!");
        }
    }
}
