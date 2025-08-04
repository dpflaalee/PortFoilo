package com.yoonlee3.diary.like;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LikeRepository extends JpaRepository<Likes , LikesId> {
	
	 Optional<Likes> findByDiaryIdAndUserId(Long diary_id, Long user_id);
	 
	 long countByDiaryId(Long diaryId);
	 
	 @Transactional
	 @Modifying
	 @Query("DELETE FROM Likes l WHERE l.diary.id = :diaryId")
	 void deleteByDiaryId(Long diaryId);
}
