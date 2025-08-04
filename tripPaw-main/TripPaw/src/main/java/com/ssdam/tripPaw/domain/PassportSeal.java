package com.ssdam.tripPaw.domain;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Getter @Setter @NoArgsConstructor
public class PassportSeal {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	//여권 연결
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "passport_id")
	private PetPassport  passport;
	
	//도장 연결
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "seal_id")
	private Seal seal;
	
	//리뷰 연결
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "review_id", nullable = false)
	private Review review;
	
}
