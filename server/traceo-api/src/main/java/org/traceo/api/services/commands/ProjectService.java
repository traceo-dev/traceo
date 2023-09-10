package org.traceo.api.services.commands;

import org.traceo.common.transport.dto.api.ProjectDto;

public interface ProjectService {
    String create(ProjectDto dto);
    void update(String id, ProjectDto dto);
    void delete(String id);

    void generateApiKey(String id);
    void removeApiKey(String id);
}
