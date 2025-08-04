package com.ssdam.tripPaw.member;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberImage;
import com.ssdam.tripPaw.member.config.MemberLoginForm;
import com.ssdam.tripPaw.member.config.MemberRole;
import com.ssdam.tripPaw.member.util.JwtFilter;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.member.util.RedisUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	
    private final MemberMapper memberMapper;
    private final MemberImageMapper memberImageMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RedisUtil redisUtil;
    private final JwtFilter jwtFilter;
    private final RedisTemplate<String, String> redisTemplate;
    

    public Map<String, String> login(MemberLoginForm request) {
        System.out.println("입력한 username: " + request.getUsername());
        System.out.println("입력한 password: " + request.getPassword());
        // 1. 사용자 조회 (기존과 동일)
        //토큰에 권한을 부여하기 위해 사용자 정보 가지고 옴
        Member member = memberMapper.findByUsername(request.getUsername());
        // 2. 비밀번호 검증 (기존과 동일)
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }


       // member.getRole().add(memberMapper.findMemberRoleTypeByMemberId(member.getId()));
        Collection<? extends GrantedAuthority> authorities = member.getRole().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(member.getUsername(), null, authorities);
        
        String accessToken = jwtProvider.generateAccessToken(authentication);
        String refreshToken = jwtProvider.generateRefreshToken(authentication);
        

        redisUtil.saveRefreshToken(member.getUsername(), refreshToken, 1209600000L);
        
        System.out.println("loginaccessToken" + accessToken);
        System.out.println("loginrefreshToken" + refreshToken);
        
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }
	
    public void logout(HttpServletRequest request) {
         
        String accessToken = resolveToken(request);
        System.out.println("logoutToken="+accessToken);
        if (!StringUtils.hasText(accessToken)) {
            // 토큰이 없는 경우 처리
            return;
        }
	    
        if (!jwtProvider.validateToken(accessToken)) {
            // 유효하지 않은 토큰에 대한 처리 (예: 예외 발생)
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 3. Access Token에서 사용자 정보(Authentication)를 가져옵니다.
        Authentication authentication = jwtProvider.getAuthentication(accessToken);

        if (redisTemplate.opsForValue().get("RT:" + authentication.getName()) != null) {
            redisTemplate.delete("RT:" + authentication.getName());
        }

        Long expiration = jwtProvider.getExpiration(accessToken);
        redisTemplate.opsForValue().set(accessToken, "logout", expiration, TimeUnit.MILLISECONDS);
    }
	
    public void register(Member request) {
        // 이미 존재하는 사용자 확인 (선택)
    	if(memberMapper.findByUsername(request.getUsername())!=null) {
		   throw new IllegalArgumentException("이미 존재하는 사용자입니다.");
    	}

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        Member member = Member.builder()
        					  .username(request.getUsername())
        					  .password(encodedPassword)
        					  .email(request.getEmail())
        					  .provider(request.getProvider())
        					  .nickname(request.getNickname())
        					  .zonecode(request.getZonecode())
        					  .roadAddress(request.getRoadAddress())
        					  .namujiAddress(request.getNamujiAddress())
        					  .status(true)
        					  .build();
        memberMapper.insert(member);				
        Member newMember = memberMapper.findByUsername(request.getUsername());
        memberMapper.insertMemberRole(newMember.getId(), MemberRole.MEMBER);

    }
	
    public int insertMemberImage(MemberImage memberImage) {
    	return memberImageMapper.insertMemberImage(memberImage);
    }
    
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("bearerToken="+bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    
}
