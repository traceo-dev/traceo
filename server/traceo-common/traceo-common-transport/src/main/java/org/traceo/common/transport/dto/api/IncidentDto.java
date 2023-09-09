package org.traceo.common.transport.dto.api;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.IncidentStatus;

@Getter @Setter
public class IncidentDto {
    private IncidentStatus status;
    private String assignedId;
}
