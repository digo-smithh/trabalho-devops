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

    @GetMapping("/albums")
    public List<Album> getNewReleases() {
        return albumRepository.findAll();
    }

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

    @GetMapping("/artists/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        Optional<Artist> artist = artistRepository.findById(id);
        return artist.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
