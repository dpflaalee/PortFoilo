package com.ssdam.tripPaw.search;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.TripPlan;

@Mapper
public interface SearchMapper {

    //장소 ID 조회 (LIMIT + OFFSET)
    List<Long> findPlaceIdsByKeyword(Map<String, Object> paramMap);

    //ID 기반 장소 정보 조회
    List<Place> findPlacesByIds(List<Long> ids);

    List<Long> findTripPlanIdsByKeyword(Map<String, Object> paramMap);

    List<TripPlan> findTripPlansByIds(List<Long> ids);
}
