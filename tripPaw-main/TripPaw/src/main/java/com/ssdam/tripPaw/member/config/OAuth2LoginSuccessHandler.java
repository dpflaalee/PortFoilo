package com.ssdam.tripPaw.member.config;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.ssdam.tripPaw.member.security.MemberUserDetails;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.member.util.RedisUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
	
	private final JwtProvider jwtProvider;
	private final RedisUtil redisUtil;

	   

	    @Override
	    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		Object principal = authentication.getPrincipal();
		
		MemberUserDetails userDetails = (MemberUserDetails) principal;
		String useremail = userDetails.getEmail();
		
		 System.out.println("로그인에 성공했습니다. 이메일: {}"+ useremail);
		    
		// 1. 로그인 성공한 사용자를 기반으로 JWT 토큰을 생성
		String accessToken = jwtProvider.generateAccessToken(authentication);
		String refreshToken = jwtProvider.generateRefreshToken(authentication);
		    
		// 2. 프론트엔드로 리다이렉트할 URL
		String profile = System.getProperty("spring.profiles.active", "local"); // 기본값 local
		boolean isProd = profile.equals("prod");
		
		String redirectUrl = isProd
			? "http://3.34.235.202"        // 실제 배포 도메인
			: "http://localhost:3000";       // 개발용 주소
		
		String targetUrl = UriComponentsBuilder.fromUriString(redirectUrl)
			//.queryParam("token", accessToken)
			//.queryParam("refreshToken", refreshToken)
			.build().toUriString(); 
		
		ResponseCookie cookie = ResponseCookie.from("jwt", accessToken)
			.httpOnly(true)
			.secure(isProd) // 개발 중: http 환경이면 false, 운영에서는 true
			.sameSite("Lax")
			.path("/")
			.maxAge(60 * 60)
			.build();
		response.addHeader("Set-Cookie", cookie.toString());
		
		// 3. 만든 URL로 사용자를 리다이렉트
		getRedirectStrategy().sendRedirect(request, response, targetUrl);
	    }
	
}
