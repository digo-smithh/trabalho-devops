package com.web2.backend.controller;

import com.web2.backend.dto.ArtistSummary;
import com.web2.backend.model.Artist;
import com.web2.backend.model.Follow;
import com.web2.backend.model.User;
import com.web2.backend.repository.ArtistRepository;
import com.web2.backend.repository.FollowRepository;
import com.web2.backend.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/me/following")
public class FollowController {

    private final FollowRepository followRepository;
    private final ArtistRepository artistRepository;

    public FollowController(FollowRepository followRepository, ArtistRepository artistRepository) {
        this.followRepository = followRepository;
        this.artistRepository = artistRepository;
    }

    @GetMapping
    public List<ArtistSummary> list(@CurrentUser User user) {
        return followRepository.findAllByUserIdWithArtist(user.getId()).stream()
                .map(f -> ArtistSummary.from(f.getArtist()))
                .toList();
    }

    @GetMapping("/ids")
    public List<Long> ids(@CurrentUser User user) {
        return followRepository.findArtistIdsByUserId(user.getId());
    }

    @PostMapping("/{artistId}")
    public ResponseEntity<Void> follow(@CurrentUser User user, @PathVariable Long artistId) {
        if (followRepository.existsByUserIdAndArtistId(user.getId(), artistId)) {
            return ResponseEntity.noContent().build();
        }
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Artista não encontrado"));

        Follow f = new Follow();
        f.setUser(user);
        f.setArtist(artist);
        f.setCreatedAt(Instant.now());
        followRepository.save(f);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{artistId}")
    public ResponseEntity<Void> unfollow(@CurrentUser User user, @PathVariable Long artistId) {
        followRepository.deleteByUserIdAndArtistId(user.getId(), artistId);
        return ResponseEntity.noContent().build();
    }
}
