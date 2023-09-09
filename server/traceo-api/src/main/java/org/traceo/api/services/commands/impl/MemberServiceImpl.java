package org.traceo.api.services.commands.impl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.creators.builders.MemberBuilder;
import org.traceo.common.jpa.entities.MemberEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.MemberRepository;
import org.traceo.common.jpa.repositories.ProjectRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.dto.api.MemberDto;
import org.traceo.api.services.commands.MemberService;
import org.traceo.common.transport.response.ApiResponse;

import java.util.Optional;

@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public ApiResponse create(MemberDto dto) {
        ProjectEntity project = projectRepository.findById(dto.getProjectId()).orElseThrow(EntityNotFoundException::new);
        UserEntity user = userRepository.findById(dto.getUserId()).orElseThrow(EntityNotFoundException::new);

        MemberEntity member = MemberBuilder.standard()
                .withProject(project)
                .withUser(user)
                .withRole(dto.getRole())
                .build();

        return ApiResponse.ofSuccess("Member created.");
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
