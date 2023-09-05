package org.traceo.api.controllers;

import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.dto.CreateProjectDto;
import org.traceo.api.models.dto.UpdateProjectDto;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.services.commands.ProjectService;
import org.traceo.api.services.queries.ProjectQueryService;
import org.traceo.common.transport.response.ApiResponse;

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
    private ApiResponse getProject(@PathVariable String id) {
        return projectQueryService.getProject(id);
    }

    @GetMapping("/search")
    private ApiResponse getProjects(ProjectsQueryDto query) {
        return projectQueryService.getProjects(query);
    }

    @GetMapping("/{id}/permission")
    private ApiResponse getPermission(@PathVariable String id) {
        return projectQueryService.getPermission(id);
    }

    @GetMapping("/{id}/dashboard")
    private ApiResponse getDashboards(@PathVariable String id) {
        return projectQueryService.getDashboards(id);
    }

    @PostMapping
    private ApiResponse create(@RequestBody CreateProjectDto dto) {
        return projectService.create(dto);
    }

    @PatchMapping
    private ApiResponse update(@RequestBody UpdateProjectDto dto) {
        return projectService.update(dto);
    }

    @DeleteMapping("/{id}")
    private ApiResponse delete(@PathVariable String id) {
        return projectService.delete(id);
    }

    @PostMapping("/api-key/generate/{id}")
    private ApiResponse generateApiKey(@PathVariable String id) {
        return projectService.generateApiKey(id);
    }

    @DeleteMapping("/api-key/remove/{id}")
    private ApiResponse removeApiKey(@PathVariable String id) {
        return projectService.removeApiKey(id);
    }
}
