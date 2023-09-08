package org.traceo.common.transport.dto.api;

public record UpdatePasswordDto(String password, String newPassword) {
    public UpdatePasswordDto {
        if (password() == null) {
            throw new NullPointerException("Password is required!");
        }

        if (newPassword() == null) {
            throw new NullPointerException("New password is required!");
        }
    }
}
