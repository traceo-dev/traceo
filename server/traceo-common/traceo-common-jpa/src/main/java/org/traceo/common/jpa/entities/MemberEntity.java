package org.traceo.common.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.traceo.common.transport.enums.MemberRoleEnum;

@Entity
@Table(name = "traceo_project_member")
@Getter
@Setter
public class MemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq")
    @SequenceGenerator(name = "member_seq", sequenceName = "member_sequence", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private MemberRoleEnum role = MemberRoleEnum.NONE;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_id")
    private ProjectEntity project;
}
