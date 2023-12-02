package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.ProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileImageRepository extends JpaRepository<ProfileImage, Integer> {
    Optional<ProfileImage> findByProfileImageSeq(Integer seq);
}
