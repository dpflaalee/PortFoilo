package com.yoonlee3.diary.like;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.yoonlee3.diary.diary.Diary;
import com.yoonlee3.diary.user.User;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@IdClass(LikesId.class)
public class Likes {
	
	@Id
	@ManyToOne
	@JoinColumn(name = "diary_id")
	private Diary diary;

	@Id
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@Column(updatable = false)
	private LocalDateTime createDate = LocalDateTime.now();
	
}
