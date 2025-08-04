package com.yoonlee3.diary.userAchiv;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserAchivRepository extends JpaRepository<UserAchiv, Long> {

	@Query("select ua from UserAchiv ua where ua.goal.id = :goal_id")
	UserAchiv findByGoalId(Long goal_id);

}
