package com.yoonlee3.diary.user;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {
	private final UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Optional<User> find = userRepository.findByEmail(email);
		if(find.isEmpty()) { throw new UsernameNotFoundException("사용자를 확인해주세요."); }
		
		User user = find.get();
		/// 권한
		List<GrantedAuthority> authorities = new ArrayList<>();
		if( "admin@admin.com".equals(email) ) {
			authorities.add( new SimpleGrantedAuthority( UserRole.ADMIN.getValue() ) );
		}else {
			authorities.add( new SimpleGrantedAuthority( UserRole.USER.getValue() ) );
		}	
		
		return new org.springframework.security.core.userdetails.User( user.getEmail() , user.getPassword() , authorities );
	}
}
