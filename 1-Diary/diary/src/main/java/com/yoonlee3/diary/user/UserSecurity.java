package com.yoonlee3.diary.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class UserSecurity {
	@Value("http://localhost:8080/kakaologout")
	private String kakao_redirect_url;
	
	@Value("${kakao_api}")
	private String kakao_api;
@Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
		http.authorizeHttpRequests(
			(authorizeHttpRequests) -> authorizeHttpRequests
							.requestMatchers(
								new AntPathRequestMatcher("/css/**"),
								new AntPathRequestMatcher("/js/**"),
								new AntPathRequestMatcher("/images/**")
							).permitAll()
			                               	.requestMatchers(
			                            		new AntPathRequestMatcher("/diary/emoji"),
			                            		new AntPathRequestMatcher("/**") )
			                               	.permitAll() // 모든사용자 접근가능
		).formLogin(
			(formLogin) -> formLogin.loginPage("/user/login").defaultSuccessUrl("/mypage")
		).logout(
			(logout) -> logout.logoutRequestMatcher(new AntPathRequestMatcher("/user/logout")).logoutSuccessHandler((request, response, authentication) -> {
			    String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout"
			            + "?client_id=" + kakao_api
			            + "&logout_redirect_uri=" + kakao_redirect_url;
			    response.sendRedirect(kakaoLogoutUrl);
			}).invalidateHttpSession(true)
		)
        .csrf().disable();
		return http.build();
	}
	
	@Bean
	AuthenticationManager authenticationManager(
			AuthenticationConfiguration authenticationConfiguration
	) throws Exception{ 
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
