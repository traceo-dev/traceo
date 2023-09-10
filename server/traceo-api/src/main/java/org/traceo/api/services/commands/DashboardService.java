package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardLayoutDto;
import org.traceo.common.transport.response.ApiResponse;

public interface DashboardService {
    String create(DashboardDto dto);
    void update(DashboardDto dto);
    void remove(String id);

    void updateLayout(DashboardLayoutDto dto);
}
