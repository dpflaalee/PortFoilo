package com.ssdam.tripPaw.member.oauth;

import java.util.Map;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserInfoNaver implements UserInfoOauth2{
	
	private final Map<String, Object> attributes;
	private Map<String, Object> getResponse(){
		Object response = attributes.get("reponse");
		return response instanceof Map ? (Map<String, Object>) response : null; 
	}
	@Override
	public String getProviderId() {
		Map<String, Object> response = getResponse();
		return response != null ? String.valueOf(response.get("id")) : null;
	}

	@Override
	public String getProvider() {
		return "naver";
	}

	@Override
	public String getEmail() {
		Map<String, Object> response = getResponse();
		
		return response != null ? String.valueOf(response.get("email")) : null;
	}

	@Override
	public String getNickname() {
		Map<String, Object> response = getResponse();
		return response != null ? String.valueOf(response.get("nickname")) : null;
	}

	@Override
	public String getImage() {
		Map<String,Object> props = getResponse();
		String image = props != null ? (String) props.get("profile_image") : null;
		return image != null ? image : "/images/thejoa.png";
	}
	
}

