package com.yoonlee3.diary.user;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserForm {
	@NotEmpty(message="이메일는 필수 항목입니다.")
	@Size(min=4, max=20)
	private String email;

	@NotEmpty(message="비밀번호는 필수 항목입니다.")
	private String password;
	
	@NotEmpty(message="비밀번호 확인은 필수 항목입니다.")
	private String password2;

	@NotEmpty(message="닉네임은 필수 항목입니다.")
	private String username;
}
