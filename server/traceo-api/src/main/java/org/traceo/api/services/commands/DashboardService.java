package org.traceo.api.services.commands;

import org.traceo.api.models.dto.CreateDashboardDto;
import org.traceo.api.models.dto.DashboardLayoutDto;
import org.traceo.api.models.dto.UpdateDashboardDto;
import org.traceo.common.transport.response.ApiResponse;

public interface DashboardService {
    ApiResponse create(CreateDashboardDto dto);
    ApiResponse update(UpdateDashboardDto dto);
    ApiResponse remove(String id);

    ApiResponse updateLayout(DashboardLayoutDto dto);
}
