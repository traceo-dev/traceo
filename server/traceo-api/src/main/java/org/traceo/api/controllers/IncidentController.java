package org.traceo.api.controllers;

import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.dto.IncidentDto;
import org.traceo.api.models.query.IncidentsQueryDto;
import org.traceo.api.services.commands.IncidentService;
import org.traceo.api.services.queries.IncidentQueryService;
import org.traceo.common.transport.response.ApiResponse;

@RestController
@RequestMapping("/api/incident")
public class IncidentController {
    private final IncidentService incidentService;
    private final IncidentQueryService incidentQueryService;

    public IncidentController(IncidentService incidentService, IncidentQueryService incidentQueryService) {
        this.incidentService = incidentService;
        this.incidentQueryService = incidentQueryService;
    }

    @GetMapping("/{id}")
    private ApiResponse getIncident(@PathVariable String id) {
        return incidentQueryService.getIncident(id);
    }

    @GetMapping("/search")
    private ApiResponse getIncidents(IncidentsQueryDto query) {
        return incidentQueryService.getIncidents(query);
    }

    @PatchMapping
    private ApiResponse updateIncident(@RequestBody IncidentDto dto) {
        return incidentService.update(dto);
    }

    @DeleteMapping("/{id}")
    private ApiResponse deleteIncident(@PathVariable String id) {
        return incidentService.delete(id);
    }
}
