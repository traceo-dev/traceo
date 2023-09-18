package org.traceo.common.transport.enums;

import lombok.Getter;

@Getter
public enum ResponseStatus {
    SUCCESS("success"),
    ERROR("error");

    private String value;

    ResponseStatus(String value) {
        this.value = value;
    }
}
