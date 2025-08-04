package com.yoonlee3.diary.user;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.yoonlee3.diary.diary.Diary;
import com.yoonlee3.diary.follow.Block;
import com.yoonlee3.diary.follow.Follow;
import com.yoonlee3.diary.group.YL3Group;
import com.yoonlee3.diary.like.Likes;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	@Column(unique = true, nullable = false)
	private String username;
	@Column(nullable = false)
	private String password;

	private String nickname;
	private String profileImageUrl;
	private String resetToken;

	@Column(unique = true, nullable = false)
	private String email;

	@Column(updatable = false, nullable = false)
	private LocalDateTime create_date = LocalDateTime.now();

	@ManyToMany(mappedBy = "users")
	@JsonBackReference
	private List<YL3Group> groups = new ArrayList<>();
	
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference
    private List<Diary> diaries;
	
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Likes> likes;
    
	@OneToMany(mappedBy = "follower", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Follow> followers = new ArrayList<>();

    @OneToMany(mappedBy = "following", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Follow> followings  = new ArrayList<>();

    @OneToMany(mappedBy = "blocker", cascade = CascadeType.REMOVE, orphanRemoval = true) 
    private Set<Block> blockedUsers = new HashSet<>();


}
