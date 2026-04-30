package com.web2.backend.controller;


import com.web2.backend.model.Album;
import com.web2.backend.model.Artist;
import com.web2.backend.repository.AlbumRepository;
import com.web2.backend.repository.ArtistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*")
public class HomeController {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ArtistRepository artistRepository;

    // URL: http://localhost:8080/api/home/albums
    @GetMapping("/albums")
    public List<Album> getNewReleases() {
        return albumRepository.findAll();
    }

    // URL: http://localhost:8080/api/home/artists?city=SP&state=SP
    @GetMapping("/artists")
    public List<Artist> getArtists(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state) {

        if (city != null && state != null) {
            List<Artist> artists = artistRepository.findByCityIgnoreCaseAndStateIgnoreCase(city, state);

            if (artists.isEmpty()) return artistRepository.findByStateIgnoreCase(state);

            return artists;
        }

        return artistRepository.findAll();
    }

    // Ex: GET /api/home/artists/1
    @GetMapping("/artists/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        Optional<Artist> artist = artistRepository.findById(id);
        return artist.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}