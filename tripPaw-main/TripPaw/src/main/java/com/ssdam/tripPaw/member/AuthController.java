package com.ssdam.tripPaw.member;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssdam.tripPaw.chatting.chatroom.ChatRoomForm;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberImage;
import com.ssdam.tripPaw.member.config.MemberLoginForm;
import com.ssdam.tripPaw.member.util.FileUploadUtil;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.member.util.RedisUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;
    private final RedisUtil redisUtil;
    private final MemberService memberService;
    private final FileUploadUtil fileUpload;
    private final MemberImageService memberImageService;
    private final PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginForm request, Model model, HttpServletResponse response) {
    	System.out.println("로그인 실행");
    	System.out.println("request="+request.getUsername());
    	Member member = memberService.findByUsername(request.getUsername());
        String token = authService.login(request).get("accessToken");
        System.out.println("isStatus="+member.isStatus());
        
        if(!member.isStatus()) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        						//.body(Map.of("message","아이디와 비밀번호를 확인해주세요!"));
        }
        
        String authorities = (String)jwtProvider.getAuthoritie(token);
        System.out.println("authorities권한="+(String)authorities);
        
        model.addAttribute("ChatRoomForm",new ChatRoomForm());
        
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // 개발 중: http 환경이면 false, 운영에서는 true
                .sameSite("Lax")
                .path("/")
                .maxAge(60 * 60)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        
        return ResponseEntity.ok(Map.of("message", "로그인 성공!", 
        		"nickname", member.getNickname(),
        		"role",authorities,
        		 "id", member.getId() )); 
    }
    
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Member request) {
    	System.out.println("member="+request);
        authService.register(request);
        Member member = memberService.findByUsername(request.getUsername());
        memberImageService.insertMemberImage(member);
        return ResponseEntity.ok("가입이 완료되었습니다.");
    }

    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request);
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0) // 즉시 만료
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok("성공적으로 로그아웃 처리되었습니다.");
    }
    
    @GetMapping("/check")
    public ResponseEntity<?> checkAuthStatus(@CookieValue(value = "jwt", required = false) String token) {
    	System.out.println("token="+token);
        // 2. 브라우저가 보낸 쿠키를 받아서 토큰 검증
        if (token == null || jwtProvider.isExpired(token)) {
            // 토큰이 없거나 만료되었으면 401 Unauthorized 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3. 토큰이 유효하면, 사용자 정보를 담아 200 OK 응답
        String username = jwtProvider.getUsername(token);
        Member member = memberService.findByUsername(username);
        String authorities = (String)jwtProvider.getAuthoritie(token);
        
        System.out.println("checkusername="+username);
        Map<String, Object> userInfo = Map.of(
        	"id", member.getId(),
            "username", member.getUsername(),
            "nickname", member.getNickname(),
            "memberId", member.getId(),
            "zonecode",member.getZonecode() != null ? member.getRoadAddress() : "",
            "roadAddress",member.getRoadAddress() != null ? member.getRoadAddress() : "",
            "namujiAddress",member.getNamujiAddress() != null ? member.getNamujiAddress() : "",
            "auth", authorities
        );

        return ResponseEntity.ok(userInfo);
    }
    
    @PostMapping("/update")
    public ResponseEntity<?> uploadFile(@RequestPart(value="profileImage", required = false) MultipartFile file,
    		@RequestPart("username") String username,
    		@RequestPart("useremail") String useremail,
            @RequestPart("nickname") String nickname,
            @RequestPart("password") String password,
            @RequestPart(value="zonecode",required = false) String zonecode,
            @RequestPart(value="roadAddress",required = false) String roadAddress,
            @RequestPart(value="namujiAddress",required = false) String namujiAddress,
            @RequestPart(value="provider",required = false) String provider){
    	System.out.println("file="+file.getOriginalFilename());
    	System.out.println("username="+username);
    	
    	Member oldMember = memberService.findByUsername(username);
    	String msg = fileUpload.fileUpload(file,oldMember);
    	Member newMember = Member.builder()
    						  .id(oldMember.getId())
    						  .username(username)
    						  .nickname(nickname)
    						  .password(passwordEncoder.encode(password))
    						  .zonecode(zonecode)
    						  .roadAddress(roadAddress)
    						  .namujiAddress(namujiAddress)
    						  .provider(provider)
    						  .build();
    	memberService.updateMember(newMember);
    	
    	return ResponseEntity.ok(Map.of("이미지 업로드 성공",msg));
    }
    
    @GetMapping("/getProfileImage")
    public ResponseEntity<?> getProfileImage(@RequestParam("id") Long id){
    	System.out.println("requestId="+id);
    	Member member = memberService.findById(id);
    	MemberImage memberImage = memberImageService.selectMemberImage(id);
    	Map<String, String> responseMap = new HashMap<>();

        if (memberImage == null) {
            // 이미지가 없는 경우, src에 null을 담아 응답
            responseMap.put("src", null);
        } else {
            // 이미지가 있는 경우, src에 이미지 경로를 담아 응답
            responseMap.put("src", memberImage.getSrc());
        }
    	
    	return ResponseEntity.ok(responseMap);
    }
    
    @PostMapping("/memberDelete")
    public ResponseEntity<?> memberDelete(@RequestBody Member member, @CookieValue(value = "jwt", required = false) String token){
    	 
    	if (token == null || jwtProvider.isExpired(token)) {
          // 토큰이 없거나 만료되었으면 401 Unauthorized 응답
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	String username = jwtProvider.getUsername(token);
    	Member currntMember = memberService.findByUsername(username);
    	
    	Long currentMemeberId = currntMember.getId();
    	if(memberService.checkPassword(currntMember.getPassword(), member.getPassword())) {
    		memberService.softDeleteMember(currentMemeberId);
    		
    		return ResponseEntity.ok(Map.of("message","회원 탈퇴가 되었습니다."));
    	}else {
    		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    							.body(Map.of("error","비밀번호가 일치하지 않습니다."));
    	}
    	
    	
    }
}
