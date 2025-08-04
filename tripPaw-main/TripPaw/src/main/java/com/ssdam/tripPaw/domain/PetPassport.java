package com.ssdam.tripPaw.domain;
//반려동물 여권

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Getter @Setter @Table(name = "pet_passport") @NoArgsConstructor
public class PetPassport {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String petName;
	@Column(nullable = false)
	private String species;
	private Integer petAge;
	private String petGender;
	private String imageUrl;
	@Column(nullable = false, unique = true)
	private String passNum;
	
	private LocalDateTime createdAt = LocalDateTime.now();
	
	@ManyToOne @JoinColumn(name = "member_id")
	private Member member;
	
	//도장연결 
	@OneToMany(mappedBy = "passport", cascade = CascadeType.ALL)
	private List<PassportSeal> passportSeals;
	
}
