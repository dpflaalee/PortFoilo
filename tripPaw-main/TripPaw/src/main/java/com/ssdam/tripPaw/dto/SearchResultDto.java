package com.ssdam.tripPaw.dto;

import lombok.Data;
import java.util.List;

@Data
public class SearchResultDto {
    private List<PlaceSearchDto> places;
    private List<TripPlanSearchDto> tripPlans;

    public SearchResultDto(List<PlaceSearchDto> places, List<TripPlanSearchDto> tripPlans) {
        this.places = places;
        this.tripPlans = tripPlans;
    }
}
