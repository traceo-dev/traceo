package org.traceo.api.services.queries;

import org.traceo.common.transport.response.ApiResponse;

public interface DashboardQueryService {
    ApiResponse getDashboard(String id);
    ApiResponse getDashboardPanel(String id);
    ApiResponse getDashboardPanels(String id);
}
