package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.SongRank;
import com.b109.rhythm4cuts.model.dto.SongRankDto;
import com.b109.rhythm4cuts.model.repository.MelonRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MelonServiceImpl implements MelonService {

    private final MelonRepository melonRepository;

    @Override
    public void clearMelonChart() throws SQLException {
        // DB에 저장된 모든 노래 데이터 삭제
        melonRepository.deleteAll();
    }

    @Override
    public List<SongRankDto> scrapeAndSaveMelonChart() throws SQLException, IOException {
        try {
            // Melon Top 100을 크롤링해서, DB에 저장
            String url = "https://www.melon.com/chart/index.htm";                       // Melon Top 100 url
            Document doc = Jsoup.connect(url).get();

            Elements titleElements = doc.select("div.ellipsis.rank01 span a");  // 제목
            Elements singerElements = doc.select("div.ellipsis.rank02 span a"); // 가수
            Elements rankElements = doc.select("span.rank ");                    // 순위

            List<SongRankDto> res = new ArrayList<>();

            for (int i = 0; i < titleElements.size(); i++) {
                String title = titleElements.get(i).text();
                String singer = singerElements.get(i).text();
                int rank = Integer.parseInt(rankElements.get(i + 1).text());

                SongRank songRank = new SongRank();
                songRank.setTitle(title);
                songRank.setSinger(singer);
                songRank.setRanking(rank);

                res.add(songRank.getSongRankDto());

                melonRepository.save(songRank);
            }

            return res;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
