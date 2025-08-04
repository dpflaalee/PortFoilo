package com.yoonlee3.diary.goal;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface GoalRepository extends JpaRepository<Goal, Long> {
	
	// 목표 아이디로 찾기
	@Query("select g from Goal g where g.id = :goal_id")
	Goal findByGoalId(Long goal_id);
	
	// 유저의 전체 목표 가져오기
	@Query("select g from Goal g where g.user.id= :user_id")
	List<Goal> findByUserId(Long user_id);
	
	// 유저의 오늘 해야할 목표 가져오기
	@Query("select g from Goal g where g.user.id= :user_id and g.dueDate >= :date and g.startDate <= :date")
	List<Goal> findTodayGoalByUserId(Long user_id, LocalDate date);
	
	// dueDate 지난 목표들 가져오기 = 기준일 이후의 목표들 가져오기
	@Query("select g from Goal g where g.user.id= :user_id and g.dueDate >= :date")
	List<Goal> findOverGoalByUserId(Long user_id, LocalDate date);

	@Modifying
	@Transactional
	@Query("update Goal g set g.startDate = :start_date, g.dueDate= :due_date, g.goal_content= :goal_content, "
		+ "g.openScope.id = :open_scope_id where g.id = :goal_id")
	int updateByGoalId(LocalDate start_date, LocalDate due_date, String goal_content, Long open_scope_id, Long goal_id);

	@Modifying
	@Transactional
	@Query("delete from Goal g where g.id=:goal_id and g.user.id=:user_id")
	int deleteGoal(Long goal_id, Long user_id);
}
