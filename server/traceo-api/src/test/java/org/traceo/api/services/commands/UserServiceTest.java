package org.traceo.api.services.commands;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.traceo.api.TestConfig;
import org.traceo.common.transport.dto.api.UserDto;
import org.traceo.common.jpa.entities.UserEntity;
import org.traceo.common.jpa.repositories.UserRepository;
import org.traceo.common.transport.enums.ResponseStatus;
import org.traceo.common.transport.response.ApiResponse;

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
        ApiResponse response = userService.create(prepareUserDto());
        Assertions.assertEquals(ResponseStatus.SUCCESS, response.getStatus());

        UserEntity user = userRepository.findByUsername("test_username").orElse(null);
        Assertions.assertNotNull(user);
    }

    @Test
    public void testDuplicatedFieldsForNewUser() {
        ApiResponse response = userService.create(prepareUserDto());
        Assertions.assertEquals(ResponseStatus.SUCCESS, response.getStatus());

        UserEntity user = userRepository.findByUsername("test_username").orElse(null);
        Assertions.assertNotNull(user);

        ApiResponse response2 = userService.create(prepareUserDto());
        Assertions.assertEquals(ResponseStatus.ERROR, response2.getStatus());
    }
}
