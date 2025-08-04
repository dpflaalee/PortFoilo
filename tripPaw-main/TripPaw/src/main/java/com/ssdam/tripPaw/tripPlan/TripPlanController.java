package com.ssdam.tripPaw.tripPlan;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;
import com.ssdam.tripPaw.dto.TripPlanSearchDto;
import com.ssdam.tripPaw.dto.TripPlanSearchDto.PlaceDtoResponse;
import com.ssdam.tripPaw.dto.TripPlanSearchDto.RouteDayResponse;
import com.ssdam.tripPaw.dto.TripRecommendRequest;
import com.ssdam.tripPaw.dto.TripRecommendResponse;
import com.ssdam.tripPaw.dto.TripSaveRequest;
import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tripPlan")
public class TripPlanController {

    private final TripPlanService tripPlanService;
    private final TripPlanMapper tripPlanMapper;

    //여행 경로 추천 받기
    @PostMapping("/recommend")
    public ResponseEntity<List<TripRecommendResponse>> recommendTrip(@RequestBody TripRecommendRequest request) {
        List<TripRecommendResponse> result = tripPlanService.recommend(request);
        return ResponseEntity.ok(result);
    }

    
    // 여행 경로 추천 받기 -> 경로 수정하기
    @PostMapping("/edit")
    public ResponseEntity<Map<String, Object>> editTrip(@RequestBody TripSaveRequest request) {
        try {
        	// 저장 후 반환
            TripPlan tripPlan = tripPlanService.saveTrip(request); 
            return ResponseEntity.ok(Map.of(
                "message", "여행 저장 완료!",
                "tripId", tripPlan.getId() //프론트에 ID 보내주기
            ));
        } catch (Exception e) {
            String msg = "여행 저장 실패: " + e.getMessage();
            System.err.println(msg);
            return ResponseEntity.internalServerError().body(Map.of("error", msg));
        }
    }
    
 
    // 특정 ID의 여행 경로 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
    	TripPlan plan = tripPlanMapper.findByIdWithCoursesAndReviews(id);
        if (plan == null) return ResponseEntity.notFound().build();

        TripPlanSearchDto dto = new TripPlanSearchDto();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
        dto.setDays(plan.getDays());
        dto.setPublicVisible(plan.isPublicVisible());
        dto.setCreatedAt(plan.getCreatedAt());

        // 작성자 닉네임, id
        Member author = plan.getMember();
        if (author != null) {
            dto.setAuthorNickname(author.getNickname());
            dto.setAuthorId(author.getId());
        } else {
            dto.setAuthorNickname("알 수 없음");
            dto.setAuthorId(null); 
        }

        // 코스, 리뷰 설정
        List<TripPlanCourse> tripPlanCourses = plan.getTripPlanCourses();
        dto.setTripPlanCourses(tripPlanCourses);

        List<Review> reviews = plan.getReviews();
        dto.setReviews(reviews);

        if (reviews != null && !reviews.isEmpty()) {
            double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
            dto.setAvgRating(avgRating);
            dto.setReviewCount((long) reviews.size());
        } else {
            dto.setAvgRating(0.0);
            dto.setReviewCount(0L);
        }

        // 대표 이미지
        String imageUrl = null;
        if (tripPlanCourses != null && !tripPlanCourses.isEmpty()) {
            TripPlanCourse firstCourse = tripPlanCourses.get(0);
            if (firstCourse.getRoute() != null && !firstCourse.getRoute().getRoutePlaces().isEmpty()) {
                Place place = firstCourse.getRoute().getRoutePlaces().get(0).getPlace();
                if (place != null) {
                    imageUrl = place.getImageUrl();
                }
            }
        }
        dto.setImageUrl(imageUrl);
        
        List<RouteDayResponse> routeData = new ArrayList<>();

        for (int i = 0; i < tripPlanCourses.size(); i++) {
            TripPlanCourse course = tripPlanCourses.get(i);

            RouteDayResponse day = new RouteDayResponse();
            day.setDay(i + 1);

            List<PlaceDtoResponse> places = course.getRoute().getRoutePlaces().stream()
                .map(rp -> {
                    Place place = rp.getPlace();
                    PlaceDtoResponse pd = new PlaceDtoResponse();
                    pd.setPlaceId(place.getId());
                    pd.setName(place.getName());
                    pd.setLatitude(place.getLatitude());
                    pd.setLongitude(place.getLongitude());
                    return pd;
                })
                .collect(Collectors.toList());

            day.setPlaces(places);
            routeData.add(day);
        }

        dto.setRouteData(routeData);

        return ResponseEntity.ok(dto);
    }

    
    // 특정 유저의 모든 여행 가져오기(/tripPlan/{id}/trips)
    @GetMapping("/{id}/trips")
    public ResponseEntity<List<TripPlan>> getAllTripsByMemberId(@PathVariable Long id){
    	List<TripPlan> plans = tripPlanService.findByMemberIdWithReviews(id);
		return ResponseEntity.ok(plans);
    }
    
    // 공개로 전환하기
    @PutMapping("/{id}/public")
    public ResponseEntity<?> makeTripPublic(@PathVariable Long id) {
        try {
            tripPlanService.makeTripPublic(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    //딜리트
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTripPlan(@PathVariable Long id) {
        tripPlanService.deleteTripPlan(id);
        return ResponseEntity.noContent().build();
    }
  
    
    //저장된 여행 목록 전체 조회
    @GetMapping("/list")
    public ResponseEntity<List<TripPlan>> getAllTrips() {
        List<TripPlan> plans = tripPlanService.getAllTrips();
        return ResponseEntity.ok(plans);
    }
}

