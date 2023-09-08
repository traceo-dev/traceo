package org.traceo.common.transport.dto.api;

public record UserCredentialsDto(String username, String password) {
    public UserCredentialsDto {
        if (username() == null) {
            throw new NullPointerException("Username is required!");
        }

        if (password() == null) {
            throw new NullPointerException("Password is required!");
        }
    }
}
