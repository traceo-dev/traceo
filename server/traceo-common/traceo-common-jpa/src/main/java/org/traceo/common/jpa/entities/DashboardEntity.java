package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "traceo_dashboard")
@Getter
@Setter
public class DashboardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dashboard_seq")
    @SequenceGenerator(name = "dashboard_seq", sequenceName = "dashboard_sequence", allocationSize = 1)
    private Long id;

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
}
