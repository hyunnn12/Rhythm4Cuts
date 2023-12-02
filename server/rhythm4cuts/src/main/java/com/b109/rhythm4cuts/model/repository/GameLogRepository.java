package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameLogRepository extends JpaRepository<GameLog, Long> {
}
