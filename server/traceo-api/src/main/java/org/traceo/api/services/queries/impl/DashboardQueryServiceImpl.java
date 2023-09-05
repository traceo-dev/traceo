package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.services.queries.DashboardQueryService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class DashboardQueryServiceImpl implements DashboardQueryService {
    @Override
    public ApiResponse getDashboard(String id) {
        return null;
    }

    @Override
    public ApiResponse getDashboardPanel(String id) {
        return null;
    }

    @Override
    public ApiResponse getDashboardPanels(String id) {
        return null;
    }
}
