package com.ssdam.tripPaw.pay;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.PayShare;

@Mapper
public interface PayShareMapper {
	public PayShare findById(Long id);
	public List<PayShare> findAll();
	public int insert(PayShare paygroup);
	public int delete(Long id);
	
	public PayShare findByPayIdAndMemberId(@Param("payId") Long payId, @Param("memberId") Long memberId);
	public int countByPayId(@Param("payId") Long payId);
	public int update(PayShare payShare);
	public int countUnpaidByPayId(Long payId);
	public List<PayShare> findByPayId(@Param("payId") Long payId);
	public PayShare findByReservIdAndMember(@Param("reservId") Long reservId, @Param("memberId") Long memberId);
	public List<Member> findParticipantsByPayId(@Param("reservId") Long reservId);
}
