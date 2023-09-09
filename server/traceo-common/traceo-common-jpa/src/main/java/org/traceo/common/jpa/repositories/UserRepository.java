package org.traceo.common.jpa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.transport.dto.api.UserDto;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByUsernameOrEmail(String username, String email);

    @Transactional
    @Modifying
    @Query("UPDATE UserEntity u SET u.name = :#{#update.name}, u.email = :#{#update.email}, u.isAdmin = :#{#update.admin}, u.status = :#{#update.status} WHERE u.username = :username")
    void updateByUsername(@Param("username") String username, @Param("update") UserDto update);
}
