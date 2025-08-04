package com.ssdam.tripPaw.review;

import java.sql.Date;

import lombok.Data;

@Data
public class MyReviewDto {
    private Long reviewId;
    private String content;
    private int rating;
    private String createdAt;
    private String reviewType; // PLAN or PLACE
    private String tripTitle;
    private String imageUrl;
    private int imageCount;
    private String weatherCondition;
    private String placeName;
    private String placeImageUrl;
    private Long targetId;
    
    private Long reservId;              // PLACE 리뷰용
    private Long memberTripPlanId;      // 여행 경로 추출용

}

