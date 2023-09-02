package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.traceo.common.jpa.entities.DashboardEntity;

@Repository
public interface DashboardRepository extends JpaRepository<DashboardEntity, Long> {

}
