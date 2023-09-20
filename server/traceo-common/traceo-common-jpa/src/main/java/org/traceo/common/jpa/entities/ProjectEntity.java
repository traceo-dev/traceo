package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;
import org.traceo.common.jpa.base.BaseEntity;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.enums.TraceoSdk;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "traceo_project")
@Getter
@Setter
public class ProjectEntity extends BaseEntity {

    @Column(unique = true)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private TraceoSdk sdk;

    @Column(name = "api_key")
    private String apiKey;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private UserEntity owner;

    private String gravatar;

    @Column(name = "last_event_at")
    private long lastEventAt;

    @Column(name = "is_integrated")
    private boolean isIntegrated = false;

    @Column(name = "main_dashboard_id")
    private String mainDashboardId;

    @OneToMany(cascade = {
            CascadeType.REMOVE
    })
    private Set<IncidentEntity> incidents = new HashSet<>();

    @OneToMany(cascade = {
            CascadeType.PERSIST,
            CascadeType.REMOVE
    }, mappedBy = "project", targetEntity = MemberEntity.class)
    private Set<MemberEntity> members = new HashSet<>();

    @OneToMany(cascade = {
            CascadeType.PERSIST,
            CascadeType.REMOVE
    }, mappedBy = "project")
    private Set<DashboardEntity> dashboards = new HashSet<>();

    @OneToMany(cascade = {
            CascadeType.PERSIST,
            CascadeType.REMOVE
    }, mappedBy = "project")
    private Set<DatasourceEntity> datasources = new HashSet<>();

    @Formula("(SELECT COUNT(*) FROM traceo_project_member m WHERE m.project_id = id)")
    private int membersCount = 0;

    @Formula("(SELECT COUNT(*) FROM traceo_incident i WHERE i.project_id = id)")
    private int incidentsCount = 0;

    public static ProjectEntity mapToEntity(ProjectDto projectDto) {
        ProjectEntity entity = new ProjectEntity();
        entity.setName(projectDto.getName());
        entity.setDescription(projectDto.getDescription());
        entity.setSdk(projectDto.getSdk());
        return entity;
    }

    public static ProjectDto mapToModel(ProjectEntity entity) {
        ProjectDto dto = new ProjectDto();
        dto.setId(entity.getId());
        dto.setMainDashboardId(entity.getMainDashboardId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setSdk(entity.getSdk());
        dto.setIncidentsCount(entity.getIncidentsCount());
        dto.setMembersCount(entity.getMembersCount());
        dto.setGravatar(entity.getGravatar());
        return dto;
    }
}
