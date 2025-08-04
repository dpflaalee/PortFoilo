package com.yoonlee3.diary.groupDiary;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yoonlee3.diary.diary.Diary;
import com.yoonlee3.diary.group.YL3Group;

import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class GroupDiary {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "group_id")
	@JsonIgnore
	private YL3Group group;
	
	@ManyToOne
	@JoinColumn(name = "diary_id")
	@JsonIgnore
	private Diary diary;

}
