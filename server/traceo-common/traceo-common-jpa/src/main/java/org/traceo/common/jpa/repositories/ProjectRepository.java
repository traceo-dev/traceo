package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.transport.dto.api.ProjectDto;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, String> {
    Optional<ProjectEntity> findByName(String name);

    void removeById(String id);

    @Transactional
    @Modifying
    @Query("UPDATE ProjectEntity p SET p.name = :#{#update.name}, p.description = :#{#update.description} WHERE p.id = :projecId")
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
