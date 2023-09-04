package org.traceo.security.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.traceo.security.model.ContextDetails;

/**
 * Wrapper class for already existing {@link SecurityContextHolder} to avoid long methods chain.
 */
public class ContextHolder extends SecurityContextHolder {
    public ContextHolder() {
        super();
    }

    public boolean isAuthenticated() {
        return getAuthentication().isAuthenticated();
    }

    public static void setAuthentication(Authentication authentication) {
        getContext().setAuthentication(authentication);
    }
    public static Authentication getAuthentication() {
        return getContext().getAuthentication();
    }

    public static ContextDetails getDetails() {
        return (ContextDetails) getContext().getAuthentication().getDetails();
    }
}
