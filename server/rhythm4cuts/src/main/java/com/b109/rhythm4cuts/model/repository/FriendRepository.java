package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.FriendDto;
import com.b109.rhythm4cuts.model.dto.UserDto;

import java.sql.SQLException;
import java.util.List;

public interface FriendRepository {
    List<User> selectFriendList(int userSeq) throws SQLException;
    List<User> selectSearchFriend(String searchStr) throws SQLException;
    void insertFriend(int userSeq1, int userSeq2) throws SQLException;
    List<User> selectRequestFriendList(int userSeq) throws SQLException;
    void insertRequestFriend(int userSeq1, int userSeq2) throws SQLException;
    void updateRequestFriendToConfirm(int userSeq1, int userSeq2) throws SQLException;
    void updateRequestFriendToReject(int userSeq1, int userSeq2) throws SQLException;
    void deleteFriend(int userSeq1, int userSeq2) throws SQLException;
    public List<User> selectRequestWaitFriendList(int userSeq) throws SQLException;

    User selectUser(Integer userSeq) throws SQLException;
}
