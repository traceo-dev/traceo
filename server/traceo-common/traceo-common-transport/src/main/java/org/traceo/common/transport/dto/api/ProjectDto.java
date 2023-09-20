package org.traceo.common.transport.dto.api;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.TraceoSdk;

@Getter @Setter
public class ProjectDto {
    private String id;
    private String mainDashboardId;
    private String name;
    private String description;
    private String gravatar;
    private TraceoSdk sdk;

    private int membersCount;
    private int incidentsCount;
}
