package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import com.ssdam.tripPaw.pay.PayState;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Pay {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "imp_uid", unique=true)
	private String impUid;         // 아임포트 결제 ID
	@Column(name = "merchant_uid",unique=true)
	private String merchantUid;    // 가맹점 주문번호
	
	private int amount;
	private String payMethod;
	
	@Column(name = "pg_provider")
	private String pgProvider;
	
	@Enumerated(EnumType.STRING)
	private PayState state;
	private LocalDateTime paidAt;
	private LocalDateTime deleteAt;
	private LocalDateTime createdAt = LocalDateTime.now();
	
	@Column(name = "is_group")
	private Boolean isGroup; 
	@Column(name = "group_id")
	private Long groupId;
	private boolean haspayShare;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reserv_id", nullable = true)
	private Reserv reserv;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

}
