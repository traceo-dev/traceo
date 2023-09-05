package org.traceo.api.models.dto;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.SdkEnum;

@Getter @Setter
public class ProjectDto {
    private String name;
    private SdkEnum sdk;
}
