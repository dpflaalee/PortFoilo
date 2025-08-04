package com.ssdam.tripPaw.member.config;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemberLoginForm {
	@NotEmpty(message="아이디는 필수 항목입니다.")
	@Size(min=4, max=30)
	private String username;
	@NotEmpty(message="비밀번호는 필수 항목입니다.")
	private String password;
}
