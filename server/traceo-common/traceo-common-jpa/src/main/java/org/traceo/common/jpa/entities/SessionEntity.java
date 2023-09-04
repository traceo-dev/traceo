package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "traceo_user_session")
@Getter
@Setter
public class SessionEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, name = "session_id")
    private String sessionID;

    @Column(nullable = false, name = "user_id")
    private String userID;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, name = "user_ip")
    private String userIP;

    @Column(nullable = false, name = "expiry_at")
    private long expiryAt;

    @Column
    private long revokedAt;
}
