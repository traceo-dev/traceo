package org.traceo.security.model;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ContextDetails {
    private String userId;
    private String username;
    private String sessionId;

    public ContextDetails(String userId, String username, String sessionId) {
        this.userId = userId;
        this.username = username;
        this.sessionId = sessionId;
    }
}
