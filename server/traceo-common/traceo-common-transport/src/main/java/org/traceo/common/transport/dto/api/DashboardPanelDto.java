package org.traceo.common.transport.dto.api;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.dto.PanelConfigurationDto;
import org.traceo.common.transport.dto.PanelGridPosition;

@Getter @Setter
public class DashboardPanelDto {
    private String panelId;
    private String dashboardId;
    private String title;
    private String description;
    private PanelGridPosition gridPosition;
    private PanelConfigurationDto config;
}
