package com.web2.backend.dto;

import com.web2.backend.model.Artist;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ArtistSummary {
    private Long id;
    private String name;
    private String genre;
    private String city;
    private String state;
    private String imageUrl;

    public static ArtistSummary from(Artist a) {
        return new ArtistSummary(
                a.getId(), a.getName(), a.getGenre(),
                a.getCity(), a.getState(), a.getImageUrl()
        );
    }
}
