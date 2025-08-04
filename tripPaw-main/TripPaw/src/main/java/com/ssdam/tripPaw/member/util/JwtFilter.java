package com.ssdam.tripPaw.member.util;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.member.security.MemberUserDetailService;

@Component
public class JwtFilter extends OncePerRequestFilter{
//    private final JwtProvider jwtProvider;
//
//    public JwtFilter(JwtProvider jwtProvider) {
//        this.jwtProvider = jwtProvider;
//    }
	private final MemberUserDetailService memberUserDetailService;
	private final MemberService memberService;
    private final JwtProvider jwtProvider;
    //private final JwtUtil jwtUtil;
    
    
    public JwtFilter(MemberService memberService, JwtProvider jwtProvider, MemberUserDetailService memberUserDetailService) {
    	super();
    	this.memberService = memberService;
    	this.jwtProvider = jwtProvider;
    	this.memberUserDetailService = memberUserDetailService;
    }

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		 String token = resolveToken(request);
		 System.out.println("token="+token);
	        if (token != null && jwtProvider.validateToken(token)) {
	            String username = jwtProvider.getUsername(token);
	            
	            UserDetails userDetails = memberUserDetailService.loadUserByUsername(username);
	            UsernamePasswordAuthenticationToken authentication =
	                    new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
	            		//new UsernamePasswordAuthenticationToken(username, null, );
	            SecurityContextHolder.getContext().setAuthentication(authentication);
	        }

	        chain.doFilter(request, response);
		
	}
	 private String resolveToken(HttpServletRequest request) {
	        String bearer = request.getHeader("Authorization");
	        System.out.println("bearer"+bearer);
	        return (bearer != null && bearer.startsWith("Bearer ")) ? bearer.substring(7) : null;
	    }
}
