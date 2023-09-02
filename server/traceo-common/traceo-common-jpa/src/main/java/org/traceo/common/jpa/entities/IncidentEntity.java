package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.traceo.common.transport.dto.IncidentTraceDto;
import org.traceo.common.transport.enums.IncidentStatusEnum;
import org.traceo.common.transport.enums.SdkEnum;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "traceo_incident")
@Getter
@Setter
public class IncidentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "incident_seq")
    @SequenceGenerator(name = "incident_seq", sequenceName = "incident_sequence", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private SdkEnum sdk;

    @Column(nullable = false)
    private IncidentStatusEnum status;

    @Column(nullable = false)
    private String name;

    private String stack;
    private String message;

    @Column(name = "last_event_at")
    private BigDecimal lastEventAt;

    @Column(name = "events_count")
    private Long eventsCount = 0L;

    @ManyToOne(cascade = {
            CascadeType.REMOVE,
            CascadeType.PERSIST
    })
    @JoinColumn(name = "project_id")
    private ProjectEntity project;

    @ManyToOne()
    @JoinColumn(name = "assigned_id")
    private UserEntity assigned;

    @JdbcTypeCode(value = SqlTypes.JSON)
    private Map<String, String> platform = new HashMap<>();

    @JdbcTypeCode(value = SqlTypes.JSON)
    private List<IncidentTraceDto> traces = new ArrayList<>();
}
