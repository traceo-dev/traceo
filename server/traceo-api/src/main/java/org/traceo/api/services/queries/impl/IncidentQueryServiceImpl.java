package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.query.IncidentsQueryDto;
import org.traceo.api.services.queries.IncidentQueryService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class IncidentQueryServiceImpl implements IncidentQueryService {
    @Override
    public ApiResponse getIncident(String id) {
        return null;
    }

    @Override
    public ApiResponse getIncidents(IncidentsQueryDto query) {
        return null;
    }
}
