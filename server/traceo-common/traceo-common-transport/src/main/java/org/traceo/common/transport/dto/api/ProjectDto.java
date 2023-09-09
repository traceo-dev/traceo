package org.traceo.common.transport.dto.api;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.TraceoSdk;

@Getter @Setter
public class ProjectDto {
    private String name;
    private String description;
    private TraceoSdk sdk;
}
