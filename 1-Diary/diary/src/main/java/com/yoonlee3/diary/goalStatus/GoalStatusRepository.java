package com.yoonlee3.diary.goalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.yoonlee3.diary.goal.Goal;

public interface GoalStatusRepository extends JpaRepository<GoalStatus, Long> {

	@Query("select gs from GoalStatus gs where gs.goal.id=:goal_id")
	List<GoalStatus> findByGoalId(Long goal_id);

	// 오늘 성공한 목표의 수 구하기
	@Query("select count(true) from GoalStatus gs where gs.goal.id= :goal_id and gs.createDate = :currentDate and gs.is_success = true")
	int findTodaySuccess(Long goal_id, LocalDate currentDate);
	
	// 오늘 성공한 목표 구하기
	@Query("select gs from GoalStatus gs where gs.goal.id= :goal_id and gs.createDate = :currentDate and gs.is_success = true")
	GoalStatus findTodaySuccessGoal(Long goal_id, LocalDate currentDate);

	// 현재 날짜의 모든 상태 찾아오기
	@Query("select gs from GoalStatus gs where gs.createDate = :today")
	List<GoalStatus> findTodayStatus(LocalDate today);

	// 현재 날짜의 선택한 목표 상태 가져오기
	@Query("select gs from GoalStatus gs where gs.goal.id = :goal_id and gs.createDate = :today")
	Optional<GoalStatus> findTodayGoalStatus(@Param("goal_id") Long goal_id, LocalDate today);

	// 이번 달 성공한 목표의 수 구하기
	@Query("select count(true) from GoalStatus gs where gs.goal.id= :goal_id and "
			+ "gs.createDate >= :startOfMonth and gs.createDate < :startOfNextMonth and gs.is_success = true")
	int findMonthStatus(Long goal_id, LocalDate startOfMonth, LocalDate startOfNextMonth);

	// 끝난 목표의 성공 수 구하기
	@Query("select count(gs) from GoalStatus gs where gs.goal.id = :goal_id "
			+ "and gs.createDate >= :start and gs.createDate <= :end " + "and gs.is_success = true")
	int countStatusDay(@Param("goal_id") Long goal_id, @Param("start") LocalDate start, @Param("end") LocalDate end);

	// 해당 목표들의 상태들 가져오기
	@Query("select gs from GoalStatus gs where gs.goal.id= :goal_id")
	List<GoalStatus> findStatusByGoalId(Long goal_id);

	@Query("select gs from GoalStatus gs where gs.goal.id = :goal_id and gs.createDate = :date order by createDate")
	GoalStatus findByGoalIdAndDate(@Param("goal_id") Long goal_id, @Param("date") LocalDate date);

	@Modifying
	@Transactional
	@Query("update GoalStatus gs set gs.is_success= :is_success where gs.createDate= :date and gs.goal.id =:goal_id")
	int updateGoalStatus(Boolean is_success, LocalDate date, Long goal_id);

}
