package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.transport.enums.UserStatusEnum;


@Entity
@Table(name = "traceo_user")
@Getter @Setter
public class UserEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String username;

    @Column(unique = true)
    private String email;
    private String password;

    private String gravatar;
    private UserStatusEnum status = UserStatusEnum.ACTIVE;

    @Column(name = "is_admin")
    private boolean isAdmin;

    @Column(name = "is_password_updated")
    private boolean isPasswordUpdated;

    @Column(name = "last_active_at")
    private long lastActiveAt;
}
