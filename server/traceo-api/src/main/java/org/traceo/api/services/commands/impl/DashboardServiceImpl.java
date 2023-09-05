package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.dto.CreateDashboardDto;
import org.traceo.api.models.dto.DashboardLayoutDto;
import org.traceo.api.models.dto.UpdateDashboardDto;
import org.traceo.api.services.commands.DashboardService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class DashboardServiceImpl implements DashboardService {
    @Override
    public ApiResponse create(CreateDashboardDto dto) {
        return null;
    }

    @Override
    public ApiResponse update(UpdateDashboardDto dto) {
        return null;
    }

    @Override
    public ApiResponse remove(String id) {
        return null;
    }

    @Override
    public ApiResponse updateLayout(DashboardLayoutDto dto) {
        return null;
    }
}
