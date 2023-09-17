package org.traceo.api.services.commands;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.traceo.api.TestConfig;
import org.traceo.api.exceptions.NotUniqueField;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.UserRepository;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ContextConfiguration(classes = TestConfig.class)
@TestPropertySource("classpath:test.properties")
public class UserServiceTest {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    public void setUp() { }

    private UserDto prepareUserDto() {
        UserDto dto = new UserDto();
        dto.setEmail("test@test");
        dto.setName("test_name");
        dto.setPassword("test_password");
        dto.setUsername("test_username");

        return dto;
    }

    @Test
    public void testCreateNewUser() {
        String id = userService.create(prepareUserDto());

        UserEntity user = userRepository.findById(id).orElse(null);
        assertNotNull(user);
        assertEquals(user.getUsername(), "test_username");
    }

    @Test
    public void testDuplicatedFieldsForNewUser() {
        userService.create(prepareUserDto());
        UserEntity user = userRepository.findByUsername("test_username").orElse(null);
        Assertions.assertNotNull(user);

        Exception exception = assertThrows(NotUniqueField.class, () -> {
            userService.create(prepareUserDto());
        });

        assertEquals(exception.getMessage(), "User with this username already exists.");
    }
}
