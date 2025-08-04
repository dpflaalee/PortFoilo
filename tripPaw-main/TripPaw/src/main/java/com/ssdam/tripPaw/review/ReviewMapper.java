package com.ssdam.tripPaw.review;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.domain.Review;
import com.ssdam.tripPaw.domain.ReviewType;
import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanReviewDto;
//import com.ssdam.tripPaw.memberTripPlan.MemberTripPlanReviewDto;

@Mapper
public interface ReviewMapper {
	void insertReview(Review review);
	
	void updateReview(Review review);
	
	void deleteReview(Review review);
	
	void deleteLikesByReviewId(Long reviewId);
	
	Review findById(@Param("id") Long id);
	
	List<Review> findByMemberId(Long memberId);
	List<MyReviewDto> findMyReviewsByMemberIdPaged (
			@Param("memberId") Long memberId,
			@Param("size") int size,
			@Param("offset") int offset,
			@Param("type") String type
	);
	
	int countMyReviewsByMemberIdAndType(@Param("memberId") Long memberId, @Param("type") String type);
	
	List<Review> findByTarget(@Param("targetId") Long targetId, @Param("reviewTypeId") Long reviewTypeId);
	
	ReviewType findReviewTypeById(@Param("id") Long id);
	
	List<Review> findByPlaceIdWithPlaceName(Long placeId);
	
	// 장소리뷰 최신 / 추천순
	int countReviewsByPlaceId(@Param("placeId") Long placeId);
	List<Review> findPlaceReviewsPaged(
		    @Param("placeId") Long placeId,
		    @Param("sort") String sort,
		    @Param("size") int size,
		    @Param("offset") int offset
	);
	
	List<ReviewPlanDto> findByPlanIdPaged(@Param("planId") Long planId,
            @Param("size") int size,
            @Param("offset") int offset);
	int countReviewsByPlanId(@Param("planId") Long planId);
	Double avgRatingByPlanId(@Param("planId") Long planId);
	
	List<Review> findAllPlanReviews();
	
	// 경로 리뷰 전체
	List<ReviewPlanDto> findPlanReviewsByCreatedAtDesc(@Param("size") int size, @Param("offset") int offset);
	List<ReviewPlanDto> findPlanReviewsByRatingDesc(@Param("size") int size, @Param("offset") int offset);
	List<ReviewPlanDto> findPlanReviewsByRatingAsc(@Param("size") int size, @Param("offset") int offset);
	List<ReviewPlanDto> findPlanReviewsByLikesDesc(@Param("size") int size, @Param("offset") int offset);
	int countPlanReviews();
	
	// 관리자 Plan
	int countAllPlanReviews();

	// 관리자 Place
	List<ReviewPlaceDto> findPlaceReviewsByLikesDesc(@Param("size") int size, @Param("offset") int offset);
	int countAllPlaceReviews();

	
	// 특정 예약에 대한 리뷰 작성여부 확인
	int countByMemberIdAndReservId(@Param("memberId") Long memberId, @Param("reservId") Long reservId);
	int countByMemberIdAndTripPlanId(@Param("memberId") Long memberId, @Param("planId") Long planId);
	
	//도움이돼요
	void likeReview(@Param("memberId") Long memberId, @Param("reviewId") Long reviewId);
	void unlikeReview(@Param("memberId") Long memberId, @Param("reviewId") Long reviewId);
	int countLikes(@Param("reviewId") Long reviewId);
	boolean hasLikedReview(@Param("memberId") Long memberId, @Param("reviewId") Long reviewId);
	
	
	
	// 해당 장소의 평균 별점 가져오기
	Double getAverageRatingByPlaceId(Long id);
	// 해장 당소의 리뷰 개수 가져오기
	Integer getReviewCountByPlaceId(Long id);
	
	
	// 추가
	// 평점/추천순으로 리뷰 Top 5
	List<Review> findTop5ByLikes();


	List<Reserv> findWithPlaceByTripPlanIdAndMember(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);
	
	//여권 도장용 추가코드
	// 작성한 리뷰 조회
	List<MemberTripPlanReviewDto> getMyTripReviews(@Param("memberId") Long memberId);
	    
	// 리뷰 작성하지 않은 여행 목록 조회
	List<MemberTripPlan> getUnwrittenTripPlans(@Param("memberId") Long memberId);
    
}
