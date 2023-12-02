package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.VoiceLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class UploadRepositoryImpl implements UploadRepository {

    private final EntityManager em;

    @Override
    public void insertVoiceLog(VoiceLog voiceLog) {
        em.persist(voiceLog);
    }
}
