package com.b109.rhythm4cuts.utils;

import com.b109.rhythm4cuts.model.service.MelonService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CrawlingScheduler {

    private final MelonService melonService;

    // 매일 오전 0시에 실행되는 Scheduler
    @Scheduled(cron = "0 0 0 * * *")
    public void runCrawlingJob() {
        try {

            // 1. 기존 DB에 저장된 데이터 초기화
            melonService.clearMelonChart();

            // 2. 현재 멜론 차트 데이터 크롤링 및 DB 저장
            melonService.scrapeAndSaveMelonChart();

            System.out.println("Melon Chart Crawling Success.");
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
