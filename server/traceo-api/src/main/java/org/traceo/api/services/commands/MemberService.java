package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.MemberDto;
import org.traceo.common.transport.response.ApiResponse;

public interface MemberService {
    String create(MemberDto dto);
    void update(MemberDto dto);
    void remove(String id);

    void leave(String projectId);
}
