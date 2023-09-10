package org.traceo.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.traceo.common.transport.dto.api.IncidentDto;
import org.traceo.api.models.query.IncidentsQueryDto;
import org.traceo.api.services.commands.IncidentService;
import org.traceo.api.services.queries.IncidentQueryService;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

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
    private ResponseEntity<ApiResponse> getIncident(@PathVariable String id) {
        IncidentDto response = incidentQueryService.getIncident(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }

    @GetMapping("/search")
    private ResponseEntity<ApiResponse> getIncidents(IncidentsQueryDto query) {
        List<IncidentDto> response = incidentQueryService.getIncidents(query);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }

    @PatchMapping
    private ResponseEntity<ApiResponse> updateIncident(@RequestBody IncidentDto dto) {
        incidentService.update(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    private ResponseEntity<ApiResponse> deleteIncident(@PathVariable String id) {
        incidentService.delete(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.OK);
    }
}
