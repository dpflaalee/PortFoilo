package com.yoonlee3.diary.goal;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yoonlee3.diary.goalStatus.GoalSatusService;
import com.yoonlee3.diary.openScope.OpenScope;
import com.yoonlee3.diary.user.User;

@Service
public class GoalService {

	@Autowired
	GoalRepository goalRepository;
	@Autowired
	GoalSatusService goalSatusService;
	
	public Goal insertGoal(Goal goal, User user) {
		goal.setUser(user);
		return goalRepository.save(goal);
	}

	// goal id로 목표 가져오기
	public Goal findByGoalId(Long goal_id) {
		return goalRepository.findByGoalId(goal_id);
	}

	// 유저의 goal리스트 가져오기
	public List<Goal> findByUserId(User user) {
		return goalRepository.findByUserId(user.getId());
	}

	// 유저의 오늘의 목표 리스트 가져오기
	public List<Goal> findTodayGoalByUserId(User user, LocalDate today) {
		return goalRepository.findTodayGoalByUserId(user.getId(), today);
	}

	// 유저의 기준일 이후의 목표들 가져오기
	public List<Goal> findOverGoalByUserId(User user, LocalDate today) {
		return goalRepository.findOverGoalByUserId(user.getId(), today);
	}

	public int updateGoal(Goal goal) {
		return goalRepository.updateByGoalId(goal.getStartDate(), goal.getDueDate(), goal.getGoal_content(),
				goal.getOpenScope().getId(), goal.getId());
	}

	public int deleteGoal(Goal goal, Long user_id) {
		goalSatusService.deleteStatusByGoal(goal);
		return goalRepository.deleteGoal(goal.getId(), user_id);
	}

}
