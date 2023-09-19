package org.traceo.api.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.traceo.common.transport.enums.ResponseStatus;

@ControllerAdvice
public class DefaultExceptionHandler {

    @ExceptionHandler({
            ModifyException.class,
            NotUniqueField.class
    })
    public ResponseEntity<?> handleBadReqException(RuntimeException e, HttpServletRequest req) {
        return new ResponseEntity<>(new ApiError(e.getMessage(), ResponseStatus.ERROR), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
            PermissionException.class,
            AuthenticationException.class
    })
    public ResponseEntity<?> handleAuthException(RuntimeException e, HttpServletRequest req) {
        return new ResponseEntity<>(new ApiError(e.getMessage(), ResponseStatus.ERROR), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(ResourceNotFoundException e, HttpServletRequest req) {
        return new ResponseEntity<>(new ApiError(e.getMessage(), ResponseStatus.ERROR), HttpStatus.NOT_FOUND);
    }
}
