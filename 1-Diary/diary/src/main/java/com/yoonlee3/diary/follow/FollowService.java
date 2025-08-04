package com.yoonlee3.diary.follow;

import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserProfileDto;
import com.yoonlee3.diary.user.UserRepository;

@Service
@RequiredArgsConstructor
public class FollowService {

	private final FollowRepository followRepository;
	private final UserRepository userRepository;

	// 팔로우 기능
	@Transactional
	public void follow(User follower, User following) {
		if (!followRepository.existsByFollowerAndFollowing(follower, following)) {
			Follow follow = Follow.builder().follower(follower).following(following).build();
			followRepository.saveAndFlush(follow);
		}
	}

	// 내가 팔로우한 사람들
	public List<Follow> getFollowings(User follower) {
		return followRepository.findByFollower(follower);
	}

	// 나를 팔로우한 사람들
	public List<Follow> getFollowers(User following) {
		return followRepository.findByFollowing(following);
	}

	// 언팔로우 기능
	@Transactional
	public void unfollow(User follower, User following) {
		followRepository.deleteByFollowerAndFollowing(follower, following);
	}

	public UserProfileDto getUserProfile(User viewer, User target) {
		long followers = followRepository.countByFollowing(target);
		long followings = followRepository.countByFollower(target);

		// 프로필 이미지 URL 설정 (기본값 설정)
		String image = target.getProfileImageUrl() != null ? target.getProfileImageUrl()
				: "https://cdn.example.com/default-profile.png";

		// 로그인한 사용자가 해당 사용자를 팔로우 중인지 여부
		boolean isFollowing = followRepository.existsByFollowerAndFollowing(viewer, target);

		// 팔로워 리스트 초기화
		List<String> followersList = followRepository.findByFollowing(target).stream()
				.map(follow -> follow.getFollower().getUsername())
				.collect(Collectors.toList());

		// 팔로잉 리스트 초기화
		List<String> followingsList = followRepository.findByFollower(target).stream()
				.map(follow -> follow.getFollowing().getUsername())
				.collect(Collectors.toList());

		// UserProfileDto 반환
		return new UserProfileDto(target.getId(), target.getUsername(), image, followers, followings, isFollowing,
				followersList, // followersList 필드 추가
				followingsList // followingsList 필드 추가
		);
	}

	public List<Long> getFollowingIds(Long currentUserId) {
		User user = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("사용자 없음"));
		return followRepository.findByFollower(user).stream().map(f -> f.getFollowing().getId())
				.collect(Collectors.toList());
	}

	public int countFollowers(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자 없음"));
		return (int) followRepository.countByFollowing(user);
	}

	public int countFollowings(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자 없음"));
		return (int) followRepository.countByFollower(user);
	}

}
