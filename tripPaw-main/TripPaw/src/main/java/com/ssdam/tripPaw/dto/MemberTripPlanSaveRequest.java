package com.ssdam.tripPaw.dto;

import lombok.Data;

@Data
public class MemberTripPlanSaveRequest {
    private Long tripPlanId;
    private Long memberId;
    private String startDate;
    private String endDate;
    private int countPeople;
    private int countPet;
    private String titleOverride;
}

