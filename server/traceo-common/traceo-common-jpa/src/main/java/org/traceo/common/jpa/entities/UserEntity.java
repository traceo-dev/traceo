package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Session;
import org.traceo.common.transport.enums.UserStatusEnum;

import java.util.Set;

@Entity
@Table(name = "traceo_user")
@Getter @Setter
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 1)
    private Long id;

    private String name;
    private String username;

    @Column(unique = true)
    private String email;
    private String password;

    private String gravatar;
    private UserStatusEnum status;

    @Column(name = "is_admin")
    private boolean isAdmin;

    @Column(name = "is_password_updated")
    private boolean isPasswordUpdated;

    @Column(name = "last_active_at")
    private Long lastActiveAt;
}
