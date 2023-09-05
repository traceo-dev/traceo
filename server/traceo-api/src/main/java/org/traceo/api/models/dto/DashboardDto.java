package org.traceo.api.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DashboardDto {
    private String dashboardId;
    private String projectId;
    private String name;
    private String description;
    private boolean isEditable;
    private boolean isTimePicker;
    private boolean isBase;
}
