package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.dto.CreateDashboardPanelDto;
import org.traceo.api.models.dto.UpdateDashboardPanelDto;
import org.traceo.api.services.commands.DashboardPanelService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class DashboardPanelServiceImpl implements DashboardPanelService {
    @Override
    public ApiResponse create(CreateDashboardPanelDto dto) {
        return null;
    }

    @Override
    public ApiResponse update(UpdateDashboardPanelDto dto) {
        return null;
    }

    @Override
    public ApiResponse remove(String id) {
        return null;
    }
}
