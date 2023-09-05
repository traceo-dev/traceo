package org.traceo.api.services.queries;

import org.traceo.api.models.query.IncidentsQueryDto;
import org.traceo.common.transport.response.ApiResponse;

public interface IncidentQueryService {
    ApiResponse getIncident(String id);
    ApiResponse getIncidents(IncidentsQueryDto query);
}
