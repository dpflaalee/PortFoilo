package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.MemberCheck;

@Mapper
public interface MemberCheckMapper {

    // MemberCheck 단일 삽입
    void insertMemberCheck(MemberCheck memberCheck);

    // 루틴 ID 기준 MemberCheck 리스트 조회
    List<MemberCheck> selectByRoutineId(@Param("routineId") Long routineId);

    // 멤버 ID 기준 MemberCheck 리스트 조회
    List<MemberCheck> selectByMemberId(@Param("memberId") Long memberId);
    
    // 루트 ID 기준 MemberCheck 리스트 조회
    List<MemberCheck> selectByRouteId(@Param("routeId") Long routeId);

    // MemberCheck 상태 및 내용 수정
    int updateMemberCheck(MemberCheck memberCheck);

    // MemberCheck 단일 삭제
    int deleteMemberCheckById(@Param("id") Long id);

    // 루틴 ID 기준 전체 삭제 (루틴 삭제 시 필요)
    int deleteByRoutineId(@Param("routineId") Long routineId);
    
}
