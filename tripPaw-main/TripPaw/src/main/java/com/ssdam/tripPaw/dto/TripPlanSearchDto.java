package com.ssdam.tripPaw.dto;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.dto.TripSaveRequest.RouteDay;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TripPlanSearchDto {
    private Long id;
    private String title;
    private int days;
    private boolean publicVisible;
    private LocalDateTime createdAt;
    private String imageUrl;
    private String authorNickname;
    private Long authorId;

    private List<TripPlanCourse> tripPlanCourses;
    private List<RouteDayResponse> routeData;
    
    private List<Review> reviews;

    private Double avgRating;
    private Long reviewCount;
    
    @Data
    public static class RouteDayResponse {
        private int day;
        private List<PlaceDtoResponse> places;
    }

    @Data
    public static class PlaceDtoResponse {
        private Long placeId;
        private String name;
        private String latitude;
        private String longitude;
    }
}