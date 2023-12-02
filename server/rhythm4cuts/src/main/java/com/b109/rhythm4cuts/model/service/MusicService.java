package com.b109.rhythm4cuts.model.service;

import com.b109.rhythm4cuts.model.domain.Song;
import com.b109.rhythm4cuts.model.dto.SongDto;
import com.b109.rhythm4cuts.model.dto.YoutubeResponseDto;
import com.b109.rhythm4cuts.model.repository.MusicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.transaction.Transactional;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MusicService {

    @Value("${youtube.data.api_key}")
    private String YOUTUBE_API_KEY;
    private final MusicRepository musicRepository;

    public String extractQueryString(String url, String paramName) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
        Map<String, List<String>> queryParams = builder.build().getQueryParams();

        List<String> paramValues = queryParams.get(paramName);
        if (paramValues != null && !paramValues.isEmpty()) {
            return paramValues.get(0); // 첫 번째 값을 반환
        } else {
            return null; // 해당 파라미터가 없을 경우, null을 반환
        }
    }

    public void saveMusic(String youtubeId, String url) {

        String paramName = "v";                                  // 파라미터 이름
        String paramValue = extractQueryString(youtubeId, paramName);  // 파라미터 값

        // 추출한 파라미터 값을 통해, YouTube Data v3 API를 호출
        URI uri = UriComponentsBuilder
                .fromUriString("https://www.googleapis.com")
                .path("/youtube/v3/videos")
                .queryParam("id", paramValue)
                .queryParam("key", YOUTUBE_API_KEY)
                .queryParam("part", "snippet,statistics")
                .queryParam("fields", "items(id,snippet(channelId,title,categoryId,description),statistics)")
                .encode()
                .build()
                .toUri();

        RestTemplate restTemplate = new RestTemplate();
        YoutubeResponseDto res = restTemplate.getForEntity(uri, YoutubeResponseDto.class).getBody();

        Song song = new Song();

        if (res != null && res.getItems() != null && !res.getItems().isEmpty()) {
            String BeforeTitle = res.getItems().get(0).getSnippet().getTitle(); // 가공 전 제목
            String id = res.getItems().get(0).getId();

            String AfterTitle = BeforeTitle.substring(8); // "[TJ노래방] "을 제외한 가공 후 제목
            String[] Content = AfterTitle.split("-|/");

            song.setTitle(Content[0].substring(0, Content[0].length() - 1));         // 제목 입력
            song.setSinger(Content[1].substring(1, Content[1].length() - 1));        // 가수 입력
            song.setUrl(url);                                                        // 영상 url 입력
            song.setYoutubeId(id);                                                  // 유튜브 동영상 ID값 입력

            musicRepository.save(song);
        }
    }

    public SongDto selectSong(int songSeq) {

        Song song = musicRepository.findBySongSeq(songSeq).orElse(null);
        SongDto res = new SongDto();

        if (song != null) {
            res.setSongSeq(songSeq);
            res.setTitle(song.getTitle());
            res.setSinger(song.getSinger());
            res.setUrl(song.getUrl());
        }

        return res;
    }

    public List<SongDto> selectAll() {

        List<Song> songs = musicRepository.findAll();
        List<SongDto> res = new ArrayList<>();

        songs.forEach(song -> {
            res.add(song.getSongDto());
        });

        return res;
    }
}
