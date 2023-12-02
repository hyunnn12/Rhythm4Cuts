package com.b109.rhythm4cuts.controller;

import com.b109.rhythm4cuts.model.dto.FilmDto;
import com.b109.rhythm4cuts.model.dto.FriendDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@RequiredArgsConstructor
@CrossOrigin("*")
public class StompController {
    private final SimpMessagingTemplate messagingTemplate;
    @MessageMapping(value = "/request")
    public void reqeustFriend(FriendDto friendDto) {
        System.out.println(friendDto.getFromUser() + "님이 " + friendDto.getToUser() + "님에게 요청을 보냈습니다.");
        friendDto.setMessage(friendDto.getFromUser() + "님이 " + friendDto.getToUser() + "님에게 요청을 보냈습니다.");
        messagingTemplate.convertAndSend("/subscribe/friend/" + friendDto.getToUser(), friendDto);
    }

    @MessageMapping(value = "/confirm")
    public void confirmFriend(FriendDto friendDto) {
        friendDto.setMessage(friendDto.getFromUser() + "님과 " + friendDto.getToUser() + "님이 친구가 되엇습니다.");
        messagingTemplate.convertAndSend("/subscribe/friend/confirm/" + friendDto.getToUser(), friendDto);
    }

    @MessageMapping(value = "/invite")
    public void inviteFriend(FriendDto friendDto) {
        friendDto.setMessage(friendDto.getFromUser() + "님이 " + friendDto.getToUser() + "님에게 친구 요청을 보냇습니다.");
        messagingTemplate.convertAndSend("/subscribe/friend/invite/" + friendDto.getToUser(), friendDto);
    }

    @MessageMapping(value = "/song")
    public void startSong(FriendDto friendDto) {
        System.out.println(friendDto.getGameSeq()+"에서 노래를 시작합니다.");
        messagingTemplate.convertAndSend("/subscribe/song/" + friendDto.getGameSeq(), friendDto);
    }

    @MessageMapping(value = "/mr")
    public void startMR(FriendDto friendDto) {
        System.out.println(friendDto.getGameSeq()+"에서 MR을 시작합니다.");
        messagingTemplate.convertAndSend("/subscribe/MR/" + friendDto.getGameSeq(), friendDto);
    }

    @MessageMapping(value = "/film")
    public void startMR(FilmDto film) {
        System.out.println("game seq : " + film.getGameSeq() + "user seq : " + film.getUserSeq() + "rank : " + film.getPlayerRank());
        messagingTemplate.convertAndSend("/subscribe/film/gameSeq/" + film.getGameSeq() + "/playerRank/" + film.getPlayerRank(), film);
    }

    @MessageMapping(value = "/ready")
    public void setReady(FriendDto friend) {
        messagingTemplate.convertAndSend("/subscribe/ready/" + friend.getGameSeq(), friend);
    }
}
