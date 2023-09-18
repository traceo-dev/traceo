package org.traceo.api.services.queries;

import jakarta.servlet.http.HttpServletRequest;
import org.traceo.api.models.response.ViewConfigResponse;

public interface ViewQueryService {
    ViewConfigResponse getViewConfigData(HttpServletRequest request);
}
