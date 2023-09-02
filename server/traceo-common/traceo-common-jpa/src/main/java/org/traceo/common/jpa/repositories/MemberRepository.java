package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.traceo.common.jpa.entities.MemberEntity;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
}
