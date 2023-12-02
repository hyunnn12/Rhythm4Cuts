package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.domain.UserGameInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class WaitRoomRepositoryImpl implements WaitRoomRepository {

    private final EntityManager em;

    @Override
    public GameInfo selectWaitRoom(int gameSeq) {
        // SELECT g FROM GameInfo AS g WHERE g.gameSeq = gameSeq
        String jpql = "SELECT g FROM GameInfo g WHERE g.gameSeq = :gameSeq";

        return em.createQuery(jpql, GameInfo.class)
                .setParameter("gameSeq", gameSeq)
                .getSingleResult();
    }

    @Override
    public void insertUserGameInfo(UserGameInfo userGameInfo) {
        System.out.println("Debugging Time");
        System.out.println(userGameInfo.getGameInfo().getGameSeq());
        System.out.println(userGameInfo.getUser().getUserSeq());
        System.out.println(userGameInfo.getGameOrder());

        em.persist(userGameInfo);
    }

    @Override
    public List<UserGameInfo> selectAll(int gameSeq) {
        // SELECT ug FROM UserGameInfo AS ug WHERE ug.gameSeq = gameSeq
        String jpql = "SELECT ug FROM UserGameInfo ug WHERE ug.gameInfo.gameSeq = :gameSeq";

        return em.createQuery(jpql, UserGameInfo.class)
                .setParameter("gameSeq", gameSeq)
                .getResultList();
    }

    @Override
    public UserGameInfo selectOne(UserGameInfo userGameInfo) {
        // SELECT ug FROM UserGameInfo AS ug WHERE ug.gameSeq = gameSeq AND ug.userSeq = userSeq
        String jpql = "SELECT ug FROM UserGameInfo ug WHERE ug.gameInfo.gameSeq = :gameSeq AND ug.user.userSeq = :userSeq";

        try {
            UserGameInfo res = em.createQuery(jpql, UserGameInfo.class)
                    .setParameter("gameSeq", userGameInfo.getGameInfo().getGameSeq())
                    .setParameter("userSeq", userGameInfo.getUser().getUserSeq())
                    .getSingleResult();

            return res;
        } catch (Exception e) {
            return null;
        }
    }
}
