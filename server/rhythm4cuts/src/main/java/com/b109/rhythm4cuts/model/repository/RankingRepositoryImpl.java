package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.SongRank;
import com.b109.rhythm4cuts.model.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class RankingRepositoryImpl implements RankingRepository{

    @PersistenceContext
    EntityManager em;

    @Override
    public List<SongRank> selectSongOrderBYRank() {
        String jpql = "SELECT sr FROM SongRank sr";
        List<SongRank> songRanks = em.createQuery(jpql, SongRank.class)
                .getResultList();

        return songRanks;
    }

    @Override
    public List<User> selectUsersOrderByScoreSum() {
        String jpql = "SELECT u FROM User u ORDER BY u.scoreSum DESC";
        List<User> users = em.createQuery(jpql, User.class)
                .getResultList();

        return users;
    }
}
