package com.web2.backend.security;

import com.web2.backend.model.Session;
import com.web2.backend.repository.SessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;

@Component
public class AuthFilter extends OncePerRequestFilter {

    public static final String CURRENT_USER_ATTR = "currentUser";

    private final SessionRepository sessionRepository;

    public AuthFilter(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();
            Optional<Session> maybe = sessionRepository.findByToken(token);
            if (maybe.isPresent()) {
                Session session = maybe.get();
                if (session.getExpiresAt().isAfter(Instant.now())) {
                    request.setAttribute(CURRENT_USER_ATTR, session.getUser());
                }
            }
        }
        chain.doFilter(request, response);
    }
}
