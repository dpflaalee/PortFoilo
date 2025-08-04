package com.yoonlee3.diary.badge;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.ColumnDefault;

import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class Badge {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="badge_id")
	private Long id;
	
	@Column(nullable=false)
	@ColumnDefault("1")
	private String badge_title;
	
}
