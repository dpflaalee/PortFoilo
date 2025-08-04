package com.ssdam.tripPaw.member;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.MemberImage;

@Mapper
public interface MemberImageMapper {
	public MemberImage selectMemberImage(Long id);
	public int insertMemberImage(MemberImage memberImage);
	public int updateMemberImage(MemberImage memberImage);
}
