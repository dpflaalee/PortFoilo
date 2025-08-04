package com.ssdam.tripPaw.tripPlan;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Route;
import com.ssdam.tripPaw.domain.RoutePlace;
import com.ssdam.tripPaw.domain.TripPlan;
import com.ssdam.tripPaw.domain.TripPlanCourse;

@Mapper
public interface TripPlanMapper {
	
	TripPlan findByIdWithCourses(Long id); // JOIN해서 course, route, route_place, place까지 가져오기

	int insertTripPlan(TripPlan tripPlan);

	int insertRoute(Route route);

	int insertRoutePlace(RoutePlace routePlace);

	int insertTripPlanCourse(TripPlanCourse course);
	
	List<TripPlan> findByMemberId(Long id);
	
	List<TripPlan> findAllTrips();
	
	// 공개로 전환하기
	void makeTripPlanPublic(Long id);
	Boolean isTripPlanPublic(Long id);

	int delete(Long id);

	void update(TripPlan tripPlan);
	
	List<TripPlan> findByMemberIdWithReviews(Long id);
	
	// 기본정보만 가져옴
	TripPlan findById(Long id);
	
	TripPlan findByIdWithMember(Long id);
	
	TripPlan findByIdWithCoursesAndReviews(Long id);
}
