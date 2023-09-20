package org.traceo.api.services.queries.impl;

import org.springframework.stereotype.Service;
import org.traceo.api.exceptions.ResourceNotFoundException;
import org.traceo.api.services.queries.AuthQueryService;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.security.config.ContextHolder;
import org.traceo.security.model.ContextDetails;

@Service
public class AuthQueryServiceImpl implements AuthQueryService {

    private final UserRepository userRepository;

    public AuthQueryServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto getSignedInUser() {
        ContextDetails ctx = ContextHolder.getDetails();
        return userRepository.findById(ctx.getUserId())
                .map(UserEntity::mapToModel)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
