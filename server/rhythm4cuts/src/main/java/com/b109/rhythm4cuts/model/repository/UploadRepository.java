package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.VoiceLog;

public interface UploadRepository {
    void insertVoiceLog(VoiceLog voiceLog);
}
