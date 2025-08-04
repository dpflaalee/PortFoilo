package com.ssdam.tripPaw.member.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component  //스프링이 관리하는 부품
public class JwtUtil {
	@Value("${jwt.secret}")
	private String secretKey;

	@Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;

    public String generateAccessToken(String username) {
        return createToken(username, accessTokenValidity);
    }

    public String generateRefreshToken(String username) {
        return createToken(username, refreshTokenValidity);
    }
    
    //jwt token 발급 //발급하는 코드만 바뀜
	public String createToken(String username, long expireTimeMs) {
		//Claims = jwt에 사용자정보 보관 username 등등 보관
		Claims claims = Jwts.claims();
		claims.put("username", username);
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expireTimeMs);
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		return Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(key,SignatureAlgorithm.HS256)  //32자 비밀키
				.compact();
	}
	
	//Claims에 username 꺼내기
	  public String getLoginId(String token) {
	        return extractClaims(token).get("username").toString();
	    } 
	//토큰만료여부
	  public boolean isExpired(String token) {
	        return extractClaims(token).getExpiration().before(new Date());
	    } 
	//내부 claims 추출
	  private Claims extractClaims(String token) {
	        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
	        return Jwts.parserBuilder()
	                .setSigningKey(key)
	                .build()
	                .parseClaimsJws(token)
	                .getBody();
	    }
}
