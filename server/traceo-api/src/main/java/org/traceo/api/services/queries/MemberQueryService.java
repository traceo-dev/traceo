package org.traceo.api.services.queries;

import org.traceo.api.models.query.MembersQueryDto;
import org.traceo.common.transport.dto.api.MemberDto;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

public interface MemberQueryService {
    List<MemberDto> getMembers(MembersQueryDto query);
}
