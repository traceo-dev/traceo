package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.DashboardPanelDto;
import org.traceo.common.transport.response.ApiResponse;

public interface DashboardPanelService {
    ApiResponse create(DashboardPanelDto dto);
    ApiResponse update(DashboardPanelDto dto);
    ApiResponse remove(String id);
}
