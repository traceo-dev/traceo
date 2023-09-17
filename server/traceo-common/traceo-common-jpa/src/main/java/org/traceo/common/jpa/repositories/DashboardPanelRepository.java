package org.traceo.common.jpa.repositories;

import org.springframework.stereotype.Repository;
import org.traceo.common.jpa.base.BaseRepository;
import org.traceo.common.jpa.entities.DashboardPanelEntity;

@Repository
public interface DashboardPanelRepository extends BaseRepository<DashboardPanelEntity> {
//    @Transactional
//    @Modifying
//    @Query("UPDATE DashboardPanelEntity p SET p")
//    void update(@Param("panelId") String panelId, @Param("update") PanelGridPosition update);
}
