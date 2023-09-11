package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.exceptions.ResourceNotFoundException;
import org.traceo.common.jpa.entities.DashboardEntity;
import org.traceo.common.jpa.entities.DashboardPanelEntity;
import org.traceo.common.jpa.repositories.DashboardPanelRepository;
import org.traceo.common.jpa.repositories.DashboardRepository;
import org.traceo.common.transport.dto.api.DashboardPanelDto;
import org.traceo.api.services.commands.DashboardPanelService;

@Service
public class DashboardPanelServiceImpl implements DashboardPanelService {

    private final DashboardPanelRepository dashboardPanelRepository;
    private final DashboardRepository dashboardRepository;

    public DashboardPanelServiceImpl(DashboardPanelRepository dashboardPanelRepository, DashboardRepository dashboardRepository) {
        this.dashboardPanelRepository = dashboardPanelRepository;
        this.dashboardRepository = dashboardRepository;
    }

    @Override
    public String create(DashboardPanelDto dto) {
        DashboardEntity dashboard = dashboardRepository
                .findById(dto.getDashboardId())
                .orElseThrow(() -> new ResourceNotFoundException("Dashboard not found!"));

        try {
            DashboardPanelEntity entity = DashboardPanelEntity.mapToEntity(dto, dashboard);
            DashboardPanelEntity dashboardPanel = dashboardPanelRepository.save(entity);

            return dashboardPanel.getId();
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to create.", e);
        }
    }

    @Override
    @Transactional
    public void update(DashboardPanelDto dto) {
        try {
//            TODO:
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to remove.", e);
        }
    }

    @Override
    public void remove(String id) {
        try {
            dashboardPanelRepository.deleteById(id);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to remove.", e);
        }
    }
}
