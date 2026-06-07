package com.web2.backend.service;

import com.web2.backend.dto.AuthResponse;
import com.web2.backend.dto.LoginRequest;
import com.web2.backend.dto.RegisterRequest;
import com.web2.backend.dto.UserResponse;
import com.web2.backend.model.Session;
import com.web2.backend.model.User;
import com.web2.backend.repository.SessionRepository;
import com.web2.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthService {

    private static final Duration SESSION_TTL = Duration.ofDays(7);

    private static final Set<String> ALLOWED_AVATARS = Set.of(
            "coral", "violet", "emerald", "amber", "azure", "rose"
    );

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       SessionRepository sessionRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        if (!ALLOWED_AVATARS.contains(req.getAvatarKey())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar inválido");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        User user = new User();
        user.setName(req.getName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setAvatarKey(req.getAvatarKey());
        user.setCreatedAt(Instant.now());
        user = userRepository.save(user);

        return new AuthResponse(createSession(user), UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        return new AuthResponse(createSession(user), UserResponse.from(user));
    }

    public void logout(String token) {
        if (token == null || token.isBlank()) return;
        sessionRepository.deleteByToken(token);
    }

    private String createSession(User user) {
        Session session = new Session();
        session.setToken(UUID.randomUUID().toString());
        session.setUser(user);
        Instant now = Instant.now();
        session.setCreatedAt(now);
        session.setExpiresAt(now.plus(SESSION_TTL));
        sessionRepository.save(session);
        return session.getToken();
    }
}
