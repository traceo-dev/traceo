package org.traceo.api.models.query;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.IncidentStatusEnum;
import org.traceo.common.transport.query.BaseDtoQuery;

@Getter @Setter
public class IncidentsQueryDto extends BaseDtoQuery {
    private IncidentStatusEnum status;
}
