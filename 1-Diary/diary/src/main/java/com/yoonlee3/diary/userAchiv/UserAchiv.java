package com.yoonlee3.diary.userAchiv;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;

import com.yoonlee3.diary.goal.Goal;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserAchiv {

	@Id
	private Long id;

	@OneToOne(cascade = CascadeType.REMOVE)
	@JoinColumn(name = "goal_id")
	@MapsId
	private Goal goal;

	@Column(nullable = false)
	private Double completionRate;

}
