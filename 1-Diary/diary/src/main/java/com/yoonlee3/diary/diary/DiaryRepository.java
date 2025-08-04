package com.yoonlee3.diary.diary;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yoonlee3.diary.user.User;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

	@Query("select d from Diary d order by d.id desc")
	List<Diary> findAllByOrderByDesc();

	@Query("select d from Diary d where d.user.id = :user_id")
	List<Diary> findByUserId(Long user_id);
	
    	@Query("SELECT d FROM Diary d WHERE d.user.email = :email ORDER BY d.create_date DESC")
    	List<Diary> findByUserEmail(@Param("email") String email);
	
	@Modifying
	@Transactional
	@Query("update Diary d set d.diary_title= :diary_title, d.diary_content= :diary_content, d.diary_emoji= :diary_emoji where d.id= :id")
	int updateById(@Param("id") Long id, String diary_title, String diary_content, String diary_emoji);
	
	@Modifying
	@Transactional
	@Query("delete from Diary d where d.id= :id")
	int deleteByDId(Long id);
	
	long countByUser(User currentUser);
	
	// 좋아요
	@Query("select d ,  count(l)  as likeCount "
		+ "from Diary d left join Likes l on d.id = l.diary.id  "
		+ "group by d  "
		+ "order by likeCount desc")
	List<Diary> findByDiaryOrderByLikes();

	
}
