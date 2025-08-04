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
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "member_nft")
@Data
public class MemberNft {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	// 양방향 연관관계의 무한루프 방지
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "nft_metadata_id", nullable = false)
	@ToString.Exclude
	@JsonIgnore
	private NftMetadata nftMetadata;
	
	// 양방향 연관관계의 무한루프 방지
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	@ToString.Exclude
	@JsonIgnore
	private Member member;
	
	@Column(name = "token_id", nullable = false, unique = true)
	private Long  tokenId;
	
	@Column(name = "issued_at")
	private LocalDateTime issuedAt;
	
	@Column(name = "used_at")
	private LocalDateTime usedAt;
	
	@Column(name = "wallet_address")
	private String walletAddress;
	
	@Column(name = "barcode")
	private String barcode;
	
	@Column(name = "due_at")
	private LocalDateTime dueAt;
	
	@Column(name = "issued_reason")
	private String issuedReason;
	
	@Column(name = "tx_hash")
	private String txHash;
	
	@Column(name = "deleted_at")  // soft delete 컬럼
	private LocalDateTime deletedAt;
	
	@PrePersist
	public void onCreate() {
	this.issuedAt = LocalDateTime.now();
	}
    
    
}
