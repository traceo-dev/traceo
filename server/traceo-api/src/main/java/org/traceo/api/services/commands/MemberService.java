package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.MemberDto;
import org.traceo.common.transport.response.ApiResponse;

public interface MemberService {
    ApiResponse create(MemberDto dto);
    ApiResponse update(MemberDto dto);
    ApiResponse remove(String id);

    ApiResponse leave(String projectId);
}
