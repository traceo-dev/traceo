package org.traceo.core.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public List<UserEntity> getUser() {
        return userRepository.findAll();
    }
}
