package org.traceo.api.services.queries;

import org.traceo.api.models.query.MembersQueryDto;
import org.traceo.common.transport.response.ApiResponse;

public interface MemberQueryService {
    ApiResponse getMembers(MembersQueryDto query);
}
