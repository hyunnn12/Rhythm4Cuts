package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.BackGround;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BackGroundRepository extends JpaRepository<BackGround, Integer> {
    BackGround findByBackgroundSeq(Integer backgroundSeq);
}
