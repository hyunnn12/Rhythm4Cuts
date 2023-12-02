package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.PointLog;
import com.b109.rhythm4cuts.model.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<PointLog, Long> {
    List<PointLog> findByUser(User user);
}
