package com.ssdam.tripPaw.review;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanReviewDto;
//import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanReviewDto;
import com.ssdam.tripPaw.reserv.ReservMapper;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final FileUploadService fileUploadService;
    private final ReviewImageMapper reviewImageMapper;
    private final ReservMapper reservMapper;
    private final ReservForReviewMapper reservForReviewMapper;
	
    /* 경로(tripPlan)에 포함된 예약(장소) 목록 조회 GET /review/trip/3/places?memberId=1 */
    @GetMapping("/trip/{tripPlanId}/places")
    public ResponseEntity<List<Reserv>> getReservsByTripPlan(@PathVariable Long tripPlanId,
                                                              @RequestParam Long memberId) {
        List<Reserv> reservList = reviewService.getReservListForTripPlanReview(tripPlanId, memberId);
        return ResponseEntity.ok(reservList);
    }
    
    @PostMapping(value = "/write", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createReview(
        @RequestPart("review") String reviewDtoJson,
        @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ReviewDto reviewDto = objectMapper.readValue(reviewDtoJson, ReviewDto.class);

            // reviewDto와 이미지 전달 → 서비스에서 Member 조회 포함하여 처리
            reviewService.saveReviewWithWeather(reviewDto, images);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace(); // 에러 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 작성 중 오류 발생");
        }
    }
    
    @GetMapping("/reserv/check")
    public ResponseEntity<Boolean> hasReservation(
        @RequestParam Long memberId,
        @RequestParam Long placeId) {

        boolean exists = reviewService.existsReservationForMemberAndPlace(memberId, placeId);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/reserv/review-check")
    public ResponseEntity<Boolean> canWriteReview(
            @RequestParam Long memberId,
            @RequestParam Long reservId) {
        boolean exists = reviewService.hasReviewForReserv(memberId, reservId);
        return ResponseEntity.ok(!exists); // 작성 안했으면 true 반환
    }
    
    @GetMapping("/check")
    public ResponseEntity<Boolean> hasWrittenReview(
        @RequestParam Long memberId,
        @RequestParam Long planId
    ) {
        boolean hasReview = reviewService.hasWrittenReviewForTripPlan(memberId, planId);
        return ResponseEntity.ok(hasReview);
    }

    
    @GetMapping("/reserv/place")
    public ResponseEntity<Long> getReservIdByMemberAndPlace(
        @RequestParam Long memberId,
        @RequestParam Long placeId
    ) {
        Reserv reserv = reservForReviewMapper.findOneByMemberAndPlace(memberId, placeId);
        if (reserv == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reserv.getId());
    }

    @GetMapping("/reserv/check-tripPlan")
    public ResponseEntity<Boolean> checkTripPlanReservation(
        @RequestParam Long memberId,
        @RequestParam Long tripPlanId
    ) {
        int count = reservForReviewMapper.countByMemberAndTripPlan(memberId, tripPlanId);
        return ResponseEntity.ok(count > 0);
    }

    
    @GetMapping("/weather")
    public ResponseEntity<String> getWeather(
            @RequestParam("type") String type,
            @RequestParam("targetId") Long targetId) {
        try {
            String weather = reviewService.getWeatherCondition(type, targetId);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("날씨 조회 실패: " + e.getMessage());
        }
    }
    
    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateReview(@RequestBody Map<String, List<String>> body) {
        List<String> keywords = body.get("keywords");
        String generated = reviewService.generateAIReview(keywords);
        return ResponseEntity.ok(Map.of("content", generated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        Review review = reviewService.getReview(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        reviewService.deleteReview(review);
        return ResponseEntity.ok("리뷰가 삭제되었습니다.");
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateReview(
        @PathVariable Long id,
        @RequestPart("review") Review review,
        @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        review.setId(id);
        reviewService.updateReview(review, images);
        return ResponseEntity.ok("리뷰가 수정되었습니다.");
    }

    //관리자페이지 리뷰
    @GetMapping("/admin/plan")
    public ResponseEntity<PagedReviewPlanResponse> getPlanReviewsPaged(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getRecommendedPlanReviewsPaged(page, size));
    }
    @GetMapping("/admin/place")
    public ResponseEntity<PagedReviewPlaceResponse> getPlaceReviewsPaged(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getRecommendedPlaceReviewsPaged(page, size));
    }


    
    
    // 단일리뷰조회
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable Long id) {
        Review review = reviewService.getReview(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(review);
    }

    // 특정회원 리뷰 목록
    @GetMapping("/member/{memberId}")
    @ResponseBody
    public ResponseEntity<PagedResponse<MyReviewDto>> getMemberReviewsPaged(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "PLAN") String type
    ) {
        return ResponseEntity.ok(reviewService.getMyReviewsPaged(memberId, page, size, type));
    }

    
    @GetMapping("/place/{placeId}")
    public ResponseEntity<PagedReviewResponse> getPlaceReviews(
            @PathVariable Long placeId,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedReviewResponse response = reviewService.getReviewsByPlaceId(placeId, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<PagedReviewPlanResponse<ReviewPlanDto>> getReviewsByPlanPaged(
        @PathVariable Long planId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByPlanIdPaged(planId, page, size));
    }

    
    @GetMapping("/plan")
    public ResponseEntity<PagedReviewPlanResponse<ReviewPlanDto>> getPlanReviewsPaged(
        @RequestParam(defaultValue = "latest") String sort,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        PagedReviewPlanResponse<ReviewPlanDto> pagedResult = reviewService.getPlanReviewsPaged(sort, page, size);
        return ResponseEntity.ok(pagedResult);
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<Void> likeReview(@PathVariable Long reviewId, @RequestParam Long memberId) {
        reviewService.likeReview(memberId, reviewId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}/like")
    public ResponseEntity<Void> unlikeReview(@PathVariable Long reviewId, @RequestParam Long memberId) {
        reviewService.unlikeReview(memberId, reviewId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{reviewId}/like/count")
    public ResponseEntity<Integer> getLikeCount(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getLikeCount(reviewId));
    }

    @GetMapping("/{reviewId}/like/marked")
    public ResponseEntity<Boolean> hasLiked(@PathVariable Long reviewId, @RequestParam Long memberId) {
        return ResponseEntity.ok(reviewService.hasLikedReview(memberId, reviewId));
    }
    
    @GetMapping("/place-reservations")
    public ResponseEntity<List<Reserv>> getPlaceReservationsForReview(
        @RequestParam Long tripPlanId,
        @RequestParam Long memberId
    ) {
        List<Reserv> reservs = reservForReviewMapper.findReservsByTripPlanAndMember(tripPlanId, memberId);
        return ResponseEntity.ok(reservs);
    }
    
    //도장 선택용 코드 추가
    //리뷰작성가능한거 조회    
    @GetMapping("/member/{memberId}/place-type")
    public ResponseEntity<List<MemberTripPlanReviewDto>> getMyTripReviews(@PathVariable Long memberId) {
        return ResponseEntity.ok(reviewService.getMyTripReviews(memberId));
    }

    @GetMapping("/tripplans-no-review/{memberId}")
    public ResponseEntity<List<MemberTripPlan>> getUnwrittenTripPlans(@PathVariable Long memberId) {
        return ResponseEntity.ok(reviewService.getUnwrittenTripPlans(memberId));
    } 
    
    @GetMapping("/member-trip-plan/{id}")
    public ResponseEntity<MemberTripPlan> getById(@PathVariable Long id) {
        MemberTripPlan mtp = reviewService.findById(id);
        if (mtp == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mtp);
    }

}
