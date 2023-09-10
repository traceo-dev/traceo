package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.common.transport.dto.api.IncidentDto;
import org.traceo.api.services.commands.IncidentService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class IncidentServiceImpl implements IncidentService {
    @Override
    public void update(IncidentDto dto) { }

    @Override
    public void delete(String id) { }
}
