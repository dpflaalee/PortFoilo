package com.ssdam.tripPaw.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://3.34.235.202",       // EC2 IP 주소
                        "https://your-domain.com"    // 도메인 연결 시
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 리뷰 이미지
        String reviewPath = Paths.get("C:/upload/reviews").toFile().getAbsolutePath();
        registry.addResourceHandler("/upload/reviews/**")
                .addResourceLocations("file:///" + reviewPath + "/");

        // 뱃지 이미지
        String badgePath = Paths.get("C:/upload/badge").toFile().getAbsolutePath();
        registry.addResourceHandler("/upload/badge/**")
                .addResourceLocations("file:///" + badgePath + "/");

        // 멤버 이미지
        String memberPath = Paths.get("C:/upload/memberImg").toFile().getAbsolutePath();
        registry.addResourceHandler("/upload/memberImg/**")
                .addResourceLocations("file:///" + memberPath + "/");

        // 체크리스트 업로드 경로 (기존 /uploads/** 대응)
        String checklistUploadPath = Paths.get("C:/upload").toFile().getAbsolutePath();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + checklistUploadPath + "/");
    }
}
