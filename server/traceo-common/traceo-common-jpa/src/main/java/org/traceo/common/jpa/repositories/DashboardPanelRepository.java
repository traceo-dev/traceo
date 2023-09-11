package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.jpa.entities.DashboardPanelEntity;
import org.traceo.common.transport.dto.PanelGridPosition;

@Repository
public interface DashboardPanelRepository extends JpaRepository<DashboardPanelEntity, String> {
//    @Transactional
//    @Modifying
//    @Query("UPDATE DashboardPanelEntity p SET p")
//    void update(@Param("panelId") String panelId, @Param("update") PanelGridPosition update);
}
