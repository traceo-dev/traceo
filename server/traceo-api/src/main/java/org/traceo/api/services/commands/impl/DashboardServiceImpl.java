package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardLayoutDto;
import org.traceo.api.services.commands.DashboardService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class DashboardServiceImpl implements DashboardService {
    @Override
    public String create(DashboardDto dto) {
        return null;
    }

    @Override
    public void update(DashboardDto dto) { }

    @Override
    public void remove(String id) { }

    @Override
    public void updateLayout(DashboardLayoutDto dto) { }
}
