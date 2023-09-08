package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardLayoutDto;
import org.traceo.common.transport.response.ApiResponse;

public interface DashboardService {
    ApiResponse create(DashboardDto dto);
    ApiResponse update(DashboardDto dto);
    ApiResponse remove(String id);

    ApiResponse updateLayout(DashboardLayoutDto dto);
}
