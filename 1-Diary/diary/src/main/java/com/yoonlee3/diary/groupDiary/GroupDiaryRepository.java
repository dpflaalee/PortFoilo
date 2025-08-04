package com.yoonlee3.diary.groupDiary;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.yoonlee3.diary.diary.Diary;

public interface GroupDiaryRepository extends JpaRepository<GroupDiary, Long> {

	GroupDiary findByDiary(Diary diary);
	
	@Query("select gd from GroupDiary gd where gd.group.id = :group_id ORDER BY gd.diary.create_date DESC")
	List<GroupDiary> findByGroupId(Long group_id);
	
	@Query("select gd from GroupDiary gd where gd.diary.id = :diary_id")
	GroupDiary findByDiaryId(Long diary_id);
	
	@Modifying
	@Transactional
	@Query("delete from GroupDiary gd where gd.id = :groupDiry_id")
	int deleteGroupDiary(Long groupDiry_id);

}
