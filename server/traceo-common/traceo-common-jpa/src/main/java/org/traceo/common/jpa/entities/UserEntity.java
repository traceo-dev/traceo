package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.traceo.common.jpa.base.BaseEntity;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.enums.UserStatus;


@Entity
@Table(name = "traceo_user")
@Getter @Setter
public class UserEntity extends BaseEntity {

    private String name;
    private String username;

    @Column(unique = true)
    private String email;
    private String password;

    private String gravatar;
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "is_admin")
    private boolean isAdmin;

    @Column(name = "is_password_updated")
    private boolean isPasswordUpdated;

    @Column(name = "last_active_at")
    private Long lastActiveAt;

    public static UserDto mapToModel(UserEntity entity) {
        UserDto dto = new UserDto();
        dto.setName(entity.getName());
        dto.setAdmin(entity.isAdmin());
        dto.setStatus(entity.getStatus());
        dto.setEmail(entity.getEmail());
        dto.setUsername(entity.getUsername());
        dto.setGravatar(entity.getGravatar());
        return dto;
    }
}
