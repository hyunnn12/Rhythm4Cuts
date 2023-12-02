package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.FriendList;
import com.b109.rhythm4cuts.model.domain.RequestFriend;
import com.b109.rhythm4cuts.model.domain.RequestStatus;
import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.FriendDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class FriendRepositoryImpl implements FriendRepository{

    private final EntityManager em;
    @Override
    public List<User> selectFriendList(int userSeq) throws SQLException {
        //select u from friendList as f join user as u on f.to_user = u.user_seq where f.from_user = userSeq
        String jpql = "SELECT u FROM FriendList f JOIN f.toUser u WHERE f.fromUser.userSeq = :userSeq";
        return em.createQuery(jpql, User.class)
                .setParameter("userSeq", userSeq)
                .getResultList();

    }

    @Override
    public List<User> selectSearchFriend(String searchStr) throws SQLException {
        //select u from user as u where u.nickname like 'searchStr%'
        String jpql = "SELECT u FROM User u WHERE u.nickname LIKE :searchStr";
        return em.createQuery(jpql, User.class)
                .setParameter("searchStr", searchStr + "%")
                .getResultList();
    }

    @Override
    public void insertFriend(int userSeq1, int userSeq2) throws SQLException {
        User fromUser = em.find(User.class, userSeq1);
        User toUser = em.find(User.class, userSeq2);

        FriendList friendList = new FriendList();
        friendList.setFromUser(fromUser);
        friendList.setToUser(toUser);
        em.persist(friendList);
    }

    @Override
    public List<User> selectRequestFriendList(int userSeq) throws SQLException {
        User fromUser = em.find(User.class, userSeq);

        String jpql = "SELECT rf.toUser FROM RequestFriend rf JOIN User u ON rf.fromUser.userSeq = u.userSeq WHERE rf.fromUser = :user";

        List<User> users = em.createQuery(jpql, User.class)
                .setParameter("user", fromUser)
                .getResultList();


        return users;
    }

    @Override
    public List<User> selectRequestWaitFriendList(int userSeq) throws SQLException {
        User fromUser = em.find(User.class, userSeq);

        String jpql = "SELECT rf.toUser FROM RequestFriend rf JOIN User u ON rf.fromUser.userSeq = u.userSeq WHERE rf.fromUser = :user and rf.requestStatus = :status";

        List<User> users = em.createQuery(jpql, User.class)
                .setParameter("user", fromUser)
                .setParameter("status", RequestStatus.WAIT)
                .getResultList();


        return users;
    }

    @Override
    public void insertRequestFriend(int userSeq1, int userSeq2) throws SQLException {
        User fromUser = em.find(User.class, userSeq1);
        User toUser = em.find(User.class, userSeq2);

        RequestFriend requestFriend = new RequestFriend();
        requestFriend.setFromFriend(fromUser);
        requestFriend.setToFriend(toUser);
        em.persist(requestFriend);
    }

    @Override
    public void updateRequestFriendToConfirm(int userSeq1, int userSeq2) throws SQLException {
        User fromUser = em.find(User.class, userSeq1);
        User toUser = em.find(User.class, userSeq2);
        String jpql = "SELECT rf FROM RequestFriend rf " +
                "WHERE rf.fromUser = :fromUser AND rf.toUser = :toUser ";
        RequestFriend rf = em.createQuery(jpql, RequestFriend.class)
                .setParameter("fromUser", fromUser)
                .setParameter("toUser", toUser)
                .getSingleResult();

        rf.setRequestStatus(RequestStatus.CONNECTED);
    }

    @Override
    public void updateRequestFriendToReject(int userSeq1, int userSeq2) throws SQLException {
        User fromUser = em.find(User.class, userSeq1);
        User toUser = em.find(User.class, userSeq2);
        String jpql = "SELECT rf FROM RequestFriend rf " +
                "WHERE rf.fromUser = :fromUser AND rf.toUser = :toUser ";
        RequestFriend rf = em.createQuery(jpql, RequestFriend.class)
                .setParameter("fromUser", fromUser)
                .setParameter("toUser", toUser)
                .getSingleResult();

        rf.setRequestStatus(RequestStatus.REJECTED);
    }

    @Override
    public void deleteFriend(int userSeq1, int userSeq2) throws SQLException {
        User user1 = em.find(User.class, userSeq1);
        User user2 = em.find(User.class, userSeq2);
        //select * from friend_list where (friend_list.fromUser = user1 and friend_list.toUser = user2) or(friend_list.fromUser = user2 and frined_list.toUser = user1)
        String jpql = "SELECT f FROM FriendList f " +
                "WHERE f.fromUser = :user1 AND f.toUser = :user2 ";
        List<FriendList> friendLists = em.createQuery(jpql, FriendList.class)
                .setParameter("user1", user1)
                .setParameter("user2", user2)
                .getResultList();

        friendLists.forEach(friendList -> {
            em.remove(friendList);
        });
    }

    @Override
    public User selectUser(Integer userSeq) throws SQLException {
        return em.find(User.class, userSeq);
    }
}
