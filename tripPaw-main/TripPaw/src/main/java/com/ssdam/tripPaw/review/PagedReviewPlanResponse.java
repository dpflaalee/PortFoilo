package com.ssdam.tripPaw.review;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PagedReviewPlanResponse<T> {
    private List<T> content;
    private int totalElements;
    private int totalPages;
    private double avgRating;
}