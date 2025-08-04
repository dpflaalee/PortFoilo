package com.yoonlee3.diary.diary;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yoonlee3.diary.like.LikeRepository;

@Service
public class DiaryService {
	@Autowired DiaryRepository diaryRepository;
	@Autowired LikeRepository likeRepository;
	
	public List<Diary> findAll() { 
	    return diaryRepository.findAllByOrderByDesc(); 
	} 
	
	public List<Diary> findByEmail(String email) {
	    List<Diary> diaries = diaryRepository.findByUserEmail(email);
	    return diaries;
	}
	
	@Transactional
	public Diary findById(Long diary_id) {
		Diary diary = diaryRepository.findById(diary_id).get();
		return diary;
	}
	
	@Transactional
	public List<Diary> findByUserId(Long user_id) {
		return diaryRepository.findByUserId(user_id);
	}
	
	public Diary insert(Diary diary) {
		return diaryRepository.save(diary);
	}
	
	public Diary update_view(Long id) {
		return diaryRepository.findById(id).get(); 
	}
	
	public int update(Diary diary) {
		return diaryRepository.updateById(
			diary.getId(),diary.getDiary_title(),diary.getDiary_content(), diary.getDiary_emoji()
		);
	}
	
	public int delete(Diary diary) { 
		likeRepository.deleteByDiaryId(diary.getId());
		return diaryRepository.deleteByDId(diary.getId());
	}
	
	public List<Diary> getDiarySortedByLikes(){
		return diaryRepository.findByDiaryOrderByLikes();
	}

}
