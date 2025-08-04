package com.yoonlee3.diary.follow;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yoonlee3.diary.user.User;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {

	// 차단 관계가 존재하는지 확인
	boolean existsByBlockerAndBlocked(User blocker, User blocked);

	// 차단 해제
	void deleteByBlockerAndBlocked(User blocker, User blocked);

	// 차단 관계 조회
	Block findByBlockerAndBlocked(User blocker, User blocked);

	// 특정 사용자가 차단한 사람들 목록 조회
	List<Block> findByBlocker(User blocker);

	// 특정 사용자를 차단한 사람들 목록 조회
	List<Block> findByBlocked(User blocked);

	// 내가 차단한 사람들 수 카운트
	long countByBlocker(User blocker);

	// 나를 차단한 사람들 수 카운트
	long countByBlocked(User blocked);

	// 차단한 사용자 목록
	@Query("SELECT b.blocked FROM Block b WHERE b.blocker.id = :blockerId")
	List<User> findBlockedUsersByBlockerId(@Param("blockerId") Long blockerId);

	// 특정 사용자가 blocker로 존재하는 모든 Block 삭제
	void deleteByBlockerId(Long userId);

	// 특정 사용자가 blocked로 존재하는 모든 Block 삭제
	void deleteByBlockedId(Long userId);

}
