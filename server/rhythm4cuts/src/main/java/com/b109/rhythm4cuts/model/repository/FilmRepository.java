package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends JpaRepository<GameImage, Long> {
    @Query("SELECT g FROM GameImage g WHERE YEAR(g.createDate) = :year AND MONTH(g.createDate) = :month AND DAY(g.createDate) = :day")
    Page<GameImage> findByDate(int year, int month, int day, Pageable pageable);

    @Query("SELECT g FROM GameImage g WHERE user_seq = :userSeq")
    List<GameImage> findByUserSeq(Integer userSeq);

    @Query("SELECT gi FROM GameImage gi WHERE gi.user.userSeq = :userSeq AND gi.gameInfo.gameSeq = :gameSeq")
    GameImage findByUserAndGameInfo(int userSeq, int gameSeq);

    @Query("SELECT gi FROM GameImage gi WHERE gi.gameRank = :gameRank AND gi.gameInfo.gameSeq = :gameSeq")
    GameImage findByGameRankAndGameInfo(int gameRank, int gameSeq);

}
