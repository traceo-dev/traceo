package org.traceo.api.services.commands.impl;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.exceptions.*;
import org.traceo.api.services.commands.UserService;
import org.traceo.common.creators.builders.UserBuilder;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.security.config.ContextHolder;
import org.traceo.security.model.ContextDetails;

import java.io.Serializable;
import java.util.Optional;

@Slf4j
@Transactional
@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private static final String ADMIN_EMAIL = "admin@localhost";

    private final  UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public UserServiceImpl(UserRepository userRepository, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    public String create(UserDto dto) {
        Optional<UserEntity> userEntity = userRepository.findByUsernameOrEmail(dto.getUsername(), dto.getEmail());
        if (userEntity.isPresent()) {
            UserEntity user = userEntity.get();
            if (dto.getUsername().equals(user.getUsername())) {
                throw new NotUniqueField("User with this username already exists.");
            }

            throw new NotUniqueField("User with this email already exists.");
        }

        UserEntity entity = UserBuilder
                .standard()
                .withModel(dto)
                .withPassword(dto.getPassword())
                .build();

        UserEntity user = userRepository.save(entity);

        return user.getId();
    }

    @Override
    public void update(UserDto dto) {
        if (dto.isAdmin() && ADMIN_EMAIL.equals(dto.getEmail())) {
            throw new ModifyException("The administrator account cannot be modified.");
        }

//        UserEntity userEntity = userRepository
//                .findByUsername(dto.getUsername())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        try {
            userRepository.updateByUsername(dto.getUsername(), dto);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void delete(String id) {
        ContextDetails ctx = ContextHolder.getDetails();
        UserEntity user = userRepository
                .findById(ctx.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!user.isAdmin()) {
            throw new PermissionException("Only users with admin role can remove other account");
        }

        UserEntity updateUser = userRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (updateUser.getEmail().equals("admin@localhost")) {
            throw new ModifyException("Cannot remove root admin account.");
        }

        try {
//            Removing all sessions
            sessionRepository.deleteAllByUserID(id);

//            Removing user account
            userRepository.deleteById(id);

            logger.info("User with id: {} removed.", id);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
