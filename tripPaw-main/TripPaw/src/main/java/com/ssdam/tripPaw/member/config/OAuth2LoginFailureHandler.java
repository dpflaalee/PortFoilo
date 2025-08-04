package com.ssdam.tripPaw.member.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {
    
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        
        log.error("### 소셜 로그인에 실패했습니다. 에러 메시지 : {}", exception.getMessage());
        exception.printStackTrace(); // 전체 에러 내용을 확인하고 싶을 때

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/member/login")
                .queryParam("error", "social_login_failed")
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}
