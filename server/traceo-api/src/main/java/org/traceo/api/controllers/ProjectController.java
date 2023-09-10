package org.traceo.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.response.CreateResponse;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.services.commands.ProjectService;
import org.traceo.api.services.queries.ProjectQueryService;
import org.traceo.common.transport.enums.MemberRole;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/project")
public class ProjectController {
    private final ProjectService projectService;
    private final ProjectQueryService projectQueryService;

    private ProjectController(ProjectService projectService, ProjectQueryService projectQueryService) {
        this.projectService = projectService;
        this.projectQueryService = projectQueryService;
    }

    @GetMapping("/{id}")
    private ResponseEntity<ApiResponse> getProject(@PathVariable String id) {
        ProjectDto response = projectQueryService.getProject(id);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess(response),
                HttpStatus.OK
        );
    }

    @GetMapping("/search")
    private ResponseEntity<ApiResponse> getProjects(ProjectsQueryDto query) {
        List<ProjectDto> response = projectQueryService.getProjects(query);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess(response),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}/permission")
    private ResponseEntity<ApiResponse> getPermission(@PathVariable String id) {
        MemberRole response = projectQueryService.getPermission(id);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess(response),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}/dashboard")
    private ResponseEntity<ApiResponse> getDashboards(@PathVariable String id) {
        List<DashboardDto> response =  projectQueryService.getDashboards(id);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess(response),
                HttpStatus.OK
        );
    }

    @PostMapping
    private ResponseEntity<ApiResponse> create(@RequestBody ProjectDto dto) {
        String id = projectService.create(dto);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess("Project created.", new CreateResponse(id)),
                HttpStatus.OK
        );
    }

    @PatchMapping("/{id}")
    private ResponseEntity<ApiResponse> update(@PathVariable String id, @RequestBody ProjectDto dto) {
        projectService.update(id, dto);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess("Project updated."),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    private ResponseEntity<ApiResponse> delete(@PathVariable String id) {
        projectService.delete(id);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess("Project removed."),
                HttpStatus.OK
        );
    }

    @PostMapping("/api-key/generate/{id}")
    private ResponseEntity<ApiResponse> generateApiKey(@PathVariable String id) {
        projectService.generateApiKey(id);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess("Api key has been generated."),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/api-key/remove/{id}")
    private ResponseEntity<ApiResponse> removeApiKey(@PathVariable String id) {
        projectService.removeApiKey(id);

        return new ResponseEntity<>(
                ApiResponse.ofSuccess("Api key has been removed."),
                HttpStatus.OK
        );
    }
}
