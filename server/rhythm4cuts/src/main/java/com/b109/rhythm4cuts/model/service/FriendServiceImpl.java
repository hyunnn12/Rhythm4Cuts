package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.exception.RequestFriendDuplicationException;
import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.FriendDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import com.b109.rhythm4cuts.model.repository.FriendRepository;
import com.b109.rhythm4cuts.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService{

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;

    @Override
    public List<UserDto> getFriendList(int userSeq) throws Exception {
        List<User> users = friendRepository.selectFriendList(userSeq);

        List<UserDto> res = new ArrayList<>();
        users.forEach(user->{
            res.add(user.getUserDto());
        });

        return res;
    }

    @Override
    public List<UserDto> userSearch(String searchStr) throws Exception {
        List<User> users = friendRepository.selectSearchFriend(searchStr);
        List<UserDto> res = new ArrayList<>();
        users.forEach(user->{

            res.add(user.getUserDto());
        });

        return res;
    }

    @Override
    public List<UserDto> getRequestFriendList(int userSeq) throws Exception {
        List<User> users = friendRepository.selectRequestWaitFriendList(userSeq);
        System.out.println(users);
        List<UserDto> res = new ArrayList<>();
        users.forEach(user->{

            res.add(user.getUserDto());
        });

        return res;
    }

    @Override
    public void addFriend(FriendDto friend) throws Exception {
        System.out.println("실행");

        friendRepository.updateRequestFriendToConfirm(friend.getFromUser(), friend.getToUser());
        friendRepository.insertFriend(friend.getFromUser(), friend.getToUser());
        friendRepository.insertFriend(friend.getToUser(), friend.getFromUser());
    }

    @Override
    public void requestFriend(FriendDto friendDto) throws Exception {
        List<User> users = friendRepository.selectRequestFriendList(friendDto.getFromUser());

        users.forEach(user -> {
            if(user.getUserSeq() == friendDto.getToUser()) throw new RequestFriendDuplicationException("이미 친구 요청을 보냈습니다.");
        });
        friendRepository.insertRequestFriend(friendDto.getFromUser(), friendDto.getToUser());
    }

    @Override
    public void rejectFriend(FriendDto friendDto) throws Exception {
        friendRepository.updateRequestFriendToReject(friendDto.getFromUser(), friendDto.getToUser());
    }

    @Override
    public void deleteFriend(int userSeq1, int userSeq2) throws Exception {
        friendRepository.deleteFriend(userSeq1, userSeq2);
        friendRepository.deleteFriend(userSeq2, userSeq1);
    }

    @Override
    public UserDto getUserInfo(Integer userSeq) throws Exception{
        User user = friendRepository.selectUser(userSeq);

        return user.getUserDto();
    }
}
