package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.UserGameInfo;
import com.b109.rhythm4cuts.model.dto.LobbyDto;
import com.b109.rhythm4cuts.model.dto.WaitGameResponseDto;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public interface WaitRoomService {

    LobbyDto getWaitRoomInfo(int gameSeq);
    int insertUserGameInfo(Map<String, Object> param);
    List<WaitGameResponseDto> getWaitRoomOrder(int gameSeq);
}
