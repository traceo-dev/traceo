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
public class DashboardEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

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
