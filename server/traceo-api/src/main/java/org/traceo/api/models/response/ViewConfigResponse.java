package org.traceo.api.models.response;

import lombok.Setter;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.enums.EnvType;

@Setter
public class ViewConfigResponse {
    private UserDto user;
    private boolean demoMode;
    private String version;
    private EnvType env;
}
