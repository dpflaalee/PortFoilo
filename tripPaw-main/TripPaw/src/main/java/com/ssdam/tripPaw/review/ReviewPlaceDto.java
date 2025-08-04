package com.ssdam.tripPaw.review;

import lombok.Data;

@Data
public class ReviewPlaceDto {
    private Long reviewId;
    private String content;
    private int rating;
    private String weatherCondition;
    private String memberNickname;
    private String placeName;
    private Long placeId;
    private String imageUrls;
    private int likeCount;
    private String createdAt;
    private Long memberId;
}
