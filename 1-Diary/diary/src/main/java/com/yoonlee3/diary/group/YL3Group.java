package com.yoonlee3.diary.group;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.yoonlee3.diary.badge.Badge;
import com.yoonlee3.diary.groupDiary.GroupDiary;
import com.yoonlee3.diary.user.User;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class YL3Group {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "group_id")
	private Long id;

	@Column(unique = true, nullable = false)
	private String group_title;

	@Column(nullable = false)
	private String group_content;

	@Column(updatable = false)
	private LocalDateTime create_date = LocalDateTime.now();

	@ManyToOne
	@JoinColumn(name = "group_leader", nullable = true)
	private User group_leader;

	@OneToOne
	@JoinColumn(name = "badge_id")
	private Badge badge;

	@ManyToMany
	@JoinTable(name = "Group_has_User",
			joinColumns = @JoinColumn(name = "group_id"),
			inverseJoinColumns = @JoinColumn(name = "user_id")
	)
	@JsonManagedReference
	private List<User> users = new ArrayList<>();

	@OneToMany(mappedBy = "group", cascade = CascadeType.REMOVE)
	@JsonIgnore
	private List<GroupDiary> groupDiaries;

	// 교환일기 순서 정하기
	@Column(name = "current_turn")
	private int currentTurn;

	@Column
	private LocalDate lastTurnDate;
}
