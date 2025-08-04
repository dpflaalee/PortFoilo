package com.ssdam.tripPaw.dto;

import lombok.Data;
import java.util.List;

@Data
public class NotMyTripDto {
    private String title;
    private String startDate;
    private String endDate;
    private int countPeople;
    private int countPet;
    private List<RouteDayDto> routeData;
    private String mapImage;
    private Long memberId;
    private Long originalMemberId;
    private Long originalTripPlanId;

    @Data
    public static class RouteDayDto {
        private int day;
        private List<PlacesDto> places;
    }

    @Data
    public static class PlacesDto {
        private Long placeId;
        private String name;
        private String latitude;
        private String longitude;
    }
}
