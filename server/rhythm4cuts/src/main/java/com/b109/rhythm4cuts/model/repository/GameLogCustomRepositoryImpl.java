package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class GameLogCustomRepositoryImpl implements GameLogCustomRepository {

    private final EntityManager em;

    @Override
    public GameLog selectGameLog(int gameSeq, int userSeq) {
        // SELECT gl FROM GameLog AS gl WHERE gameSeq = :gameSeq AND userSeq = :userSeq
        String jpql = "SELECT gl FROM GameLog gl WHERE gl.gameInfo.gameSeq = :gameSeq AND gl.user.userSeq = :userSeq";

        return em.createQuery(jpql, GameLog.class)
                .setParameter("gameSeq", gameSeq)
                .setParameter("userSeq", userSeq)
                .getSingleResult();
    }
}
