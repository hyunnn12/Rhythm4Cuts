package com.b109.rhythm4cuts.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class YoutubeResponseDto {

    private List<VideoItem> items;

    @Getter @Setter
    public static class VideoItem {

        private String id;
        private Snippet snippet;
        private Statistics statistics;

        @Getter @Setter
        public static class Snippet {
            private String channelId;
            private String title;
            private String categoryId;
            private String description;
        }

        @Getter @Setter
        public static class Statistics {
            private String viewCount;
            private String likeCount;
            private String favoriteCount;
            private String commentCount;
        }
    }
}
