package com.ssdam.tripPaw.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.MemberRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberMapper memberMapper;
	private final PasswordEncoder passwordEncoder;
	
	public Member insert(Member member) {
		try {
			member.setPassword(passwordEncoder.encode(member.getPassword()));
			member.getRole().add(MemberRole.MEMBER);
			memberMapper.insert(member);
		} catch(DataIntegrityViolationException e) {
			throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
		}
		
		return member;
	}
	
	public Member findByUsername(String username) {
		return memberMapper.findByUsername(username);
	};
	
	public Member findById(Long id) {
		return memberMapper.findById(id);
	};
	
	public List<Member> findAllByIds(List<Long> ids) {
		return memberMapper.findAllByIds(ids);
	}
	
	public Member findAll() {
		return memberMapper.findAll();
	};
	
	public int update(Member member) {
		return memberMapper.update(member);
	};
	
	public boolean delete(Long id, String password) {
		
		Member find = memberMapper.findById(id);
		
		if(find != null && passwordEncoder.matches(password, find.getPassword())) {
			return memberMapper.delete(id) > 0;
		}
		
		return false;
	};
	
	public int updateByIdAndPassword(Member member, String oldPassword) {
		Member find = memberMapper.findById(member.getId());
		
		if(find != null && passwordEncoder.matches(oldPassword, find.getPassword())) {
			String newPassword = passwordEncoder.encode(member.getPassword());				
			return memberMapper.updateByIdAndPassword(find.getId(), find.getPassword(), newPassword);
		}
		
		return 0;
	};
	
	public int updateMember(Member member) {
		return memberMapper.updateMember(member);
	}
	
	public boolean checkPassword(String currentPass, String newPass) {
		return passwordEncoder.matches(newPass, currentPass);
	}
	
	public int softDeleteMember(Long id) {
		return memberMapper.softDeleteMember(id,false);
	}
	
	// 포인트 적립 내역 추가
	public void addPoints(Long memberId, int points) {
	    memberMapper.insertPoints(memberId, points);
	}
	
	// 회원 포인트 총합 조회
	public int getTotalPoints(Long memberId) {
	return memberMapper.getTotalPointsByMemberId(memberId);
	}
    
    	// 멤버 정보 조회
   	public Member getMember(String memberId) {
        	return memberMapper.findByMemberIdString(memberId);
    	}

}
