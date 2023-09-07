package org.traceo.api.services.commands.impl;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.exceptions.UserNotExistsException;
import org.traceo.api.services.commands.UserService;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.SessionRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.api.models.dto.UserDto;
import org.traceo.common.transport.enums.UserStatusEnum;
import org.traceo.common.transport.response.ApiResponse;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ApiResponse create(UserDto dto) {
        Optional<UserEntity> userEntity = userRepository.findByUsernameOrEmail(dto.getUsername(), dto.getEmail());
        if (userEntity.isPresent()) {
            UserEntity user = userEntity.get();
            if (dto.getUsername().equals(user.getUsername())) {
                return ApiResponse.ofError("User with this username already exists.");
            }

            return ApiResponse.ofError("User with this email already exists.");
        }

        UserEntity entity = new UserEntity();
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setUsername(dto.getUsername());
        entity.setStatus(UserStatusEnum.INACTIVE);
        entity.setAdmin(false);
        entity.setPasswordUpdated(false);
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));

        UserEntity user = userRepository.save(entity);

        return ApiResponse.ofSuccess("New user account has been created", new CreateUserResponse(user.getId()));
    }

    @Override
    public ApiResponse update(UserDto dto) {
        if (dto.isAdmin() && ADMIN_EMAIL.equals(dto.getEmail())) {
            return ApiResponse.ofSuccess("The administrator account cannot be modified.");
        }

        try {
            Optional<UserEntity> userEntity = userRepository.findByUsername(dto.getUsername());
            if (userEntity.isEmpty()) {
                throw new UserNotExistsException();
            }

            UserEntity user = userEntity.get();
            user.setEmail(dto.getEmail());
            user.setName(dto.getName());
            user.setStatus(dto.getStatus());
            user.setAdmin(dto.isAdmin());

            userRepository.save(user);

            return ApiResponse.ofSuccess("User updated.");
        } catch (Exception e) {
            logger.error("Failed to update.", e);
            return ApiResponse.ofError("Failed to update.");
        }
    }

    @Override
    public ApiResponse delete(String id) {
        ContextDetails ctx = ContextHolder.getDetails();
        try {
            Optional<UserEntity> userEntity = userRepository.findById(ctx.getUserId());
            if (userEntity.isEmpty()) {
                throw new UserNotExistsException();
            }

            UserEntity user = userEntity.get();

            if (!user.isAdmin()) {
                return ApiResponse.ofError("Only users with admin role can remove other account");
            }

//            Removing all sessions
            sessionRepository.deleteAllByUserID(id);

//            Removing user account
            userRepository.deleteById(id);

            logger.info("User with id: {} removed.", id);

            return ApiResponse.ofSuccess("User successfully removed");
        } catch (Exception e) {
            logger.error("Failed to delete.", e);
            return ApiResponse.ofError("Failed to delete.");
        }
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    private record CreateUserResponse(String id) implements Serializable { }
}
