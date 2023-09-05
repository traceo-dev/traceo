package org.traceo.api.models.dto;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.IncidentStatusEnum;

@Getter @Setter
public class IncidentDto {
    private IncidentStatusEnum status;
    private String assignedId;
}
