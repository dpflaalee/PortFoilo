package com.ssdam.tripPaw.member;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberImage;
import com.ssdam.tripPaw.member.config.MemberRole;

@Mapper
public interface MemberMapper {
	public Member findMemberById(String memberId);
	public Member findByUsername(String username);
	public Member findById(Long id);
	public List<Member> findAllByIds(@Param("ids") List<Long> ids);
	public Member findAll();
	public int insert(Member member);
	public int update(Member member);
	public int delete(Long id);
	public int updateByIdAndPassword(@Param("id") Long id
									,@Param("oldPassword") String oldPassword
									,@Param("newPassword") String newPassword );

	public int insertMemberRole(Long memberId, MemberRole memberRoleType);

	
	Member findByMemberIdString(@Param("memberId") String memberId);
    
	// 포인트 적립 내역 추가
	int insertPoints(@Param("memberId") Long memberId, @Param("points") int points);

	// 포인트 총합 조회
	int getTotalPointsByMemberId(@Param("memberId") Long memberId);  
	
	// 닉네임으로 회원 조회
	Member findByNickname(@Param("nickname") String nickname);
   

	public int updateMember(Member member);

	public int softDeleteMember(Long id, boolean status);

}
