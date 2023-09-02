package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "traceo_user_session")
@Getter
@Setter
public class SessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "session_seq")
    @SequenceGenerator(name = "session_seq", sequenceName = "session_sequence", allocationSize = 1)
    private Long id;

    @Column(unique = true, name = "session_id")
    private String sessionID;

    @Column(nullable = false, name = "user_id")
    private String userID;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, name = "user_ip")
    private String userIP;

    @Column(nullable = false, name = "expiry_at")
    private BigDecimal expiryAt;

    @Column
    private BigDecimal revokedAt;
}
