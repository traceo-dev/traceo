package org.traceo.api.models.dto;

import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.MemberRoleEnum;

@Getter @Setter
public class MemberDto {
    private String userId;
    private String projectId;
    private MemberRoleEnum role;
}
