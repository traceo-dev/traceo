package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.traceo.common.transport.dto.PanelConfigurationDto;
import org.traceo.common.transport.dto.PanelGridPosition;

@Entity
@Table(name = "traceo_dashboard_panel")
@Getter
@Setter
public class DashboardPanelEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

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
}
