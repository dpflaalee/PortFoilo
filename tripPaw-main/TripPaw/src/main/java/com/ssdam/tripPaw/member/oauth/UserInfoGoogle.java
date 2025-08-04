package com.ssdam.tripPaw.member.oauth;
import java.util.Map;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserInfoGoogle implements UserInfoOauth2{
	
	private final Map<String, Object> attributes;
	
	@Override
	public String getProviderId() {
		Object value = attributes.get("sub");
		
		return value != null ? value.toString() : null;
	}

	@Override
	public String getProvider() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getEmail() {
		return (String)attributes.get("email");
	}

	@Override
	public String getNickname() {
		// TODO Auto-generated method stub
		return (String)attributes.get("name");
	}

	@Override
	public String getImage() {
		Object pic =  (String)attributes.get("picture");
		return pic != null ? pic.toString() : "/images/thejoa.png";
	}
	
}
