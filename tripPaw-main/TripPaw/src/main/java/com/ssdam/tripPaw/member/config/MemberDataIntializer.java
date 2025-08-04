package com.ssdam.tripPaw.member.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ssdam.tripPaw.domain.Member;

@Configuration
public class MemberDataIntializer{
	
	 @Bean
	    CommandLineRunner initDatabase(MemberRepository memberRepository) {
	        return args -> {
	        	if (memberRepository.count() == 0) {
	        		Member member = Member.builder()
		                    .username("admin")
		                    .password("$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK")
		                    .nickname("admin")
		                    .email("admin@example.com")
		                    .zonecode("13529")
		                    .roadAddress("경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)")
		                    //.jibunAddress("경기 성남시 분당구 백현동 532")
		                    .namujiAddress("102동")
		                    //.role(MemberRole.ADMIN)
		                    .status(true)
		                    .provider("")
		                    .build();
	        		member.getRole().add(MemberRole.ADMIN);
	            memberRepository.save(member);
	            
	            
	            member = Member.builder()
        		.username("test1")
        		.password("$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK")
        		.nickname("test1")
        		.email("test1@naver.com")
        		.zonecode("13529")
        		.roadAddress("경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)")
        		//.jibunAddress("경기 성남시 분당구 백현동 532")
        		.namujiAddress("102동")
        		.status(true)
        		.provider("")
        		.build();
	            member.getRole().add(MemberRole.MEMBER);
	            memberRepository.save(member);
	            
	            member = Member.builder()
	            		.username("test2")
	            		.password("$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK")
	            		.nickname("test2")
	            		.email("test2@google.com")
	            		.zonecode("13529")
	            		.roadAddress("경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)")
	            		//.jibunAddress("경기 성남시 분당구 백현동 532")
	            		.namujiAddress("102동")
	            		.status(true)
	            		.provider("")
	            		.build();
	            member.getRole().add(MemberRole.MEMBER);
	            memberRepository.save(member);
	            
	            member = Member.builder()
	            		.username("test3")
	            		.password("$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK")
	            		.nickname("test3")
	            		.email("test3@kakao.com")
	            		.zonecode("13529")
	            		.roadAddress("경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)")
	            		//.jibunAddress("경기 성남시 분당구 백현동 532")
	            		.namujiAddress("102동")
	            		.status(true)
	            		.provider("")
	            		.build();
	            member.getRole().add(MemberRole.MEMBER);
	            memberRepository.save(member);
	            		System.out.println("더미 데이터 삽입 완료");	
	        	  } else {
	        		  System.out.println("데이터가 이미 존재하므로 삽입하지 않음");
	        	  }
	        };
	 }
	 
}