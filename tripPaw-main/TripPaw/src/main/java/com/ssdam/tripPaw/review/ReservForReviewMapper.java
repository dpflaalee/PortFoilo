package com.ssdam.tripPaw.review;

import com.ssdam.tripPaw.domain.Reserv;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReservForReviewMapper {

    Reserv findOneByMemberAndPlace(@Param("memberId") Long memberId, @Param("placeId") Long placeId);

    int countByMemberAndPlace(@Param("memberId") Long memberId, @Param("placeId") Long placeId);

    int countByMemberAndTripPlan(@Param("memberId") Long memberId, @Param("tripPlanId") Long tripPlanId);
    
    List<Reserv> findByTripPlanIdAndMember(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);

    Reserv findReservByMemberAndTripPlan(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);

    Reserv findByTripPlanId(Long tripPlanId);

    List<Reserv> findReservsByTripPlanAndMember(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);
}
