package com.ssdam.tripPaw.member.util;
//package com.company.project001.util;
//
//import java.io.IOException;
//import java.util.Arrays;
//import java.util.List;
//
//import javax.servlet.FilterChain;
//import javax.servlet.ServletException;
//import javax.servlet.http.Cookie;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//import org.springframework.http.HttpHeaders;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import com.company.project001.domain.Member;
//import com.company.project001.member.MemberService;
//
////필터에서는 autowired 사용x
//public class JwtTokenFilter extends OncePerRequestFilter{
//	   private final JwtProvider jwtProvider;
//
//	    public JwtFilter(JwtProvider jwtProvider) {
//	        this.jwtProvider = jwtProvider;
//	    }
//
//	    @Override
//	    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
//	            throws ServletException, IOException {
//
//	        String token = resolveToken(request);
//	        if (token != null && jwtProvider.validateToken(token)) {
//	            String username = jwtProvider.getUsername(token);
//	            UsernamePasswordAuthenticationToken authentication =
//	                    new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
//	            SecurityContextHolder.getContext().setAuthentication(authentication);
//	        }
//
//	        chain.doFilter(request, response);
//	    }
//
//	    private String resolveToken(HttpServletRequest request) {
//	        String bearer = request.getHeader("Authorization");
//	        return (bearer != null && bearer.startsWith("Bearer ")) ? bearer.substring(7) : null;
//	    }
//
//}
