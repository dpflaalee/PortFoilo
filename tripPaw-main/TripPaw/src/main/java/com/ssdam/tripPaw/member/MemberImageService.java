package com.ssdam.tripPaw.member;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.domain.MemberImage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberImageService {
	private final MemberImageMapper imageMapper;
	
	public int insertMemberImage(Member member) {
		System.out.println("insert="+member.getId());
		MemberImage memberImage = MemberImage.builder()
											.src("")
											.member(member)
											.createAt(LocalDateTime.now())
											.build();
		return imageMapper.insertMemberImage(memberImage); 
	}
	
	public int updateMemberImage(String src, Member member) {
		MemberImage memberImage = MemberImage.builder()
											.src(src)
											.member(member)
											.updateAt(LocalDateTime.now())
											.build();
		return imageMapper.updateMemberImage(memberImage);
	}

	public MemberImage selectMemberImage(Long id) {
		return imageMapper.selectMemberImage(id);
	}
}
