package org.traceo.common.creators.builders;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.traceo.common.jpa.entities.MemberEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.MemberRepository;
import org.traceo.common.transport.enums.MemberRole;

import java.util.Objects;

@Component
@Slf4j
public class MemberBuilder {

    @Autowired
    MemberRepository memberRepository;

    public MemberBuilder() {}

    private UserEntity user;
    private ProjectEntity project;
    private MemberRole role = MemberRole.VIEWER;

    public static MemberBuilder standard() {
        return new MemberBuilder();
    }

    public MemberBuilder withUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public MemberBuilder withProject(ProjectEntity project) {
        this.project = project;
        return this;
    }

    public MemberBuilder withRole(MemberRole role) {
        this.role = role;
        return this;
    }

    public MemberEntity build() {
        Objects.requireNonNull(project, "Project is required!");
        Objects.requireNonNull(user, "User is required!");

        MemberEntity entity = new MemberEntity(user, project, role);
        return memberRepository.save(entity);
    }
}
