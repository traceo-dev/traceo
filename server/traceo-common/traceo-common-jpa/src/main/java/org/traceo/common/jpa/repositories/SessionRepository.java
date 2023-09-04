package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.traceo.common.jpa.entities.SessionEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, Long> {
    Optional<SessionEntity> findBySessionID(String sessionId);
    Optional<SessionEntity> findByUserID(String userId);
    void deleteBySessionID(String sessionId);
}
