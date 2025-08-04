package com.ssdam.tripPaw.review;

import lombok.Data;

@Data
public class ReviewOnePlanDto {
	private Long reviewId;
    private String content;
    private int rating;
    private String weatherCondition;
    private String createdAt;
    private String memberNickname;
    private String imageUrls; 
    private Long memberId;
}
