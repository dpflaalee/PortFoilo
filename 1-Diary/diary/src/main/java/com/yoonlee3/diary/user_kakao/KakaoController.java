package com.yoonlee3.diary.user_kakao;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserRepository;
import com.yoonlee3.diary.user.UserRole;
import com.yoonlee3.diary.user.UserService;

@Controller
public class KakaoController {

	@Autowired
	KakaoLogin api;
	@Autowired UserRepository userRepository;

	@GetMapping("/kakao")
	public String loginuser(@RequestParam("code") String code , Model model) {
		List<String> infos = api.step2(code);
		String nickname = infos.get(0);
		String profile = infos.get(1);
		String email = nickname + "@kakao.com"; // 임시 이메일 대체값
		
	    Optional<User> optionalUser = userRepository.findByEmail(email);
	    User user;
		
	    if (optionalUser.isEmpty()) {
	        // 신규 유저 저장
	        user = new User();
	        user.setEmail(email);
	        user.setPassword("");
	        user.setNickname(nickname);
	        user.setUsername(nickname);
	        userRepository.save(user);
	    } else {
	        user = optionalUser.get();
	    }
	    
	   List<GrantedAuthority> authorities = new ArrayList<>();
	        
	    if ("admin@admin.com".equals(email)) {
	            authorities.add(new SimpleGrantedAuthority(UserRole.ADMIN.getValue()));
	    } else {
	            authorities.add(new SimpleGrantedAuthority(UserRole.USER.getValue()));
	    }
	    
	    UserDetails userDetails = new org.springframework.security.core.userdetails.User(
	            user.getEmail(),
	            user.getPassword(), 
	            authorities
	        );
	    
	    Authentication authentication = new UsernamePasswordAuthenticationToken(
	    	    userDetails, null, authorities
	    	);
	    	SecurityContextHolder.getContext().setAuthentication(authentication);
		    
		model.addAttribute("nickname" , nickname);
		model.addAttribute("profile_image" , profile);
		return "redirect:/mypage";
	}

	@GetMapping("/kakaologout")
	public String logoutuser() {
		return "redirect:/user/login";
	}
}
