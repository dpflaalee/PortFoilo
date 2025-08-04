package com.ssdam.tripPaw.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.ssdam.tripPaw.reserv.ReservState;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class Reserv {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private LocalDate startDate;
	private LocalDate endDate;
	private LocalDate expireAt;
	private LocalDate deleteAt;
	
	@Enumerated(EnumType.STRING)
	private ReservState state = ReservState.WAITING;
	
	private LocalDateTime createdAt = LocalDateTime.now();
	
	private int originalPrice = 0;
	private int finalPrice = 0;
	private int countPeople;
	private int countPet;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pay_id") // 외래키 이름 (nullable 허용 가능)
	private Pay pay;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "place_id", nullable = false)
	private Place place;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "memberTripPlan_id", nullable = true)
	private MemberTripPlan memberTripPlan;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tripPlan_id", nullable = true)
	private TripPlan tripPlan;
	
	public Long getTripPlanId() {
	return tripPlan != null ? tripPlan.getId() : null;
	}
}
