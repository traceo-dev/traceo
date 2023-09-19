package org.traceo.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.response.CreateResponse;
import org.traceo.api.services.commands.DashboardPanelService;
import org.traceo.api.services.commands.DashboardService;
import org.traceo.api.services.queries.DashboardQueryService;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardLayoutDto;
import org.traceo.common.transport.dto.api.DashboardPanelDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final DashboardPanelService dashboardPanelService;
    private final DashboardQueryService dashboardQueryService;

    public DashboardController(DashboardService dashboardService, DashboardPanelService dashboardPanelService, DashboardQueryService dashboardQueryService) {
        this.dashboardService = dashboardService;
        this.dashboardPanelService = dashboardPanelService;
        this.dashboardQueryService = dashboardQueryService;
    }

    @GetMapping("/{id}")
    private ResponseEntity<ApiResponse> getDashboard(@PathVariable String id) {
        DashboardDto response = dashboardQueryService.getDashboard(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }

    @GetMapping("/{id}/panels")
    private ResponseEntity<ApiResponse> getDashboardPanels(@PathVariable String id) {
        List<DashboardPanelDto> response = dashboardQueryService.getDashboardPanels(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }

    @GetMapping("/panel/{id}")
    private ResponseEntity<ApiResponse> getDashboardPanel(@PathVariable String id) {
        DashboardPanelDto response = dashboardQueryService.getDashboardPanel(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }

    @PostMapping
    private ResponseEntity<ApiResponse> createDashboard(@RequestBody DashboardDto dto) {
        String id = dashboardService.create(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(new CreateResponse((id))), HttpStatus.CREATED);
    }

    @PostMapping("/panel")
    private ResponseEntity<ApiResponse> createDashboardPanel(@RequestBody DashboardPanelDto dto) {
        String id = dashboardPanelService.create(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(new CreateResponse((id))), HttpStatus.CREATED);
    }

    @PatchMapping()
    private ResponseEntity<ApiResponse> updateDashboard(@RequestBody DashboardDto dto) {
        dashboardService.update(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/panel")
    private ResponseEntity<ApiResponse> updateDashboardPanel(@RequestBody DashboardPanelDto dto) {
        dashboardPanelService.update(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/layout")
    private ResponseEntity<ApiResponse> updateDashboardLayout(@RequestBody DashboardLayoutDto dto) {
        dashboardService.updateLayout(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }

    @DeleteMapping()
    private ResponseEntity<ApiResponse> removeDashboard(@RequestParam String dashboardId, @RequestParam String projectId) {
        dashboardService.remove(dashboardId);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/panel/{id}")
    private ResponseEntity<ApiResponse> removePanel(@PathVariable String id) {
        dashboardPanelService.remove(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }
}
