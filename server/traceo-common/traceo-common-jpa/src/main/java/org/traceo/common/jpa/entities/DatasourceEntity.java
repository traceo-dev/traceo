package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.traceo.common.transport.dto.DatasourceConfigurationDto;
import org.traceo.common.transport.enums.DatasourceProvider;

@Entity
@Table(name = "traceo_datasource")
@Getter
@Setter
public class DatasourceEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    @JdbcTypeCode(value = SqlTypes.JSON)
    private DatasourceConfigurationDto config;

    @Column(nullable = false)
    private DatasourceProvider provider = DatasourceProvider.HTTP;

    @ManyToOne(cascade = {
            CascadeType.REMOVE,
            CascadeType.PERSIST
    })
    @JoinColumn(name = "project_id")
    private ProjectEntity project;
}
