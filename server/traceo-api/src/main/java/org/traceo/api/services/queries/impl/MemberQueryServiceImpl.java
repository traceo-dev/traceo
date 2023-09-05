package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.models.query.MembersQueryDto;
import org.traceo.api.services.queries.MemberQueryService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class MemberQueryServiceImpl implements MemberQueryService {
    @Override
    public ApiResponse getMembers(MembersQueryDto query) {
        return null;
    }
}
