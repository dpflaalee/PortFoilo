package com.ssdam.tripPaw.member.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.MemberImageService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FileUploadUtil {
	private final MemberImageService memberImageService; 

	@Value("${file.upload.dir}")
	private String uploadDir;

	public String fileUpload(MultipartFile file,Member member) {
		if(file.isEmpty()) {
			return "업로드할 파일을 선택해주세요.";
		}
		try {
			File directory = new File(uploadDir+File.separator+"memberImg");
			if(!directory.exists()) {
				directory.mkdirs();
			}
			String originalFileName = file.getOriginalFilename();
			String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
			String savedFileName = UUID.randomUUID().toString() + extension;
			
			Path path = Paths.get(directory + File.separator + savedFileName);
			file.transferTo(path.toFile());
			int num = memberImageService.updateMemberImage(savedFileName,member);
			return path.getFileName().toString();
		}catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException("파일 저장 실패", e);
		}
	}
}
