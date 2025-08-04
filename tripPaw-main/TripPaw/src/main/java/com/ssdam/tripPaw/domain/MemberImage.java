package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member_image") // DB 테이블명과 맞추기
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberImage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "src")
	private String src;
	
	@Column(name = "create_at", nullable = true)
	private LocalDateTime createAt;
	@Column(name = "update_at", nullable = true)
	private LocalDateTime updateAt;
	
	@ManyToOne
	@JoinColumn(name = "member_id")  
	private Member member;
	
}
