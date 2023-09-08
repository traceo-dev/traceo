package org.traceo.common.creators.builders;

import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.transport.dto.api.UserDto;

@Component
@Setter
public class UserBuilder {
    private static UserDto model;
    private String password;

    public UserBuilder() {
        model = new UserDto();
    }

    @Autowired
    PasswordEncoder passwordEncoder;

//    Entry method for builder
    public static UserBuilder standard() {
        model = new UserDto();
        return new UserBuilder();
    }

    public final UserBuilder withModel(UserDto dto) {
        model = dto;
        return this;
    }

    public final UserBuilder withPassword(String userPassword) {
        password = passwordEncoder.encode(userPassword);
        return this;
    }

//    Execute method for builder
    public final UserEntity build() {
        UserEntity entity = new UserEntity();

        entity.setAdmin(model.isAdmin());
        entity.setName(model.getName());
        entity.setStatus(model.getStatus());
        entity.setEmail(model.getEmail());
        entity.setUsername(model.getUsername());
        entity.setGravatar(model.getGravatar());
        entity.setStatus(model.getStatus());

        entity.setPassword(password);

        return entity;
    }
}
