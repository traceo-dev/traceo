package org.traceo.api.controllers;

import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.dto.*;
import org.traceo.api.services.commands.DashboardPanelService;
import org.traceo.api.services.commands.DashboardService;
import org.traceo.api.services.queries.DashboardQueryService;
import org.traceo.common.transport.response.ApiResponse;

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
    private ApiResponse getDashboard(@PathVariable String id) {
        return dashboardQueryService.getDashboard(id);
    }

    @GetMapping("/{id}/panels")
    private ApiResponse getDashboardPanels(@PathVariable String id) {
        return dashboardQueryService.getDashboardPanels(id);
    }

    @GetMapping("/panel/{id}")
    private ApiResponse getDashboardPanel(@PathVariable String id) {
        return dashboardQueryService.getDashboardPanel(id);
    }

    @PostMapping
    private ApiResponse createDashboard(@RequestBody DashboardDto dto) {
        return dashboardService.create(dto);
    }

    @PostMapping("/panel")
    private ApiResponse createDashboardPanel(@RequestBody DashboardPanelDto dto) {
        return dashboardPanelService.create(dto);
    }

    @PatchMapping()
    private ApiResponse updateDashboard(@RequestBody DashboardDto dto) {
        return dashboardService.update(dto);
    }

    @PatchMapping("/panel")
    private ApiResponse updateDashboardPanel(@RequestBody DashboardPanelDto dto) {
        return dashboardPanelService.update(dto);
    }

    @PatchMapping("/layout")
    private ApiResponse updateDashboardLayout(@RequestBody DashboardLayoutDto dto) {
        return dashboardService.updateLayout(dto);
    }

    @DeleteMapping()
    private ApiResponse removeDashboard(@RequestParam String dashboardId, @RequestParam String projectId) {
        return dashboardService.remove(dashboardId);
    }

    @DeleteMapping("/panel/{id}")
    private ApiResponse removePanel(@PathVariable String id) {
        return dashboardPanelService.remove(id);
    }
}
