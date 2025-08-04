package com.ssdam.tripPaw.badge;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssdam.tripPaw.domain.Badge;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeMapper badgeMapper;

    // 절대 경로 직접 설정
    private final String uploadDir = "C:/upload/badge";

    public void createBadge(Badge badge, MultipartFile image) {
        String imageUrl = saveImage(image);
        badge.setImageUrl(imageUrl);
        badgeMapper.insertBadge(badge);
    }

    public void updateBadge(Long id, Badge badge, MultipartFile image) {
        Badge existing = badgeMapper.findById(id);
        if (existing == null) throw new RuntimeException("뱃지를 찾을 수 없습니다.");

        if (image != null && !image.isEmpty()) {
            deleteImage(existing.getImageUrl());
            String imageUrl = saveImage(image);
            badge.setImageUrl(imageUrl);
        } else {
            badge.setImageUrl(existing.getImageUrl());
        }

        badgeMapper.updateBadge(badge);
    }

    public void deleteBadge(Long id) {
        Badge badge = badgeMapper.findById(id);
        if (badge != null) {
            deleteImage(badge.getImageUrl());
            badgeMapper.deleteBadge(id);
        }
    }

    public List<Badge> getAllBadges() {
        return badgeMapper.findAll();
    }

    private String saveImage(MultipartFile file) {
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();  // 자동 생성

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir, filename);
            file.transferTo(path.toFile());

            return filename;  // DB에 저장될 경로
        } catch (Exception e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }
    }

    private void deleteImage(String imageFileName) {
        if (imageFileName == null || imageFileName.isBlank()) {
            System.out.println("[DEBUG] 이미지 파일명이 비어 있음");
            return;
        }

        File file = new File(uploadDir, imageFileName); // 항상 badge 디렉토리에 저장됨
        System.out.println("[DEBUG] 이미지 삭제 시도 경로: " + file.getAbsolutePath());

        if (file.exists()) {
            boolean deleted = file.delete();
            if (deleted) {
                System.out.println("[INFO] 이미지 삭제 성공: " + file.getAbsolutePath());
            } else {
                System.out.println("[ERROR] 이미지 삭제 실패! 파일은 존재함");
            }
        } else {
            System.out.println("[WARN] 삭제할 이미지 파일이 존재하지 않음: " + file.getAbsolutePath());
        }
    }

}
