package com.ssdam.tripPaw.review;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.badge.BadgeMapper;
import com.ssdam.tripPaw.domain.Badge;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/badges")
public class MemberBadgeController {
	private final ReviewService reviewService;
	private final BadgeMapper badgeMapper;
	
	@GetMapping
	public List<Badge> getAllBadges() {
		return badgeMapper.findAll();
	}
	
	@GetMapping("/{memberId}")
	public ResponseEntity<List<Badge>> getMemberBadges(@PathVariable Long memberId) {
		List<Badge> badges = reviewService.getBadgesByMemberId(memberId);
		return ResponseEntity.ok(badges);
	}
	
}
