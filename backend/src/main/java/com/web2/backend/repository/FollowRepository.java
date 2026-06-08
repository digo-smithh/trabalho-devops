package com.web2.backend.repository;

import com.web2.backend.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    @Query("select f from Follow f join fetch f.artist where f.user.id = :userId order by f.createdAt desc")
    List<Follow> findAllByUserIdWithArtist(Long userId);

    @Query("select f.artist.id from Follow f where f.user.id = :userId")
    List<Long> findArtistIdsByUserId(Long userId);

    boolean existsByUserIdAndArtistId(Long userId, Long artistId);

    @Modifying
    @Transactional
    @Query("delete from Follow f where f.user.id = :userId and f.artist.id = :artistId")
    int deleteByUserIdAndArtistId(Long userId, Long artistId);
}
