package org.traceo.api.exceptions;

public class NotUniqueField extends RuntimeException {
    public NotUniqueField(String message) {
        super(message);
    }

    public NotUniqueField() {}
}
