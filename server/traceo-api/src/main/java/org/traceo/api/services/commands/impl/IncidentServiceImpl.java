package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.dto.UpdateIncidentDto;
import org.traceo.api.services.commands.IncidentService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class IncidentServiceImpl implements IncidentService {
    @Override
    public ApiResponse update(UpdateIncidentDto dto) {
        return null;
    }

    @Override
    public ApiResponse delete(String id) {
        return null;
    }
}
