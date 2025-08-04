package com.ssdam.tripPaw.review;

import java.util.List;

import com.ssdam.tripPaw.domain.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PagedReviewResponse {
	private List<Review> content;
    private int totalElements;
    private int totalPages;
    
}
