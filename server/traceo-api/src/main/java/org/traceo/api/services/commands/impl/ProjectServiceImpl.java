package org.traceo.api.services.commands.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.api.exceptions.NotUniqueField;
import org.traceo.api.exceptions.PermissionException;
import org.traceo.common.creators.builders.MemberBuilder;
import org.traceo.common.jpa.entities.DashboardEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.DashboardRepository;
import org.traceo.common.jpa.repositories.ProjectRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.dto.api.ProjectDto;
import org.traceo.api.services.commands.ProjectService;
import org.traceo.common.transport.enums.MemberRole;
import org.traceo.common.transport.enums.UserStatus;
import org.traceo.security.config.ContextHolder;
import org.traceo.security.model.ContextDetails;
import org.traceo.utils.RandomGenerator;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final DashboardRepository dashboardRepository;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository, UserRepository userRepository, DashboardRepository dashboardRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.dashboardRepository = dashboardRepository;
    }

    @Override
    public String create(ProjectDto dto) {
        ContextDetails ctx = ContextHolder.getDetails();
        Optional<ProjectEntity> projectEntity = projectRepository.findByName(dto.getName());
        if (projectEntity.isPresent()) {
            throw new NotUniqueField("Project with this name already exists");
        }

        Optional<UserEntity> userEntity = userRepository.findById(ctx.getUserId());
        if (userEntity.isEmpty() || !userEntity.get().getStatus().equals(UserStatus.ACTIVE)) {
            throw new PermissionException("Failed to create project. Insufficient user permissions.");
        }

        UserEntity user = userEntity.get();

        try {
            ProjectEntity projectPayload = ProjectEntity.mapModelToEntity(dto);
            projectPayload.setOwner(userEntity.get());

            ProjectEntity project = projectRepository.save(projectPayload);

//            Core admins should be added as members only in jpa listeners
            boolean isCoreAdmin = user.getEmail().equals("admin@localhost");

            if (!isCoreAdmin) {
                MemberBuilder.standard()
                        .withProject(project)
                        .withUser(user)
                        .withRole(MemberRole.ADMINISTRATOR)
                        .build();
            }

//            Create default dashboard
            DashboardEntity dashboardEntity = createDashboard(project);
            DashboardEntity dashboard = dashboardRepository.save(dashboardEntity);

//            Update project with default dashboard id
            project.setMainDashboardId(dashboard.getId());
            projectRepository.save(project);

            return project.getId();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create project.", e);
        }
    }

    private DashboardEntity createDashboard(ProjectEntity project) {
        DashboardEntity entity = DashboardEntity.createDefaultForProject(project);
        return dashboardRepository.save(entity);
    }

    @Override
    public void update(String id, ProjectDto dto) {
        try {
            projectRepository.update(id, dto);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to udpate.", e);
        }
    }

    @Override
    public void delete(String id) {
        try {
            projectRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete.", e);
        }
    }

    @Override
    public void generateApiKey(String id) {
        try {
            String apiKey = RandomGenerator.generate();
            projectRepository.updateApiKey(id, apiKey);
        } catch (RuntimeException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate api key.", e);
        }
    }

    @Override
    public void removeApiKey(String id) {
        try {
            projectRepository.removeApiKey(id);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to remove api key.", e);
        }
    }
}
