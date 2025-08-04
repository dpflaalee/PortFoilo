package com.ssdam.tripPaw.tripPlan.config;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TripFileUploadService {

	private final String uploadDir = "/upload/tripThumbnails/";

	public String saveImage(MultipartFile file) {
		try {
			String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
			File dest = new File(uploadDir + filename);
			file.transferTo(dest);
			return "/upload/tripThumbnails/" + filename; // 프론트에서 접근 가능한 경로로
		} catch (IOException e) {
			throw new RuntimeException("파일 업로드 실패", e);
		}
	}
	/*
	 * public String downloadAndSaveImageFromUrl(String imageUrl) { try { String ext
	 * = FilenameUtils.getExtension(new URL(imageUrl).getPath()); if (ext == null ||
	 * ext.isEmpty()) ext = "png";
	 * 
	 * String fileName = UUID.randomUUID().toString() + "." + ext; Path savePath =
	 * Paths.get("C:\\upload\\tripThumbnails\\" + fileName);
	 * Files.createDirectories(savePath.getParent());
	 * 
	 * try (InputStream in = new URL(imageUrl).openStream()) { Files.copy(in,
	 * savePath, StandardCopyOption.REPLACE_EXISTING); }
	 * 
	 * return "/thumbnails/" + fileName; } catch (Exception e) { throw new
	 * RuntimeException("썸네일 저장 실패", e); } }
	 * 
	 */

	public String downloadAndSaveImageFromUrl(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            URLConnection connection = url.openConnection();
            String contentType = connection.getContentType(); // 예: image/webp
            String ext = null;

            System.out.println("url" + url);
            System.out.println("contentType" +contentType);
            System.out.println("imageUrl" +imageUrl);
            
            // 1. Content-Type 기반 추출
            if (contentType != null && contentType.startsWith("image/")) {
                ext = contentType.substring("image/".length()); // ex: "jpeg", "webp"
            }

            // 2. URL 경로에서 추출 (예비용)
            if (ext == null || ext.isBlank()) {
                ext = FilenameUtils.getExtension(url.getPath()); // ex: jpg
            }

            // 3. 최종 기본값 보정
            if (ext == null || ext.isBlank()) {
                ext = "png";
            }

            String fileName = UUID.randomUUID().toString() + "." + ext;
            Path savePath = Paths.get("C:\\upload\\tripThumbnails\\" + fileName);
            Files.createDirectories(savePath.getParent());

            try (InputStream in = connection.getInputStream()) {
                Files.copy(in, savePath, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/thumbnails/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("썸네일 저장 실패", e);
        }
    }
	//////////////////////////////////////////////////
}