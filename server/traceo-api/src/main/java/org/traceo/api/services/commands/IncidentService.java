package org.traceo.api.services.commands;

import org.traceo.api.models.dto.UpdateIncidentDto;
import org.traceo.common.transport.response.ApiResponse;

public interface IncidentService {
    ApiResponse update(UpdateIncidentDto dto);
    ApiResponse delete(String id);
}
