package org.traceo.api.services.commands;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.traceo.api.models.AuthCredentials;
import org.traceo.api.models.response.LoginResponse;
import org.traceo.common.transport.dto.api.UpdatePasswordDto;
import org.traceo.common.transport.dto.api.UserCredentialsDto;
import org.traceo.common.transport.response.ApiResponse;

public interface AuthService {
    LoginResponse login(AuthCredentials credentials, HttpServletResponse response, HttpServletRequest request);
    void logout(HttpServletResponse response, HttpServletRequest request);

    boolean checkCredentials(UserCredentialsDto dto);
    void updatePassword(UpdatePasswordDto dto);
}
