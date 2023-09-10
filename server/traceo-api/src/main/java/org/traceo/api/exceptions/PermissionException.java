package org.traceo.api.exceptions;

public class PermissionException extends RuntimeException {
    public PermissionException(String message) {
        super(message);
    }

    public PermissionException() {
        super("Only users with admin role can remove other account");
    }
}
