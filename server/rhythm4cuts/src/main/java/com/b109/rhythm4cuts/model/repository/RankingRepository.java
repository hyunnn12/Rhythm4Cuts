package com.b109.rhythm4cuts.model.repository;


import com.b109.rhythm4cuts.model.domain.SongRank;
import com.b109.rhythm4cuts.model.domain.User;

import java.util.List;

public interface RankingRepository {

    List<SongRank> selectSongOrderBYRank();
    List<User> selectUsersOrderByScoreSum();
}
