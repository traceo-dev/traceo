package org.traceo.api.services.queries.impl;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.services.queries.ProjectQueryService;
import org.traceo.common.jpa.entities.DashboardEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.jpa.repositories.ProjectRepository;
import org.traceo.common.transport.dto.api.DashboardDto;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.enums.MemberRole;
import jakarta.persistence.criteria.Predicate;
import org.traceo.security.config.ContextHolder;
import org.traceo.security.model.ContextDetails;
import org.traceo.utils.JpaUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectQueryServiceImpl implements ProjectQueryService {

    private final ProjectRepository projectRepository;

    public ProjectQueryServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public ProjectDto getProject(String id) {
        return projectRepository
                .findById(id)
                .map(ProjectEntity::mapToModel)
                .orElse(null);
    }

    @Override
    public List<ProjectDto> getProjects(ProjectsQueryDto query) {
        Specification<ProjectEntity> specification = (root, specQuery, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (query.getSearch() != null) {
                String value = JpaUtils.likeWrap(query.getSearch());
                predicates.add(builder.like(root.get("name"), value));
            }

            root.fetch("owner", JoinType.LEFT);

            switch (query.getOrder()) {
                case ASC -> specQuery.orderBy(builder.asc(root.get(query.getSortBy())));
                case DESC -> specQuery.orderBy(builder.desc(root.get(query.getSortBy())));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };

        return projectRepository
                .findAll(specification)
                .stream()
                .map(ProjectEntity::mapToModel)
                .toList();
    }

    @Override
    public MemberRole getPermission(String id) {
        ContextDetails ctx = ContextHolder.getDetails();
        return projectRepository.getProjectPermission(ctx.getUserId(), id);
    }

    @Override
    public List<DashboardDto> getDashboards(String id) {
        return projectRepository
                .findProjectDashboards(id)
                .stream()
                .map(DashboardEntity::mapToModel)
                .toList();
    }
}
