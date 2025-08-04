package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.CheckRoutine;

@Mapper
public interface CheckRoutineMapper {
	
	//루틴생성
	void insertCheckRoutine(CheckRoutine routine);
	
	//루틴목록조회
	List<CheckRoutine> selectAllCheckRoutines();
	
	//유저 개인 목록 전체조회
	List<CheckRoutine> selectRoutinesByMemberId(@Param("memberId") Long memberId);
	
	//여행용 루틴조회
	List<CheckRoutine> selectRoutinesByTripPlanId(@Param("memberId") Long memberId, @Param("tripPlanId") Long tripPlanId);
	
	//루틴단일조회
	CheckRoutine selectCheckRoutineById(@Param("id") Long id);
    
	//루틴 업데이트
	int updateCheckRoutine(CheckRoutine routine);
	
    	//루틴삭제
	int deleteCheckRoutineById(@Param("id") Long id);
	
	CheckRoutine selectRoutineWithItemsById(@Param("id") Long id);
    
}
