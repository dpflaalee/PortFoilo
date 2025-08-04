package com.ssdam.tripPaw.chatting.chat;
import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Chat;


@Mapper
public interface ChatMapper {
	public int chatSave(Chat chat);
}
