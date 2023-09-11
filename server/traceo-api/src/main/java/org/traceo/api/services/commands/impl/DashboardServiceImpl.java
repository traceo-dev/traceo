package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.exceptions.ResourceNotFoundException;
import org.traceo.common.jpa.entities.DashboardEntity;
import org.traceo.common.jpa.entities.DashboardPanelEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.jpa.repositories.DashboardPanelRepository;
import org.traceo.common.jpa.repositories.DashboardRepository;
import org.traceo.common.jpa.repositories.ProjectRepository;
import org.traceo.common.transport.dto.PanelGridPosition;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardLayoutDto;
import org.traceo.api.services.commands.DashboardService;

@Service
@Transactional
public class DashboardServiceImpl implements DashboardService {

    private final DashboardRepository dashboardRepository;
    private final DashboardPanelRepository dashboardPanelRepository;
    private final ProjectRepository projectRepository;

    public DashboardServiceImpl(DashboardRepository dashboardRepository, DashboardPanelRepository dashboardPanelRepository, ProjectRepository projectRepository) {
        this.dashboardRepository = dashboardRepository;
        this.dashboardPanelRepository = dashboardPanelRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public String create(DashboardDto dto) {
        ProjectEntity project = projectRepository
                .findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found."));

        try {
            DashboardEntity dashboardEntity = DashboardEntity.mapToEntity(dto, project);
            DashboardEntity dashboard = dashboardRepository.save(dashboardEntity);
            return dashboard.getId();
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to create dashboard.", e);
        }
    }

    @Override
    public void update(DashboardDto dto) {
        try {
            dashboardRepository.update(dto.getDashboardId(), dto);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to update dashboard.", e);
        }
    }

    @Override
    public void remove(String id) {
        try {
            dashboardRepository.deleteById(id);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to remove dashboard.", e);
        }
    }

    @Override
    @Transactional
    public void updateLayout(DashboardLayoutDto dto) {
        try {
            dto.getPositions()
                    .parallelStream()
                    .forEach(position -> {
                        dashboardPanelRepository
                                .findById(position.getI())
                                .ifPresent(panelEntity -> panelEntity.setGridPosition(position));
                    });

        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to update layout.", e);
        }
    }
}
