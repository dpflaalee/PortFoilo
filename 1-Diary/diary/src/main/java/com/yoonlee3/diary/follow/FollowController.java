package com.yoonlee3.diary.follow;

import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserProfileDto;
import com.yoonlee3.diary.user.UserRepository;

@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final UserRepository userRepository;

    //팔로우
    @PostMapping
    public ResponseEntity<String> follow(@RequestParam Long followerId, @RequestParam Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("팔로워 없음"));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("팔로잉 없음"));

        followService.follow(follower, following);
        return ResponseEntity.ok("팔로우 성공");
    }

    // 내가 팔로우한 사람 목록
    @GetMapping("/following")
    public ResponseEntity<List<UserProfileDto>> getFollowing(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        List<UserProfileDto> followings = followService.getFollowings(user)
                .stream()
                .map(f -> new UserProfileDto(f.getFollowing().getId(), f.getFollowing().getUsername(), f.getFollowing().getProfileImageUrl()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(followings);
    }
    // 나를 팔로우한 사람 목록
    @GetMapping("/followers")
    public ResponseEntity<List<UserProfileDto>> getFollowers(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        List<UserProfileDto> followers = followService.getFollowers(user)
                .stream()
                .map(f -> new UserProfileDto(f.getFollower().getId(), f.getFollower().getUsername(),f.getFollower().getProfileImageUrl()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(followers);
    }

    // 언팔로우
    @DeleteMapping
    public ResponseEntity<String> unfollow(@RequestParam Long followerId, @RequestParam Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("팔로워 없음"));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("팔로잉 없음"));

        followService.unfollow(follower, following);
        return ResponseEntity.ok("언팔로우 성공");
    }

    // 내가 팔로우한 사람들의 ID 목록
    @GetMapping("/following/ids")
    public ResponseEntity<List<Long>> getFollowingIds(@RequestParam Long userId) {
        List<Long> followingIds = followService.getFollowingIds(userId);
        return ResponseEntity.ok(followingIds);
    }
   
    
}
