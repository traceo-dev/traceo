package org.traceo.common.jpa.listeners;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PostPersist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.jpa.entities.MemberEntity;
import org.traceo.common.jpa.entities.ProjectEntity;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.MemberRepository;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.enums.MemberRole;

@Component
public class ProjectEntityListener {
    private final static Logger logger = LoggerFactory.getLogger(ProjectEntityListener.class);

    @Lazy
    @Autowired
    private UserRepository userRepository;

    @Lazy
    @Autowired
    private MemberRepository memberRepository;

    @PostPersist
    @Transactional(readOnly = true)
    public void onInsert(ProjectEntity entity) throws Exception {
        try {
            UserEntity admin = userRepository.findByEmail("admin@localhost").orElseThrow(EntityNotFoundException::new);

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
