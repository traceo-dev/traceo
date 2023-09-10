package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.services.queries.DashboardQueryService;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardPanelDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

@Service
public class DashboardQueryServiceImpl implements DashboardQueryService {
    @Override
    public DashboardDto getDashboard(String id) {
        return null;
    }

    @Override
    public DashboardPanelDto getDashboardPanel(String id) {
        return null;
    }

    @Override
    public List<DashboardPanelDto> getDashboardPanels(String id) {
        return null;
    }
}
