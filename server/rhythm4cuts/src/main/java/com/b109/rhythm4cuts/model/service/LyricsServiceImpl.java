package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.Lyrics;
import com.b109.rhythm4cuts.model.dto.LyricsDto;
import com.b109.rhythm4cuts.model.repository.LyricsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class LyricsServiceImpl implements LyricsService {

    private final LyricsRepository lyricsRepository;

    @Override
    public List<LyricsDto> selectLyricTime(int songSeq) {

        List<Lyrics> lyrics = lyricsRepository.selectLyricBySongSeq(songSeq);
        List<LyricsDto> lyricsDtos = new ArrayList<>();

        lyrics.forEach(lyric -> {
            lyricsDtos.add(lyric.getLyricsDto());
        });

        return lyricsDtos;
    }
}
