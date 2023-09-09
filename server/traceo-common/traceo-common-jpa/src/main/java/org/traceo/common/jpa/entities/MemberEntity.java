package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.MemberRole;

@Entity
@Table(name = "traceo_project_member")
@Getter
@Setter
public class MemberEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private MemberRole role = MemberRole.NONE;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_id")
    private ProjectEntity project;

    public MemberEntity() {}

    public MemberEntity(UserEntity user, ProjectEntity project) {
        this(user, project, MemberRole.VIEWER);
    }

    public MemberEntity(UserEntity user, ProjectEntity project, MemberRole role) {
        this.user = user;
        this.project = project;
        this.role = role;
    }
}
