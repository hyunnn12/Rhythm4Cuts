package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.User;
import com.b109.rhythm4cuts.model.service.FriendService;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@Repository
public class UserTestRepository {

    @PersistenceContext
    private EntityManager em;

    public void save(User user){
        em.persist(user);
    }
}
