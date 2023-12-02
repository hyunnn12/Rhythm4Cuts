package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.SongRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MelonRepository extends JpaRepository<SongRank, Long> {
}
