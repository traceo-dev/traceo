package org.traceo.api.services.commands.impl;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.services.commands.UserService;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.api.models.dto.UserDto;
import org.traceo.common.transport.enums.UserStatusEnum;
import org.traceo.common.transport.response.ApiResponse;

import java.io.Serializable;
import java.util.Optional;

@Slf4j
@Transactional
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

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
        return null;
    }

    @Override
    public ApiResponse delete(String id) {
        return null;
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    private static class CreateUserResponse implements Serializable {
        private final String id;
        public CreateUserResponse(String id) {
            this.id = id;
        }
    }
}
