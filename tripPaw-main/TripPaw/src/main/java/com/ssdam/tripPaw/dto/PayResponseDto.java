package com.ssdam.tripPaw.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayResponseDto {
    private Long payId;
    private int amount;
    private Long reservId;
    private String placeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long memberTripPlanId;
}
