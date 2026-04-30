package com.web2.backend.repository;


import com.web2.backend.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByCityIgnoreCaseAndStateIgnoreCase(String city, String state);

    List<Artist> findByStateIgnoreCase(String state);
}