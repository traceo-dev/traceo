package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.jpa.base.BaseRepository;
import org.traceo.common.jpa.entities.DashboardEntity;
import org.traceo.common.transport.dto.api.DashboardDto;

@Repository
public interface DashboardRepository extends BaseRepository<DashboardEntity> {
    @Transactional
    @Modifying
    @Query("UPDATE DashboardEntity d SET d.name = :#{#update.name}, d.description = :#{#update.description}, d.isEditable = :#{#update.isEditable}, d.isTimePicker = :#{#update.isTimePicker} WHERE d.id = :dashboardId")
    void update(@Param("dashboardId") String dashboardId, @Param("update") DashboardDto dto);
}
