package com.ssdam.tripPaw.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "Chat") // DB 테이블명과 맞추기
@Data
@Builder
public class Chat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, length = 255)
	private String content;
	
	@Column(nullable = false, length = 255)
	private String contentType;
	
	private LocalDateTime sentAt = LocalDateTime.now();
	
	@ManyToOne(fetch = FetchType.LAZY) 
    	@JoinColumn(name = "sender_id", nullable = false)
    	private Member sender;
	 
	@ManyToOne
	@JoinColumn(name = "chatRoom_id")
	private ChatRoom chatRoom;
}
