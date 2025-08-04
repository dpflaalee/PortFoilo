package com.ssdam.tripPaw.member.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;

import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.member.oauth.PrincipalOauth2UserService;
import com.ssdam.tripPaw.member.security.MemberUserDetailService;
import com.ssdam.tripPaw.member.util.JwtFilter;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.member.util.JwtUtil;

@Configuration 
@EnableWebSecurity 
public class SecurityConfig {
	
	@Autowired
	PrincipalOauth2UserService principalOauth2UserService;
	
	@Autowired
	JwtUtil jwtUtil; //jwt 토큰발급 ##1
	
	@Autowired
	JwtProvider jwtProvider;
	@Autowired
	MemberUserDetailService memberUserDetailService;
	@Autowired
	OAuth2LoginSuccessHandler auth2LoginSuccessHandler;
	@Autowired
	OAuth2LoginFailureHandler auth2LoginFailureHandler;
	

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http, MemberService memberService) throws Exception {
		JwtFilter jwtTokenFilter = new JwtFilter(memberService, jwtProvider,memberUserDetailService); 
		
		http
		.cors().configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("http://localhost:3000", "http://3.34.235.202"));
            config.setAllowCredentials(true);
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setExposedHeaders(List.of("Set-Cookie"));
            return config;
        }).and()
		.csrf().disable() //개발용 (보호기능 비활성화)- csrf : 사용자 인증정보를 웹페이지에서 보내기
			.sessionManagement()//쿠키 상에서 데이터 값저장
				.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 세션필요할때만
			.and()
		.authorizeRequests()
			.antMatchers("/login/oauth2/code/**").permitAll()
			.antMatchers("/api/auth/**","/api/sms/**").permitAll() // 누구나 접근가능 // mobile전용 jwt
			.antMatchers("/member/login","/member/join","/resources/**").permitAll() // 누구나 접근가능 // pc전용 jwt security
		.anyRequest().permitAll()
		.and()
		.logout()
			.logoutRequestMatcher(new AntPathRequestMatcher("/member/logout"))
			.logoutSuccessUrl("/member/login") //로그아웃 성공경로
			.invalidateHttpSession(true) //로그아웃시 세션무효
			.and()
		.oauth2Login(oauth2 -> oauth2
		            .successHandler(auth2LoginSuccessHandler) // 성공 핸들러 등록
		            .failureHandler(auth2LoginFailureHandler) // 실패 핸들러 등록
		            .userInfoEndpoint(
		            		userInfo -> userInfo
		            		.userService(principalOauth2UserService)
		            )
		            )
		.exceptionHandling()//에러제어
			.authenticationEntryPoint( (request, response, authException) -> {
				if(!request.getRequestURI().startsWith("/api/")) { // /api/로 시작하지 않으면 pc버전
					response.sendRedirect("/member/login?error=true");
				} else {
					response.setStatus(401); //401 인증되지 않았을 때 - 로그인안하고 접근 했을 때 //400 - 잘 못 된 파라미터
					response.setContentType("application/json");
					response.getWriter().write("{\"error\":\"Unauthorized\"}"); // {"error":"Unauthorized"}
				}
			})
			.accessDeniedHandler((request, response, authException) -> {
				if(!request.getRequestURI().startsWith("/api/")) { // /api/로 시작하지 않으면 pc버전
					response.sendRedirect("/member/login?error=true");
				} else {
					response.setStatus(403); // 인증되었지만 접근권한이 없음 - 일반사용자가 관리자페이지 접근할 때
					response.setContentType("application/json");
					response.getWriter().write("{\"error\":\"Unauthorized\"}"); // {"error":"Unauthorized"}
				}
			});
		http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
	}
	
	//2.AuthenticationMagager(관리자)
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration auth) throws Exception{
		return auth.getAuthenticationManager();
	}
	
}
