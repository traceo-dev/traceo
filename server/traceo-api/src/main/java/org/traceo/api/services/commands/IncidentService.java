package org.traceo.api.services.commands;

import org.traceo.api.models.dto.IncidentDto;
import org.traceo.common.transport.response.ApiResponse;

public interface IncidentService {
    ApiResponse update(IncidentDto dto);
    ApiResponse delete(String id);
}
