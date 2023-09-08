package org.traceo.api.services.commands;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.traceo.api.models.AuthCredentials;
import org.traceo.common.transport.dto.api.UpdatePasswordDto;
import org.traceo.common.transport.dto.api.UserCredentialsDto;
import org.traceo.common.transport.response.ApiResponse;

public interface AuthService {
    ApiResponse login(AuthCredentials credentials, HttpServletResponse response, HttpServletRequest request);
    ApiResponse logout(HttpServletResponse response, HttpServletRequest request);

    ApiResponse checkCredentials(UserCredentialsDto dto);
    ApiResponse updatePassword(UpdatePasswordDto dto);
}
