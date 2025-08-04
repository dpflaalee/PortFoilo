package com.ssdam.tripPaw.member.oauth;

import java.util.Map;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserInfoKakao implements UserInfoOauth2{
	
	private final Map<String, Object> attributes;
	
	@Override
	public String getProviderId() {
		Object id = attributes.get("id");
		return id != null ? id.toString() : null;
	}

	@SuppressWarnings({"unchecked" })
	private Map<String, Object> getAccount(){
		Object account = attributes.get("kakao_account");
		System.out.println("account 실행");
		return account instanceof Map ? (Map<String, Object>) account : null;
	};
	@SuppressWarnings({"unchecked" })
	private Map<String, Object> getProperties(){
		Object props = attributes.get("properties");
		return props instanceof Map ? (Map<String, Object>) props : null;
	};
	
	
	@Override
	public String getProvider() {
		return "kakao";
	}

	@Override
	public String getEmail() {
		Map<String,Object> account = getAccount();
		return account != null ? (String)account.get("email") : null;
	}

	@Override
	public String getNickname() {
		Map<String,Object> props = getProperties();
		return props != null ? (String)props.get("nickname") : null;
	}

	@Override
	public String getImage() {
		Map<String,Object> props = getProperties();
		String image = props != null ? (String) props.get("thumbnail_image") : null;
		return image != null ? image : "/images/thejoa.png";
	}
	
}
