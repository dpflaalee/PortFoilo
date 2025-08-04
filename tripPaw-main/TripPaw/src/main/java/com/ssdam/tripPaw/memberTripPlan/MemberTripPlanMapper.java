package com.ssdam.tripPaw.memberTripPlan;

import com.ssdam.tripPaw.domain.MemberTripPlan;
import com.ssdam.tripPaw.dto.MemberTripPlanSaveRequest;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberTripPlanMapper {

	/*
	 * ID로 단건 조회
	 */
	MemberTripPlan findById(@Param("id") Long id);

	/*
	 * 사용자 ID로 모든 여행 조회
	 */
	List<MemberTripPlan> findByMemberId(@Param("memberId") Long memberId);

	/*
	 * 새로운 여행 계획 삽입
	 */
	int insert(MemberTripPlan memberTripPlan);

	// 다른 사람의 tripPlan을 memberTripPlan으로 저장
	void insertMemberTripPlan(MemberTripPlan entity);

	// 중복 확인
	boolean existsByMemberIdAndTripPlanId(@Param("memberId") Long memberId, @Param("tripPlanId") Long tripPlanId);

	/*
	 * 기존 여행 계획 수정
	 */
	int update(MemberTripPlan memberTripPlan);

	/*
	 * 삭제
	 */
	int delete(@Param("id") Long memberId);
}
