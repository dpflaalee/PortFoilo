package com.ssdam.tripPaw.petpass.seal;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssdam.tripPaw.review.FileUploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seal-uploads")
public class SealUploadController {
	private final FileUploadService fileUploadService;

    @Value("${file.upload.seals-subdir}")
    private String sealFolder;

    @PostMapping("/image")
    public ResponseEntity<String> uploadSealImage(@RequestParam("file") MultipartFile file) {
    	System.out.println("[DEBUG] sealFolder 값: [" + sealFolder + "]");
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일이 비어 있습니다.");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일명이 유효하지 않습니다.");
            }

            String safeFilename = UUID.randomUUID() + "_" + Paths.get(originalFilename).getFileName().toString();

            Path targetDir = Paths.get("C:/upload").resolve(sealFolder.trim()).normalize();
            Files.createDirectories(targetDir);

            Path destinationFile = targetDir.resolve(safeFilename);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return ResponseEntity.ok("/uploads/" + sealFolder.trim() + "/" + safeFilename);

        } catch (Exception e) {
            e.printStackTrace(); // or use log.error("...", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("이미지 업로드 실패: " + e.getMessage());
        }
    }
}
