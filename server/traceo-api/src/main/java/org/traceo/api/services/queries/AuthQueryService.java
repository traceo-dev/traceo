package org.traceo.api.services.queries;

import org.traceo.common.transport.response.ApiResponse;

public interface AuthQueryService {
    ApiResponse getSignedInUser();
}
