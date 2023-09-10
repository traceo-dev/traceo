package org.traceo.api.services.queries;

import org.traceo.api.models.query.IncidentsQueryDto;
import org.traceo.common.transport.dto.api.IncidentDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

public interface IncidentQueryService {
    IncidentDto getIncident(String id);
    List<IncidentDto> getIncidents(IncidentsQueryDto query);
}
