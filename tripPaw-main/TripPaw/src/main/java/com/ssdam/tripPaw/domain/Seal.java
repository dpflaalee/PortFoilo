package com.ssdam.tripPaw.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Getter @Setter @NoArgsConstructor
public class Seal { 
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String name;
	private String imageUrl;
	
	//장소연결
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "placetype_id", nullable = false)
	private PlaceType placeType;
	
	//여권-도장 연결
	@OneToMany(mappedBy = "seal", cascade = CascadeType.ALL,  orphanRemoval = true)
	private List<PassportSeal> PassportSeals = new ArrayList<>();
	
}
