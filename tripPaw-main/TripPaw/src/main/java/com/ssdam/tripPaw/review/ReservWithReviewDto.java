package com.ssdam.tripPaw.review;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.Reserv;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservWithReviewDto {
    private Long reservId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Place place;
    private Review review;
}
