package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.query.IncidentsQueryDto;
import org.traceo.api.services.queries.IncidentQueryService;
import org.traceo.common.transport.dto.api.IncidentDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

@Service
public class IncidentQueryServiceImpl implements IncidentQueryService {
    @Override
    public IncidentDto getIncident(String id) {
        return null;
    }

    @Override
    public List<IncidentDto> getIncidents(IncidentsQueryDto query) {
        return null;
    }
}
