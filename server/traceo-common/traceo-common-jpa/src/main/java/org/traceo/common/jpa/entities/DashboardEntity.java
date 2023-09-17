package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.traceo.common.jpa.base.BaseEntity;
import org.traceo.common.transport.dto.api.DashboardDto;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "traceo_dashboard")
@Getter
@Setter
public class DashboardEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;
    private boolean isBase = false;
    private boolean isEditable = true;
    private boolean isTimePicker = true;

    @ManyToOne(cascade = {
            CascadeType.REMOVE
    })
    @JoinColumn(name = "project_id")
    private ProjectEntity project;

    @OneToMany(cascade = {
            CascadeType.REMOVE,
            CascadeType.PERSIST
    })
    private List<DashboardPanelEntity> panels = new ArrayList<>();

    public static DashboardEntity mapToEntity(DashboardDto dto, ProjectEntity project) {
        DashboardEntity entity = new DashboardEntity();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setProject(project);
        return entity;
    }

    public static DashboardDto mapToModel(DashboardEntity entity) {
        DashboardDto dto = new DashboardDto();
        dto.setDashboardId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setEditable(entity.isEditable());
        dto.setTimePicker(entity.isTimePicker());
        return dto;
    }

    public static DashboardEntity createDefaultForProject(ProjectEntity project) {
        DashboardEntity entity = new DashboardEntity();
        entity.setName("Base dashboard");
        entity.setProject(project);
        entity.setBase(true);
        entity.setTimePicker(true);
        entity.setEditable(true);

        return entity;
    }
}
