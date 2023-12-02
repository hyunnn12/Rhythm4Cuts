package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.domain.UserGameInfo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaitRoomRepository {

    GameInfo selectWaitRoom(int gameSeq);
    void insertUserGameInfo(UserGameInfo userGameInfo);
    List<UserGameInfo> selectAll(int gameSeq);
    UserGameInfo selectOne(UserGameInfo userGameInfo);
}
