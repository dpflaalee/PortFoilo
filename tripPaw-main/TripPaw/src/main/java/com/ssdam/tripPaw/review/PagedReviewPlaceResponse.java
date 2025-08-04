package com.ssdam.tripPaw.review;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PagedReviewPlaceResponse {
    private List<ReviewPlaceDto> reviews;
    private int totalElements;
    private int totalPages;
}