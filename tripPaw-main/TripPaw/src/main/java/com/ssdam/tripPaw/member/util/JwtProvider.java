package com.ssdam.tripPaw.member.util;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;
    
    private static final String AUTHORITIES_KEY = "auth";
    private final Key key; // ★ java.security.Key 타입의 키
    private final long accessTokenValidityInMilliseconds;
    private final long refreshTokenValidityInMilliseconds;
    // 생성자를 통해 application.yml의 설정값을 주입받고, Key 객체를 생성합니다.
    public JwtProvider(  @Value("${jwt.secret}")
					     String secretKey,
					    @Value("${jwt.access-token-validity}")
					     long accessTokenValidity,
					    @Value("${jwt.refresh-token-validity}")
					     long refreshTokenValidity) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey); // Base64 디코딩
        this.key = Keys.hmacShaKeyFor(keyBytes); // HMAC-SHA 알고리즘을 사용하는 Key 생성
        this.accessTokenValidityInMilliseconds = accessTokenValidity * 1000;
        this.refreshTokenValidityInMilliseconds = refreshTokenValidity * 1000;
    }
    
//    public String generateAccessToken(String username) {
//    	return createToken(username, accessTokenValidity);
//    }
//    
//    public String generateRefreshToken(String username) {
//    	return createToken(username, refreshTokenValidity);
//    }

