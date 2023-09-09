package org.traceo.api.services.commands.impl;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import org.traceo.common.transport.response.ApiResponse;
import org.traceo.security.config.ContextHolder;
import org.traceo.security.model.ContextDetails;
import org.traceo.utils.RandomGenerator;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
    private final static Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final DashboardRepository dashboardRepository;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository, UserRepository userRepository, DashboardRepository dashboardRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.dashboardRepository = dashboardRepository;
    }

    record CreateProjectResponse(String id, String redirectUrl){}

    @Override
    public ApiResponse create(ProjectDto dto) {
        ContextDetails ctx = ContextHolder.getDetails();
        Optional<ProjectEntity> projectEntity = projectRepository.findByName(dto.getName());
        if (projectEntity.isPresent()) {
            return ApiResponse.ofError("Project with this name already exists");
        }

        Optional<UserEntity> userEntity = userRepository.findById(ctx.getUserId());
        if (userEntity.isEmpty() || !userEntity.get().getStatus().equals(UserStatus.ACTIVE)) {
            return ApiResponse.ofError("Failed to create project. Insufficient user permissions.");
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

            CreateProjectResponse response = new CreateProjectResponse(
                    project.getId(),
                    redirectUrl(project.getId(), dashboard.getId())
            );

            return ApiResponse.ofSuccess("Project successfully created", response);
        } catch (Exception e) {
            logger.error("Failed to create project.", e);
            return ApiResponse.ofError("Failed to create project.");
        }
    }

    private String redirectUrl(String projectId, String dashboardId) {
        return "/project/" + projectId + "/dashboard/" + dashboardId;
    }

    private DashboardEntity createDashboard(ProjectEntity project) {
        DashboardEntity entity = DashboardEntity.createDefaultForProject(project);
        return dashboardRepository.save(entity);
    }

    @Override
    public ApiResponse update(String id, ProjectDto dto) {
        try {
            projectRepository.update(id, dto);
            return ApiResponse.ofSuccess("Project udpated.");
        } catch (Exception e) {
            logger.error("Failed to update.");
            return ApiResponse.ofError("Failed to udpate.");
        }
    }

    @Override
    public ApiResponse delete(String id) {
        try {
            projectRepository.deleteById(id);
            return ApiResponse.ofSuccess("Project removed.");
        } catch (Exception e) {
            logger.error("Failed to delete.");
            return ApiResponse.ofError("Failed to delete.", e);
        }
    }

    @Override
    public ApiResponse generateApiKey(String id) {
        try {
            String apiKey = RandomGenerator.generate();
            projectRepository.updateApiKey(id, apiKey);

            return ApiResponse.ofSuccess("API Key Generated.");
        } catch (Exception e) {
            logger.error("Failed to generate api key.", e);
            return ApiResponse.ofError("Failed to generate api key.");
        }
    }

    @Override
    public ApiResponse removeApiKey(String id) {
        try {
            projectRepository.removeApiKey(id);
            return ApiResponse.ofSuccess("API Key removed.");
        } catch (Exception e) {
            logger.error("Failed to remove api key.", e);
            return ApiResponse.ofError("Failed to remove api key.");
        }
    }
}
