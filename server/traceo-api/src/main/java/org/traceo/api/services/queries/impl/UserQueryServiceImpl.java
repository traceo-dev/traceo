package org.traceo.api.services.queries.impl;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.traceo.api.models.query.ProjectsQueryDto;
import org.traceo.api.models.query.UsersQueryDto;
import org.traceo.api.services.queries.UserQueryService;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.utils.JpaUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserQueryServiceImpl implements UserQueryService {

    private final UserRepository userRepository;

    public UserQueryServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto getUser(String id) {
        return userRepository.findById(id).map(UserEntity::mapToModel).orElse(null);
    }

    @Override
    public List<UserDto> getUsers(UsersQueryDto query) {
        Specification<UserEntity> specification = (root, specQuery, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (query.getSearch() != null) {
                String value = JpaUtils.likeWrap(query.getSearch());

                Predicate namePredicate = builder.like(root.get("name"), value);
                Predicate usernamePredicate = builder.like(root.get("username"), value);
                Predicate emailPredicate = builder.like(root.get("email"), value);

                predicates.add(builder.or(namePredicate, usernamePredicate, emailPredicate));
            };

            return builder.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository
                .findAll(specification)
                .stream()
                .map(UserEntity::mapToModel)
                .toList();
    }

    @Override
    public List<ProjectDto> getUserProjects(String id, ProjectsQueryDto query) {
        return null;
    }
}
