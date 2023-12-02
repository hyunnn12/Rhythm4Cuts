package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MusicRepository extends JpaRepository<Song, Long> {
    Optional<Song> findBySongSeq(int songSeq);
}
