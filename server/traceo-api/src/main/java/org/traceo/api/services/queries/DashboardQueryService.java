package org.traceo.api.services.queries;

import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardPanelDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

public interface DashboardQueryService {
    DashboardDto getDashboard(String id);
    DashboardPanelDto getDashboardPanel(String id);
    List<DashboardPanelDto> getDashboardPanels(String id);
}
