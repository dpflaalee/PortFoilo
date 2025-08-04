package com.ssdam.tripPaw.reserv;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.Reserv;
import com.ssdam.tripPaw.dto.TripPlanCoursePlaceDto;

@Mapper
public interface ReservMapper {
	public Reserv findById(Long id);

	public List<Reserv> findAll();

	public int insert(Reserv reserv);

	public int updateByState(Reserv reserv);

	public int softDelete(Long id);

	public boolean existsOverlappingReservation(@Param("memberId") Long memberId, @Param("placeId") Long placeId,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	public Reserv findByIdWithPlace(@Param("id") long targetId);
	
	public List<Map<String, Object>> findActiveReservedRanges();
	
	public  List<Reserv> findByTripPlanIdAndMember(@Param("tripPlanId") Long tripPlanId, @Param("memberId") Long memberId);

	public List<Reserv> findByTripPlanId(@Param("tripPlanId") Long tripPlanId);
	
	public int updateWithPay(Reserv reserv);
	
	public List<Map<String, Object>> findReservedRangesByPlace(@Param("placeId") Long placeId);

	public List<Reserv> findByTripPlansId(Long tripPlanId);
	
	public List<TripPlanCoursePlaceDto> findCoursesByMemberId(Long memberId);
	
	public List<TripPlanCoursePlaceDto> findCoursesByMemberTripPlanId(@Param("memberTripPlanId") Long memberTripPlanId);
	
	public Member findMemberById(Long userId);
	
	public List<Reserv> findByMemberId(Long memberId);
	
	public Place findPlaceById(Long id);
	
	public MemberTripPlan findMemberTripPlanById(Long id);
	
	public List<Reserv> findByMemberTripPlanId(Long memberTripPlanId);
	
	public List<Reserv> findByMemberTripPlanIdAndMember(@Param("memberTripPlanId") Long memberTripPlanId, @Param("memberId") Long memberId);
	
	public int softGroupDelete(@Param("reservIds") List<Long> reservIds, @Param("memberTripPlanId") Long memberTripPlanId);
	
	public List<Reserv> findAllByPayId(Long payId);
	
    public int updatePayIdByReservId(@Param("payId") Long payId, @Param("reservId") Long reservId);
	
	// 해당 tripPlanId의 예약 날짜 가져오기
	List<Map<String, Object>> findReservedRangesByTripPlanId(Long tripPlanId);
}