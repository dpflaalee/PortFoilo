package com.ssdam.tripPaw.dto;

import lombok.Data;
import java.util.List;

@Data
public class TripSaveRequest {
    private String title;
    private String startDate;
    private String endDate;
    private int countPeople;
    private int countPet;
    private List<RouteDay> routeData;
    private String mapImage;
    private Long memberId;

    @Data
    public static class RouteDay {
        private int day;
        private List<PlaceDto> places;
    }

    @Data
    public static class PlaceDto {
        private Long placeId;
        private String name;
        private String latitude;
        private String longitude;
    }
}
