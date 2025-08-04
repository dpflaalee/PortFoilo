package com.ssdam.tripPaw.petpass.seal;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.Seal;

@Mapper
public interface SealMapper {
    // 전체 도장 목록
    List<Seal> findAll();

    // 장소 타입 ID로 도장 필터링
    List<Seal> findByPlaceTypeId(Long placeTypeId);

    // 단일 도장 조회 (ID 기반)
    Seal findById(Long id);

    // 도장 등록
    void insert(Seal seal);

    // 도장 수정
    void update(Seal seal);

    // 도장 삭제
    void delete(Long id);
    
    //placeType로 도장 조회
    List<Seal> findSealsByTripPlanId(@Param("memberTripPlanId") Long memberTripPlanId);
    
    int countSealsByName(String name);
    
    List<Seal> findUnacquiredSealsByTripPlanId(@Param("tripPlanId") Long tripPlanId,
            @Param("passportId") Long passportId);

    
}
