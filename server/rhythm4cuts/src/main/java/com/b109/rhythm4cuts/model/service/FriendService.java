package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.dto.FriendDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public interface FriendService {
    public List<UserDto> getFriendList(int userSeq) throws Exception;
    public List<UserDto> userSearch(String searchStr) throws Exception;
    public List<UserDto> getRequestFriendList(int userSeq) throws Exception;
    public void addFriend(FriendDto friend) throws Exception;
    public void requestFriend(FriendDto friendDto) throws Exception;
    public void rejectFriend(FriendDto friendDto) throws Exception;
    public void deleteFriend(int userSeq1, int userSeq2) throws Exception;

    UserDto getUserInfo(Integer userSeq) throws Exception;
}
