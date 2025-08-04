package com.yoonlee3.diary.follow;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yoonlee3.diary.user.User;

public interface FollowRepository extends JpaRepository<Follow, Long> {
	
	boolean existsByFollowerAndFollowing(User follower, User following);

	// 내가 팔로우한 사람 목록
	List<Follow> findByFollower(User follower);

	// 나를 팔로우한 사람 목록
	List<Follow> findByFollowing(User following);
	
	void deleteByFollowerAndFollowing(User follower, User following);
	
	// 팔로우 관계를 찾기 위한 메소드
	Optional<Follow> findByFollowerAndFollowing(User follower, User following);

	// 팔로워 수
    	long countByFollowing(User user);

    	// 팔로잉 수
    	long countByFollower(User user);
    

}
