package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.common.transport.dto.api.MemberDto;
import org.traceo.api.services.commands.MemberService;
import org.traceo.common.transport.response.ApiResponse;

@Service
public class MemberServiceImpl implements MemberService {
    @Override
    public ApiResponse create(MemberDto dto) {
        return null;
    }

    @Override
    public ApiResponse update(MemberDto dto) {
        return null;
    }

    @Override
    public ApiResponse remove(String id) {
        return null;
    }

    @Override
    public ApiResponse leave(String projectId) {
        return null;
    }
}
