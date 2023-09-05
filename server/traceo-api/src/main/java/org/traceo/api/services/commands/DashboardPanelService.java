package org.traceo.api.services.commands;

import org.traceo.api.models.dto.CreateDashboardPanelDto;
import org.traceo.api.models.dto.UpdateDashboardPanelDto;
import org.traceo.common.transport.response.ApiResponse;

public interface DashboardPanelService {
    ApiResponse create(CreateDashboardPanelDto dto);
    ApiResponse update(UpdateDashboardPanelDto dto);
    ApiResponse remove(String id);
}
