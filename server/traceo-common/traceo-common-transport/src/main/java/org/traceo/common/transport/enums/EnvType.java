package org.traceo.common.transport.enums;

import lombok.Getter;

@Getter
public enum EnvType {
    PROD("production"),
    DEV("development");

    private String value;
    EnvType(String value) {
        this.value = value;
    }
}
