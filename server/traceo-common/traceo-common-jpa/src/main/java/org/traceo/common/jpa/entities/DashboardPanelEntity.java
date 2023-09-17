package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.traceo.common.transport.dto.PanelConfigurationDto;
import org.traceo.common.transport.dto.PanelGridPosition;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.DashboardPanelDto;

import java.util.Objects;

@Entity
@Table(name = "traceo_dashboard_panel")
@Getter
@Setter
public class DashboardPanelEntity extends BaseEntity {
    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false, name = "grid_position")
    @JdbcTypeCode(value = SqlTypes.JSON)
    private PanelGridPosition gridPosition;

    @Column(nullable = false)
    @JdbcTypeCode(value = SqlTypes.JSON)
    private PanelConfigurationDto config;

    @ManyToOne(cascade = {
            CascadeType.REMOVE,
            CascadeType.PERSIST
    })
    private DashboardEntity dashboard;

    public static DashboardPanelEntity mapToEntity(DashboardPanelDto dto, DashboardEntity dashboard) {
        DashboardPanelEntity entity = new DashboardPanelEntity();
        entity.setDashboard(dashboard);
        entity.setGridPosition(dto.getGridPosition());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setConfig(dto.getConfig());
        return entity;
    }

    public static DashboardPanelDto mapToModel(DashboardPanelEntity entity) {
        DashboardPanelDto dto = new DashboardPanelDto();
        dto.setGridPosition(entity.getGridPosition());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setConfig(entity.getConfig());

        if (!Objects.isNull(entity.getDashboard())) {
            dto.setDashboardId(entity.getDashboard().getId());
        }

        return dto;
    }
}
