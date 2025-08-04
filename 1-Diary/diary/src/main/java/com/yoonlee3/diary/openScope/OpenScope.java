package com.yoonlee3.diary.openScope;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OpenScope {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "open_scope_id")
	private Long id;

	@Column(nullable = false)
	private String openScope_title;
	
	@Column(nullable = false)
    	private String openScope_value;

}
