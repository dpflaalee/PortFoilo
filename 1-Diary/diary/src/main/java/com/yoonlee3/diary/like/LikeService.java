package com.yoonlee3.diary.like;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.yoonlee3.diary.diary.Diary;
import com.yoonlee3.diary.diary.DiaryService;
import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserService;

@Service
public class LikeService {
	
	@Autowired
	LikeRepository likeRepository;
	@Autowired
	@Lazy
	DiaryService diaryService;
	@Autowired
	UserService userService;

	@Transactional
	public boolean toggleLike(Long diaryId, Long userId) {
		var existingLike = likeRepository.findByDiaryIdAndUserId(diaryId, userId);

		if (existingLike.isPresent()) {
			likeRepository.delete(existingLike.get());
			return false;
		} else {
			Diary diary = diaryService.findById(diaryId);
			User user = userService.findById(userId);

			Likes like = new Likes();
			like.setDiary(diary);
			like.setUser(user);
			likeRepository.save(like);
			return true;
		}
	}

	public boolean isLiked(Long diaryId, Long userId) {
		return likeRepository.findByDiaryIdAndUserId(diaryId, userId).isPresent();
	}

	public long getLikeCount(Long diaryId) {
		return likeRepository.countByDiaryId(diaryId);
	}
	
	public void deleteAllByDiaryId(Long diaryId) {
	    likeRepository.deleteByDiaryId(diaryId);
	}
}
