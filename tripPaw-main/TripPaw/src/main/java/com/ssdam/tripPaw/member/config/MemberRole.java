package com.ssdam.tripPaw.member.config;

public enum MemberRole {
	
	ADMIN("ROLE_ADMIN"), 
	SYSTEM("ROLE_SYSTEM"),
	MEMBER("ROLE_MEMBER");
	private String value;

	private MemberRole(String value) {
		this.value = value;
	}
	
}
