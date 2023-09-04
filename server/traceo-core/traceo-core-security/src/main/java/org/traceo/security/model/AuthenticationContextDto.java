package org.traceo.security.model;

import lombok.Getter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Getter
public class AuthenticationContextDto extends AbstractAuthenticationToken {
    private final String userId;
    private final ContextDetails details;

    public AuthenticationContextDto(String userId, ContextDetails details) {
        this(userId, details, Collections.emptyList());
    }

    public AuthenticationContextDto(String userId, ContextDetails details, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.userId = userId;
        this.details = details;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return this.userId;
    }
}
