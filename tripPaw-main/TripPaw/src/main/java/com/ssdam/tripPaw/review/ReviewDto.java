package com.ssdam.tripPaw.review;

import lombok.Data;

@Data
public class ReviewDto {
    private Long memberId;
    private Long reviewTypeId; // PLAN: 1, PLACE: 2
    private Long targetId;
    private String content;
    private int rating;
    private Long reservId;
}
