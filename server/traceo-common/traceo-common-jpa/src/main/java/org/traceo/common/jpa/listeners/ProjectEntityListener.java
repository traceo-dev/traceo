package org.traceo.common.jpa.listeners;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PostPersist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.jpa.entities.MemberEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.MemberRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.enums.MemberRole;

@Configuration
@EntityListeners(AuditingEntityListener.class)
public class ProjectEntityListener {
    private final static Logger logger = LoggerFactory.getLogger(ProjectEntityListener.class);

    @Autowired
    UserRepository userRepository;

    @Autowired
    MemberRepository memberRepository;

    @PostPersist
    @Transactional(rollbackFor = Exception.class)
    public void onInsert(ProjectEntity entity) throws Exception {
        try {
            UserEntity admin = userRepository.findByUsername("admin@localhost").orElseThrow(EntityNotFoundException::new);

            MemberEntity member = new MemberEntity();
            member.setProject(entity);
            member.setUser(admin);
            member.setRole(MemberRole.ADMINISTRATOR);

            memberRepository.save(member);
            logger.info("Admin account has been added to new project: {}", entity.getId());
        } catch (Exception e) {
            logger.info("Failed to insert admin account to new project.", e);
            throw new Exception(e);
        }
    }
}
