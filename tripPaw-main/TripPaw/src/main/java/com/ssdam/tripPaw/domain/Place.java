package com.ssdam.tripPaw.domain;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import lombok.Data;

@Entity
@Table(
	    name = "place",
	    uniqueConstraints = {
	        @UniqueConstraint(columnNames = {"latitude", "longitude"})
	    }
	)
@Data
public class Place {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	@Lob
	private String description;
	private String latitude;
	private String longitude;
	private String region;
	private String openHours;
	private boolean petFriendly;
	private boolean petVerified;
	private String restDays;
	@Column(length=2000)
	private String price;
	private String parking;
	private String phone;
	private String imageUrl;
	private String homePage;
	private Long externalContentId;
	private String source;
	
	@ManyToOne
	@JoinColumn(name = "place_type_id")
	private PlaceType placeType;
	
	@OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PlaceImage> placeImages = new ArrayList<>();
	
	@ManyToMany
	@JoinTable(
	name = "place_category",
	joinColumns = @JoinColumn(name = "place_id"),
	inverseJoinColumns = @JoinColumn(name = "category_id")
	)
	private List<Category> categories = new ArrayList<>();
	
	@OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<RoutePlace> routePlaces;
	
	/// 테이블 영향 없음
	@Transient
	private Double avgRating;
	
	@Transient
	private Long reviewCount;
	
	@Transient
	private List<Review> reviews;
}

