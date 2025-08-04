package com.ssdam.tripPaw.init;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ssdam.tripPaw.badge.BadgeMapper;
import com.ssdam.tripPaw.domain.Badge;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class BadgeInitializer implements CommandLineRunner {
    private final BadgeMapper badgeMapper;

    @Override
    public void run(String... args) {
        System.out.println("[INFO] BadgeInitializer 시작");

        insertOrUpdateBadge(1L, "개미", "시작하는 리뷰어", "badge1.png", 1);
        insertOrUpdateBadge(2L, "고슴도치", "작은 무게 큰 성실함", "badge2.png", 10);
        insertOrUpdateBadge(3L, "토끼", "점점 빠른 발걸음", "badge3.png", 30);
        insertOrUpdateBadge(4L, "고양이", "날렵한 리뷰어", "badge4.png", 60);
        insertOrUpdateBadge(5L, "강아지", "귀여운 리뷰 달성자", "badge5.png", 100);
        insertOrUpdateBadge(6L, "여우", "리뷰 센스 장착", "badge6.png", 200);
        insertOrUpdateBadge(7L, "캥거루", "성큼성큼 성장", "badge7.png", 350);
        insertOrUpdateBadge(8L, "수달", "물 흐르듯 작성하는 리뷰어", "badge8.png", 500);
        insertOrUpdateBadge(9L, "사자", "왕 같은 리뷰어", "badge9.png", 750);
        insertOrUpdateBadge(10L, "코끼리", "궁극의 리뷰 마스터", "badge10.png", 1000);
    }

    private void insertOrUpdateBadge(Long id, String name, String description, String imageUrl, int weight) {
        Badge badge = new Badge();
        badge.setId(id);
        badge.setName(name);
        badge.setDescription(description);
        badge.setImageUrl(imageUrl);
        badge.setWeight(weight);
        badgeMapper.insertOrUpdateBadge(badge);
    }
}
