package com.web2.backend.repository;

import com.web2.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, String> {
    Optional<Session> findByToken(String token);

    @Modifying
    @Transactional
    @Query("delete from Session s where s.token = :token")
    int deleteByToken(String token);
}
