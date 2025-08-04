package com.ssdam.tripPaw.member.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberUserDetailService implements UserDetailsService{
	private final MemberMapper memberMapper;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		System.out.println("loadUserByUsername");
		Member member = memberMapper.findByUsername(username);
		System.out.println(member);
		if(member == null) {
			throw new UsernameNotFoundException("해당 유저를 찾을 수 없습니다.");
		}
		return new MemberUserDetails(member);
	}
	
	
}
