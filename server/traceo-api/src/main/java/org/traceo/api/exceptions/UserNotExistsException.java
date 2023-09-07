package org.traceo.api.exceptions;

public class UserNotExistsException extends RuntimeException {
    public UserNotExistsException(String message) {
        super(message);
    }

    public UserNotExistsException() {}
}
