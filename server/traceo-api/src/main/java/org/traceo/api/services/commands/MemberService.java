package org.traceo.api.services.commands;

import org.traceo.api.models.dto.CreateMemberDto;
import org.traceo.api.models.dto.UpdateMemberDto;
import org.traceo.common.transport.response.ApiResponse;

public interface MemberService {
    ApiResponse create(CreateMemberDto dto);
    ApiResponse update(UpdateMemberDto dto);
    ApiResponse remove(String id);

    ApiResponse leave(String projectId);
}
