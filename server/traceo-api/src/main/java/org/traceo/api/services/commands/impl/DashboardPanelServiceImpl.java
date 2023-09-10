package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.common.transport.dto.api.DashboardPanelDto;
import org.traceo.api.services.commands.DashboardPanelService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class DashboardPanelServiceImpl implements DashboardPanelService {
    @Override
    public String create(DashboardPanelDto dto) {
        return null;
    }

    @Override
    public void update(DashboardPanelDto dto) { }

    @Override
    public void remove(String id) { }
}
