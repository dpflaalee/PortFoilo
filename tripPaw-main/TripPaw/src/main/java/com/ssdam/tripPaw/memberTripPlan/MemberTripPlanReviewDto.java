package com.ssdam.tripPaw.memberTripPlan;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MemberTripPlanReviewDto {
    // 리뷰 정보 추가
    private Long reviewId;
    private Long targetId;
    private String content;
    private int rating;
    private String weatherCondition;
    private LocalDateTime createdAt;

    // 기존 여행 정보
    private Long memberTripPlanId;
    private String titleOverride;
    private LocalDate startDate;
    private LocalDate endDate;
    private String imageUrl;
    private String status;
    private int countPeople;
    private int countPet;
    private boolean publicVisible;
}
