package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.DashboardPanelDto;
import org.traceo.common.transport.response.ApiResponse;

public interface DashboardPanelService {
    String create(DashboardPanelDto dto);
    void update(DashboardPanelDto dto);
    void remove(String id);
}
