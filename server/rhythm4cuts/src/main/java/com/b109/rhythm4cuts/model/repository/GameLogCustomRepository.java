package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameLog;

public interface GameLogCustomRepository {

    GameLog selectGameLog(int gameSeq, int userSeq);
}
