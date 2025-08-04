package com.ssdam.tripPaw.member.security;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.ssdam.tripPaw.domain.Member;
public class MemberUserDetails implements UserDetails, OAuth2User{
	
	private static final long serialVersionUID = 1L;
	private Member member;
	private Map<String, Object> attributes;
	public MemberUserDetails(Member member) {
		super();
		this.member = member;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return member.getRole().stream()
	            .map(role -> new SimpleGrantedAuthority(role.name()))
	            .collect(Collectors.toList());
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return member.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return member.getUsername();
	}
	
	//계정만료 됐는지 체크 = true 만료x
	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	
	//계정잠김 - true 안잠김
	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}
	
	//비밀번호 만료 - true 만료x 
	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	
	//계정활성화(사용가능) - true 활성화
	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
	
	//OAuth2User
	public MemberUserDetails(Member member, Map<String, Object> attributes) {
		super();
		this.member = member;
		this.attributes = attributes;
	}
	
	@Override
	public Map<String, Object> getAttributes() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public <A> A getAttribute(String name) {
		return OAuth2User.super.getAttribute(name);
	}
	@Override
	public String getName() {
		return null;
	}
	public String getNickname() {return member.getNickname();}
	public String getEmail() {return member.getEmail();}

}
