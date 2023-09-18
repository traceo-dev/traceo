package org.traceo.common.transport.response;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.ResponseStatus;

@Getter @Setter
public class ApiResponse {
    private String message;
    private String status;
    private Object data;

    public static ApiResponse ofError() {
        return new ApiResponse(ResponseStatus.ERROR, null, null);
    }

    public static ApiResponse ofError(String message) {
        return new ApiResponse(ResponseStatus.ERROR, message, null);
    }

    public static ApiResponse ofError(Object data) {
        return new ApiResponse(ResponseStatus.ERROR, null, data);
    }

    public static ApiResponse ofError(String message, Object data) {
        return new ApiResponse(ResponseStatus.ERROR, message, data);
    }

    public static ApiResponse ofSuccess() {
        return new ApiResponse(ResponseStatus.SUCCESS, null, null);
    }

    public static ApiResponse ofSuccess(String message) {
        return new ApiResponse(ResponseStatus.SUCCESS, message, null);
    }

    public static ApiResponse ofSuccess(Object data) {
        return new ApiResponse(ResponseStatus.SUCCESS, null, data);
    }

    public static ApiResponse ofSuccess(String message, Object data) {
        return new ApiResponse(ResponseStatus.SUCCESS, message, data);
    }

    public ApiResponse() {}

    public ApiResponse(ResponseStatus status, String message, Object data) {
        this.message = message;
        this.status = status.getValue();
        this.data = data;
    }

    public ApiResponse(ResponseStatus status, String message) {
        this(status, message, null);
    }

    public ApiResponse(ResponseStatus status, Object data) {
        this(status, null, data);
    }

    public ApiResponse(ResponseStatus status) {
        this(status, null, null);
    }
}
