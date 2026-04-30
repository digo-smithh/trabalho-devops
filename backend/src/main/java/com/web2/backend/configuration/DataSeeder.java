package com.web2.backend.configuration;

import com.web2.backend.model.Album;
import com.web2.backend.model.Artist;
import com.web2.backend.model.Song;
import com.web2.backend.repository.AlbumRepository;
import com.web2.backend.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Override
    public void run(String... args) throws Exception {
        seedAlbums();
        seedArtistsAndSongs();
    }

    private void seedAlbums() {
        albumRepository.deleteAll();
        createAlbum("Folklore", "Folk Pop", "https://assets.b9.com.br/wp-content/uploads/2020/07/Taylor-Swift-Folklore-capa.jpg");
        createAlbum("Mayhem", "Dark Pop", "https://upload.wikimedia.org/wikipedia/pt/0/0a/Lady_Gaga_-_Mayhem.jpg");
        createAlbum("In Rainbows", "Alternative Rock", "https://upload.wikimedia.org/wikipedia/pt/9/96/Radiohead_-_In_Rainbows.jpg");
        createAlbum("Gracinha", "Alternative R&B", "https://upload.wikimedia.org/wikipedia/pt/c/ca/Gracinha_-_Manu_Gavassi.png");
    }

    private void seedArtistsAndSongs() {
        artistRepository.deleteAll();

        Artist taylor = new Artist();
        taylor.setName("Taylor Swift");
        taylor.setGenre("Pop Alternativo");
        taylor.setCity("West Reading");
        taylor.setState("PA");
        taylor.setImageUrl("https://i.imgur.com/fXymOor.jpeg");
        taylor.setSpotifyId("06HL4z0CvFAxyc27GXpf02");

        addSong(taylor, "The Fate of Ophelia", "645M", "3:46", "https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W?si=eb5950763ad14c0e&nd=1&dlsi=e63c6795737c4412");
        addSong(taylor, "Opalite", "380M", "3:55", "https://open.spotify.com/track/3yWuTOYDztXjZxdE2cIRUa?si=bd9675458f8d4e3d&nd=1&dlsi=609c30eafb7d4740");
        addSong(taylor, "The Life of a Showgirl", "187M", "4:01", "https://open.spotify.com/track/5eXgqtg3T8Av0m1FUaGHex?si=4f29962b8b5f4c4b&nd=1&dlsi=b16c67a44edf4d99");

        artistRepository.save(taylor);

        Artist gaga = new Artist();
        gaga.setName("Lady Gaga");
        gaga.setGenre("Eletrônica");
        gaga.setCity("Nova Iorque");
        gaga.setState("NY");
        gaga.setImageUrl("https://i.imgur.com/cbTBM6m.jpeg");
        gaga.setSpotifyId("1HY2Jd0NmPuamShAr6KMms");

        addSong(gaga, "Die With A Smile", "3.2B", "4:11", "https://open.spotify.com/track/7so0lgd0zP2Sbgs2d7a1SZ?si=36988cd4c9e44971&nd=1&dlsi=f9bb5c461f934373");
        addSong(gaga, "Poker Face", "1.9B", "3:57", "https://open.spotify.com/track/1QV6tiMFM6fSOKOGLMHYYg?si=c9ec6947085a411a&nd=1&dlsi=e37f747c688a466f");
        addSong(gaga, "Abracadabra", "657M", "3:43", "https://open.spotify.com/track/2LHNTC9QZxsL3nWpt8iaSR?si=afe00ded22ea4842&nd=1&dlsi=9c7b92cfa9c6405f");

        artistRepository.save(gaga);
    }

    private void createAlbum(String name, String genre, String url) {
        Album a = new Album();
        a.setName(name);
        a.setGenre(genre);
        a.setImageUrl(url);
        albumRepository.save(a);
    }

    private void addSong(Artist artist, String name, String plays, String duration, String url) {
        Song song = new Song();
        song.setName(name);
        song.setPlayCount(plays);
        song.setDuration(duration);
        song.setSpotifyUrl(url);
        song.setArtist(artist);

        artist.getSongs().add(song);
    }
}