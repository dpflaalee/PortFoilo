package com.yoonlee3.diary.badge;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
	
	@Query("select b from Badge b where b.id = :badge_id")
	Optional<Badge> findById(Long badge_id);
	
}
