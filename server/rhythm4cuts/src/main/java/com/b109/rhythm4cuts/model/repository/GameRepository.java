package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<GameInfo, Integer> {
    GameInfo findByGameSeq(int gameSeq);
}
