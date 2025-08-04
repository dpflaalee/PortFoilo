package com.ssdam.tripPaw.review;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

    private final String uploadDir = "C:/upload/reviews"; //고정 경로

    public FileUploadService() {
        try {
            Files.createDirectories(Paths.get(uploadDir)); //디렉토리 자동 생성
        } catch (Exception e) {
            throw new RuntimeException("업로드 폴더 생성 실패", e);
        }
    }

    public String upload(MultipartFile file) {
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalFilename = Objects.requireNonNull(file.getOriginalFilename(), "파일명이 없습니다.");
            String safeFilename = UUID.randomUUID() + "_" + originalFilename;

            Path path = Paths.get(uploadDir, safeFilename);
            file.transferTo(path.toFile());

            return safeFilename; // DB에는 이 파일명만 저장
        } catch (Exception e) {
            throw new RuntimeException("리뷰 이미지 저장 실패", e);
        }
    }

    public void delete(String filename) {
        if (filename == null || filename.isBlank()) return;

        File file = new File(uploadDir, filename);
        if (file.exists()) {
            boolean deleted = file.delete();
            if (deleted) {
                System.out.println("[INFO] 리뷰 이미지 삭제 성공: " + file.getAbsolutePath());
            } else {
                System.out.println("[ERROR] 리뷰 이미지 삭제 실패");
            }
        } else {
            System.out.println("[WARN] 삭제 대상 이미지 없음: " + file.getAbsolutePath());
        }
    }

    public String extractFileNameFromUrl(String imageUrl) {
        return Paths.get(imageUrl).getFileName().toString();
    }
}
