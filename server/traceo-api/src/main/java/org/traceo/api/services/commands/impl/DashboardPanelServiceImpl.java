package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.dto.DashboardPanelDto;
import org.traceo.api.services.commands.DashboardPanelService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class DashboardPanelServiceImpl implements DashboardPanelService {
    @Override
    public ApiResponse create(DashboardPanelDto dto) {
        return null;
    }

    @Override
    public ApiResponse update(DashboardPanelDto dto) {
        return null;
    }

    @Override
    public ApiResponse remove(String id) {
        return null;
    }
}
