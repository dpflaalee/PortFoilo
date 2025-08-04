package com.ssdam.tripPaw.dto;

import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyTripsDto {
    private Long myTripId;        // memberTripPlanId
    private Long memberId;          // 사용자 ID
    private Long tripPlanId;        // tripPlanID
    private String title;           // 여행 제목
    private int days;               // 여행 일수
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean publicVisible;  // 공개 여부
    private LocalDateTime createdAt; // 생성일시
    private String imageUrl;        // 대표 이미지

    private List<TripPlanCourse> tripPlanCourses; // 여행 코스 목록
}
