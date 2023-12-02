package com.b109.rhythm4cuts.model.repository;

import com.b109.rhythm4cuts.model.domain.Lyrics;

import java.util.List;

public interface LyricsRepository {

    List<Lyrics> selectLyricBySongSeq(int songSeq);
}