//    private String createToken(String username, long expireTimeMs) {
//    	Claims claims = Jwts.claims();
//		claims.put("username", username);
//		Date now = new Date();
//		Date expiry = new Date(now.getTime() + expireTimeMs);
//		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(expiry)
//                .signWith(key,SignatureAlgorithm.HS256)
//                .compact();
//    }

	/**
	 * 토큰 생성을 위한 실제 로직을 담당하는 private 메소드
	 * @param authentication 인증 정보가 담긴 Authentication 객체
	 * @param tokenValidityMs 토큰의 만료 시간 (밀리초 단위)
	 * @return 생성된 JWT 문자열
	 */
	private String createToken(Authentication authentication, long tokenValidityMs) {
	    // 1. Authentication 객체에서 사용자의 권한 정보들을 가져옵니다.
	    // 예: ["ROLE_USER", "ROLE_ADMIN"]
	    String authorities = authentication.getAuthorities().stream()
	            .map(GrantedAuthority::getAuthority)
	            .collect(Collectors.joining(",")); // 2. 권한들을 콤마(,)로 구분된 하나의 문자열로 만듭니다.
	    System.out.println("createToken권한"+ authorities);
	    long now = (new Date()).getTime();
	    Date validity = new Date(now + tokenValidityMs); // 3. 토큰의 만료 시간을 계산합니다.
	
	    // 4. JWT 빌더를 사용하여 토큰을 생성합니다.
	    return Jwts.builder()
	            .setSubject(authentication.getName())       // sub: 페이로드의 주체, 여기서는 사용자 이름(ID)을 설정합니다.
	            .claim(AUTHORITIES_KEY, authorities)        // claim: "auth" 라는 이름의 클레임에 권한 정보 문자열을 저장합니다.
	            .signWith(key, SignatureAlgorithm.HS256)    // alg: 생성자에서 만든 key 객체와 HS512 알고리즘을 사용하여 서명합니다.
	            .setExpiration(validity)                    // exp: 계산된 만료 시간을 설정합니다.
	            .compact();                                 // 5. 최종적으로 토큰을 문자열 형태로 압축하여 반환합니다.
	}

    /**
     * 인증 정보를 받아 Access Token을 생성합니다.
     * @param authentication 인증이 완료된 Authentication 객체
     * @return 생성된 Access Token
     */
    public String generateAccessToken(Authentication authentication) {
        // 공통 createToken 메소드를 호출하여 Access Token의 만료 시간을 적용합니다.
        return createToken(authentication, this.accessTokenValidityInMilliseconds);
    }

    /**
     * 인증 정보를 받아 Refresh Token을 생성합니다.
     * @param authentication 인증이 완료된 Authentication 객체
     * @return 생성된 Refresh Token
     */
    public String generateRefreshToken(Authentication authentication) {
        // 공통 createToken 메소드를 호출하여 Refresh Token의 만료 시간을 적용합니다.
        return createToken(authentication, this.refreshTokenValidityInMilliseconds);
    }
    public String getUsername(String token) {
    	
        return extractClaims(token).getSubject();
    }

    public boolean isExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
    //권한정보 가져오기
    public Object getAuthoritie(String token) {
    	Claims claims = extractClaims(token);
    	Object authoritiesClaim = claims.get(AUTHORITIES_KEY);
    	return authoritiesClaim;
    }
    
    public boolean validateToken(String token) {
        try {
            return !isExpired(token); // 만료되지 않았으면 유효
        } catch (Exception e) {
            return false; // 파싱 실패 등 예외 시 false
        }
    }
    /**
     * 토큰 정보를 기반으로 Spring Security의 Authentication 객체를 생성하는 메서드
     * @param token 유효한 Access Token
     * @return 생성된 Authentication 객체
     */
    public Authentication getAuthentication(String token) {
        // 1. 토큰을 파싱하여 클레임(Claims)을 얻어옵니다.
    	Claims claims = extractClaims(token);

        // [수정] NullPointerException 방지
        Object authoritiesClaim = claims.get(AUTHORITIES_KEY);
        if (authoritiesClaim == null) {
            throw new RuntimeException("토큰에 권한 정보가 없습니다.");
        }
        // 2. 클레임에서 권한 정보(authorities)를 추출합니다.
        // "auth" 클레임 값을 콤마로 분리하여 GrantedAuthority 객체들의 컬렉션으로 변환합니다.
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // 3. 클레임에서 추출한 사용자 이름과 권한 정보로 UserDetails 객체를 생성합니다.
        // User는 UserDetails의 구현체입니다. 비밀번호는 토큰 기반 인증이므로 빈 문자열("")을 넣습니다.
        UserDetails principal = new User(claims.getSubject(), "", authorities);

        // 4. UserDetails 객체, 자격증명(null), 권한 정보를 포함하는 UsernamePasswordAuthenticationToken을 생성하여 반환합니다.
        // 이 객체가 SecurityContext에 저장되어 애플리케이션 전반에서 사용자의 인증 정보를 나타냅니다.
        return new UsernamePasswordAuthenticationToken(principal, null, authorities);
    }
    // ★★★ getSecretKey() 메소드 구현 ★★★
    // 이제 이 메소드는 미리 생성된 key 객체를 반환하기만 합니다.
    private Key getSecretKey() {
        return key;
    }
    private Claims extractClaims(String token) {
    	//SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
    	return Jwts.parserBuilder()
    			.setSigningKey(key)
    			.build()
    			.parseClaimsJws(token)
    			.getBody();
    }

    /**
     * Access Token에서 만료 시간을 추출하고, 현재 시간과의 차이를 계산하여
     * 남은 유효 시간을 밀리초(milliseconds) 단위로 반환합니다.
     * * @param token 만료 시간을 조회할 Access Token
     * @return 남은 유효 시간 (milliseconds)
     */
    public Long getExpiration(String token) {
        // 1. 토큰을 파싱하여 payload(body) 부분의 Claims 정보를 가져옵니다.
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSecretKey()) // 서명 키를 설정합니다. (getSecretKey()는 이전에 구현한 메소드)
                .build()
                .parseClaimsJws(token)
                .getBody();

        // 2. Claims 정보에서 만료 시간(Expiration)을 java.util.Date 객체로 가져옵니다.
        Date expirationDate = claims.getExpiration();
        
        // 3. 현재 시간을 밀리초 단위로 가져옵니다.
        long now = new Date().getTime();
        
        // 4. 만료 시간에서 현재 시간을 빼서 남은 유효 시간을 밀리초 단위로 계산하여 반환합니다.
        return expirationDate.getTime() - now;
    }
}