package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.jpa.base.BaseRepository;
import org.traceo.common.jpa.entities.DashboardEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.enums.MemberRole;

import java.util.Optional;

@Repository
public interface ProjectRepository extends BaseRepository<ProjectEntity> {
    Optional<ProjectEntity> findByName(String name);

    void removeById(String id);

    @Query("SELECT d FROM DashboardEntity d LEFT JOIN FETCH d.project p WHERE p.id = :projectId")
    Optional<DashboardEntity> findProjectDashboards(@Param("projectId") String projectId);

    @Query("SELECT m.role FROM MemberEntity m WHERE m.user.id = :userId AND m.project.id = :projectId")
    MemberRole getProjectPermission(@Param("userId") String userId, @Param("projectId") String projectId);

    @Transactional
    @Modifying
    @Query("UPDATE ProjectEntity p SET p.name = :#{#update.name}, p.description = :#{#update.description} WHERE p.id = :projectId")
    void update(@Param("projectId") String projectId, @Param("update") ProjectDto dto);

    @Transactional
    @Modifying
    @Query("UPDATE ProjectEntity p SET p.apiKey = :apiKey WHERE p.id = :projectId")
    void updateApiKey(@Param("projectId") String projectId, @Param("apiKey") String apiKey);

    @Transactional
    @Modifying
    @Query("UPDATE ProjectEntity p SET p.apiKey = NULL WHERE p.id = :projectId")
    void removeApiKey(@Param("projectId") String projectId);
}
