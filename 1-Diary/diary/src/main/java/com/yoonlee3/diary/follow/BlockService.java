package com.yoonlee3.diary.follow;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yoonlee3.diary.user.User;

@Service
public class BlockService {

	 private final BlockRepository blockRepository;
	    private final FollowRepository followRepository;

	    public BlockService(BlockRepository blockRepository, FollowRepository followRepository) {
	        this.blockRepository = blockRepository;
	        this.followRepository = followRepository;
	    }

	    // 차단 기능 (차단 + 양방향 언팔로우)
	    @Transactional
	    public void blockUser(User blocker, User blocked) {
	        if (!blockRepository.existsByBlockerAndBlocked(blocker, blocked)) {
	            blockRepository.save(new Block(blocker, blocked));
	        }

	        // 내가 그 사람을 팔로우 중이면 끊기
	        followRepository.findByFollowerAndFollowing(blocker, blocked)
	                .ifPresent(follow -> followRepository.delete(follow));

	        // 그 사람이 나를 팔로우 중이면 끊기
	        followRepository.findByFollowerAndFollowing(blocked, blocker)
	                .ifPresent(follow -> followRepository.delete(follow));
	    }

    // 차단 해제 기능
    @Transactional
    public void unblockUser(User blocker, User blocked) {
        blockRepository.deleteByBlockerAndBlocked(blocker, blocked);
    }

    // 차단 여부 확인
    public boolean isBlocked(User blocker, User blocked) {
        return blockRepository.existsByBlockerAndBlocked(blocker, blocked);
    }
    
    // 내가 차단한 사용자 목록	
    public List<User> getBlockedUsers(Long currentUserId) {
        return blockRepository.findBlockedUsersByBlockerId(currentUserId);
    }
    
}
