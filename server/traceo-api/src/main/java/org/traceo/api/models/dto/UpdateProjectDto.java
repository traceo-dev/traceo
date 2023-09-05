package org.traceo.api.models.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UpdateProjectDto {
    @NotBlank
    String id;
}
