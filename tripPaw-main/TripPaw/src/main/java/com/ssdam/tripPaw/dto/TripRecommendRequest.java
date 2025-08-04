// dto/TripRecommendRequest.java
package com.ssdam.tripPaw.dto;

import lombok.Data;
import java.util.List;

@Data
public class TripRecommendRequest {
    private String region;
    private String startDate;
    private String endDate;
    private int countPeople;
    private int countPet;
    private List<Long> selectedCategoryIds;
}