package com.yoonlee3.diary.groupDiary;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yoonlee3.diary.diary.Diary;
import com.yoonlee3.diary.diary.DiaryService;
import com.yoonlee3.diary.group.YL3Group;

@Service
public class GroupDiaryService {
	
	@Autowired GroupDiaryRepository groupDiaryRepository;
	@Autowired DiaryService diaryService;
	
	public List<GroupDiary> findByGroupId(YL3Group group) {
		return groupDiaryRepository.findByGroupId(group.getId());
	}
	
	public GroupDiary insertGroupDiary(YL3Group group, Diary diary ) {
		GroupDiary groupDiary = new GroupDiary();
		groupDiary.setGroup(group);
		groupDiary.setDiary(diary);
		return groupDiaryRepository.save(groupDiary);
	}
	
	public GroupDiary findByDiaryId(Diary diary) {
		return groupDiaryRepository.findByDiaryId(diary.getId());
	}
	
	public int deleteGroupDiary(GroupDiary groupDiary) {
		return groupDiaryRepository.deleteGroupDiary(groupDiary.getId());
	}

	public void deleteByDiary(Diary diary) {
	    GroupDiary groupDiary = groupDiaryRepository.findByDiary(diary);
	    if (groupDiary != null) {
	        groupDiaryRepository.delete(groupDiary);
	    }
	}
	
}
