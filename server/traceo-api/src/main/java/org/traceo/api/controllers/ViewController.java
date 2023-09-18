package org.traceo.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.traceo.api.models.response.ViewConfigResponse;
import org.traceo.api.services.queries.ViewQueryService;
import org.traceo.common.transport.response.ApiResponse;

@RequestMapping("/api/v1/view")
public class ViewController {

    private final ViewQueryService viewQueryService;

    public ViewController(ViewQueryService viewQueryService) {
        this.viewQueryService = viewQueryService;
    }


    @GetMapping("/config")
    public ResponseEntity<ApiResponse> getConfig(HttpServletRequest request) {
        ViewConfigResponse response = viewQueryService.getViewConfigData(request);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }
}
