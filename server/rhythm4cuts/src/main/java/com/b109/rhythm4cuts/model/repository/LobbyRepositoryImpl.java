package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.GameInfo;
import com.b109.rhythm4cuts.model.domain.Song;
import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.dto.LobbyDto;
import com.b109.rhythm4cuts.model.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.SQLException;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class LobbyRepositoryImpl implements LobbyRepository {

    @PersistenceContext
    EntityManager em;

    @Override
    public List<GameInfo> selectLobbyList() throws SQLException {
        // SELECT g FROM GameInfo AS g
        String jpql = "SELECT g FROM GameInfo g";

        return em.createQuery(jpql, GameInfo.class)
                .getResultList();
    }

    @Override
    public GameInfo selectSeqLobby(int gameSeq) throws SQLException {
        // SELECT g FROM GameInfo AS g WHERE g.gameSeq = gameSeq
        String jpql = "SELECT g FROM GameInfo g WHERE g.gameSeq = :gameSeq";

        return em.createQuery(jpql, GameInfo.class)
                .setParameter("gameSeq", gameSeq)
                .getSingleResult();
    }

    @Override
    public List<GameInfo> selectTitleLobbyList(String title) throws SQLException {
        // SELECT g FROM GameInfo AS g WHERE g.title LIKE '%title%'
        String jpql = "SELECT g FROM GameInfo g WHERE g.title LIKE :title";

        return em.createQuery(jpql, GameInfo.class)
                .setParameter("title", "%" + title + "%")
                .getResultList();
    }

    @Override
    public int insertGameRoom(LobbyDto lobbyDto) throws SQLException {
        Song song = em.find(Song.class, lobbyDto.getSongSeq());

        System.out.println("songSeq: " + lobbyDto.getSongSeq()); // debug

        GameInfo gameInfo = new GameInfo();
        gameInfo.setTitle(lobbyDto.getTitle()); // 방 제목
        gameInfo.setSong(song); // 노래 일련번호 (노래 객체)
        gameInfo.setIsSecret(lobbyDto.getIsSecret() == 1); // 방 모드 (비밀방 여부) -> 1이면 true, 0이면 false
        gameInfo.setPassword(lobbyDto.getPassword()); // 비밀번호
        gameInfo.setSessionId(lobbyDto.getSessionId()); // Openvidu 세션 아이디

        em.persist(gameInfo);

        System.out.println("gameSeq:" + gameInfo.getGameSeq()); // debug
        return gameInfo.getGameSeq();
    }

    @Override
    public List<Song> selectSongTitleList(String title) throws SQLException {
        // SELECT s FROM GameInfo AS g JOIN Song AS s ON g.songSeq = s.songSeq WHERE s.title LIKE '%title%'
        String jpql = "SELECT s FROM GameInfo g JOIN Song s ON g.song.songSeq = s.songSeq WHERE s.title LIKE :title";

        return em.createQuery(jpql, Song.class)
                .setParameter("title", "%" + title + "%")
                .getResultList();
    }

    @Override
    public GameInfo selectPw(int gameSeq) throws SQLException {
        // SELECT g FROM GameInfo AS g WHERE g.gameSeq = gameSeq
        String jpql = "SELECT g.password FROM GameInfo g WHERE g.gameSeq = :gameSeq";

        return em.createQuery(jpql, GameInfo.class)
                .setParameter("gameSeq", gameSeq)
                .getSingleResult();
    }

    @Override
    public void putConnectionId(UserDto userDto) throws SQLException {
        // UPDATE User u SET u.connectionId = userDto.connectionId WHERE u.userSeq = userDto.userSeq
        // String jpql = "UPDATE User u SET u.connectionId = :connectionId WHERE u.userSeq = :userSeq";
        String jpql = "SELECT u FROM User u WHERE u.userSeq = :userSeq";
        User user = em.createQuery(jpql, User.class)
                    .setParameter("userSeq", userDto.getUserSeq())
                    .getSingleResult();

        user.setConnectionId(userDto.getConnectionId());
    }
}
