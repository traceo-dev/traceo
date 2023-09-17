package org.traceo.api.services.commands.impl;

import org.springframework.stereotype.Service;
import org.traceo.common.transport.dto.api.MemberDto;
import org.traceo.api.services.commands.MemberService;

@Service
public class MemberServiceImpl implements MemberService {
    @Override
    public String create(MemberDto dto) {
        return null;
    }

    @Override
    public void update(MemberDto dto) { }

    @Override
    public void remove(String id) { }

    @Override
    public void leave(String projectId) { }
}
