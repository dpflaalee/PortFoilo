package com.ssdam.tripPaw.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Badge;

@Mapper
public interface MemberBadgeMapper {
	// 유저가 작성한 모든 리뷰의 글자 수 총합 계산
	int getTotalContentLengthByMemberId(Long memberId);
	
	// 획득 가능한 뱃지 목록을 조회
	List<Badge> findEligibleBadges(@Param("totalContentLength") int totalContentLength);
	
	// 유저가 특정 뱃지를 이미 보유하고 있는지 확인
	boolean hasBadge(@Param("memberId") Long memberId, @Param("badgeId") Long badgeId);
	
	// member_badge 테이블에 뱃지 부여
	void insertMemberBadge(@Param("memberId") Long memberId, @Param("badgeId") Long badgeId);
	
	// 특정 회원이 보유한 모든 뱃지 목록 조회
	List<Badge> findBadgesByMemberId(Long memberId);
}
