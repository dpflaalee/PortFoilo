package com.ssdam.tripPaw.member;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.MemberJoinForm;
import com.ssdam.tripPaw.member.config.MemberLoginForm;
import com.ssdam.tripPaw.member.util.JwtUtil;

@Controller
public class MemberController {
	
	@Autowired
	MemberService memberService;
	@Autowired
	JwtUtil jwtUtil;
	
	@GetMapping("/")
	public String home() {
		return "/";
	}
	
	@GetMapping("/member/member") //사용자들의 권한
	public String member( Authentication authentication, Model model) {
		if(authentication == null) {
			return "redirect:/member/login";
		}
		Member member = memberService.findByUsername(authentication.getName());
		model.addAttribute("dto", member);
		
		return "member/member";
	}
	
	///////////////////////////////////////////////////////////
	@GetMapping("/member/login") /// 로그인폼
	public String login_get(MemberLoginForm memberLoginForm,Model model) {
		model.addAttribute("MemberLoginForm", memberLoginForm);
		return "member/login";
	}
	
	@PostMapping("/member/login") //로그인유효성검사한 결과값 + 로그인기능
	public String login_post(@Valid MemberLoginForm memberLoginForm, BindingResult result) {
		Member member = memberService.findByUsername(memberLoginForm.getUsername());
		
		if(result.hasErrors()) {
			return "member/login";
		}
		String token = jwtUtil.createToken(member.getUsername(), 60 * 60 * 1000);
		return "redirect:/member/member";
	}
	
	///////////////////////////////////////////////////////////
	@GetMapping("/member/join") //회원가입폼
	public String join_get(MemberJoinForm memberJoinForm) {
		return "member/join";
	}
	
	@PostMapping("/member/join") //회원가입 할 검사값 결과값 + 회원가입기능
	public String join_post(@Valid MemberJoinForm memberJoinForm, BindingResult result) {
		if(result.hasErrors()) {
			System.out.println("에러");
			return "member/join";
		}
		if(!memberJoinForm.getPassword().equals(memberJoinForm.getPassword2())) {
			//어떤필드에, 에러코드, message
			result.rejectValue("password2", "passwordInCorrect","패스워드를 확인해주세요.");
			return "member/join";
		}
		try {
			Member member = Member.builder()
								 .username(memberJoinForm.getUsername())
								 .password(memberJoinForm.getPassword())
								 .email(memberJoinForm.getEmail())
								 .build();
			memberService.insert(member);
		}catch(DataIntegrityViolationException e) {
			e.printStackTrace();
			result.reject("failed","등록된 유저입니다.");
			return "member/join";
		}catch(Exception e) {
			e.printStackTrace();
			result.reject("failed",e.getMessage());
			return "member/join";
		}
	return "redirect:/member/login";
	}
	
	@ResponseBody
	@PostMapping("/api/member/update-points")
	public void updatePoints(@RequestBody PointUpdateRequest request) {
	    memberService.addPoints(request.getMemberId(), request.getPoints());
	}
	
	
	@ResponseBody
	@GetMapping("/api/member/total-points")
	public ResponseEntity<Map<String, Integer>> getTotalPoints(@RequestParam Long memberId) {
		int totalPoints = memberService.getTotalPoints(memberId);
		Map<String, Integer> response = new HashMap<>();
		response.put("totalPoints", totalPoints);
		return ResponseEntity.ok(response);
	}
	
	public static class PointUpdateRequest {
		private Long memberId;
		private int points;
		
		public Long getMemberId() {
		    return memberId;
		}
		
		public void setMemberId(Long memberId) {
		    this.memberId = memberId;
		}
		
		public int getPoints() {
		    return points;
		}
		
		public void setPoints(int points) {
		    this.points = points;
		}
	}
	
	
}
