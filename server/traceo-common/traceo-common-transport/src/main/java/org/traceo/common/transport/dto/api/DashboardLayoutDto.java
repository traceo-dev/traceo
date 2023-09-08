package org.traceo.common.transport.dto.api;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.dto.PanelGridPosition;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class DashboardLayoutDto {
    private String projectId;
    private String dashboardId;
    private final List<PanelGridPosition> positions = new ArrayList<>();
}
