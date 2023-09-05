package org.traceo.api.services.commands;

import org.traceo.api.models.dto.DashboardDto;
import org.traceo.api.models.dto.DashboardLayoutDto;
import org.traceo.common.transport.response.ApiResponse;

public interface DashboardService {
    ApiResponse create(DashboardDto dto);
    ApiResponse update(DashboardDto dto);
    ApiResponse remove(String id);

    ApiResponse updateLayout(DashboardLayoutDto dto);
}
