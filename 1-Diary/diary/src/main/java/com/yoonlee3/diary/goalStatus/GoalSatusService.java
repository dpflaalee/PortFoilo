package com.yoonlee3.diary.goalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yoonlee3.diary.goal.Goal;
import com.yoonlee3.diary.goal.GoalRepository;
import com.yoonlee3.diary.openScope.OpenScope;
import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.userAchiv.UserAchivRepository;

@Service
public class GoalSatusService {

	@Autowired GoalStatusRepository goalStatusRepository;
	@Autowired GoalRepository goalRepository;

	public GoalStatus insertGoalStatus(GoalStatus goalStatus, LocalDate today) {
		return goalStatusRepository.save(goalStatus);
	}
	
	// 유저의 목표 리스트 가져오기
	public List<GoalStatus> selectGoal(Goal goal) {
		return goalStatusRepository.findByGoalId(goal.getId());
	}

	// 해당목표의 상태들 가져오기
	public List<GoalStatus> findByGoalId(Goal goal) {
		return goalStatusRepository.findStatusByGoalId(goal.getId());
	}

	// 오늘 성공한 목표의 수 구하기
	public int findTodaySuccess(Goal goal, LocalDate today) {
		System.out.println("여기는 GoalStatusService.....현재 날짜는.......................?" + today);
		return goalStatusRepository.findTodaySuccess(goal.getId(), today);
	}
	
	// 오늘 성공한 목표구하기
	public GoalStatus findTodaySuccessGoal(Goal goal, LocalDate today) {
		System.out.println("여기는 GoalStatusService.....현재 날짜는.......................?" + today);
		return goalStatusRepository.findTodaySuccessGoal(goal.getId(), today);
	}

	// 현재 달의 목표 상태들 가져오기
	public int countStatusMonth(Goal goal) {

		LocalDate today = LocalDate.now();
		LocalDate startOfMonth = today.withDayOfMonth(1);
		LocalDate startOfNextMonth = startOfMonth.plusMonths(1);

		return goalStatusRepository.findMonthStatus(goal.getId(), startOfMonth, startOfNextMonth);
	}
	// 기간 내의 목표 상태들 가져오기
	public int countStatusDay(Goal goal, LocalDate start, LocalDate end) {
		return goalStatusRepository.countStatusDay( goal.getId(), start, end );
	}

	public Optional<GoalStatus> findStatusById(Goal goal) {
		return goalStatusRepository.findById(goal.getId());
	}

	// 현재 날짜의 상태 찾아오기
	public Optional<GoalStatus> findTodayGoalStatus(Goal goal, LocalDate today) {
		return goalStatusRepository.findTodayGoalStatus(goal.getId(), today);
	}

	public List<GoalStatus> findTodayStatus(LocalDate today) {
		return goalStatusRepository.findTodayStatus(today);
	}

	public int updateGoalStatus(GoalStatus goalStatus, LocalDate date, Goal goal) {
		return goalStatusRepository.updateGoalStatus(goalStatus.getIs_success(), date, goal.getId());
	}

	public void deleteStatusByGoal(Goal goal) {
		List<GoalStatus> goalStatuses = goalStatusRepository.findByGoalId(goal.getId());
		goalStatusRepository.deleteAll(goalStatuses);
	}

	public GoalStatus findByGoalIdAndDate(Long goalId, LocalDate date) {
		return goalStatusRepository.findByGoalIdAndDate(goalId, date);
	}
}
