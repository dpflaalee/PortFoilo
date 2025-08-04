package com.ssdam.tripPaw.badge;

import com.ssdam.tripPaw.domain.Badge;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/badge")
public class BadgeController {

    private final BadgeService badgeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createBadge(
            @RequestPart("badge") Badge badge,
            @RequestPart("image") MultipartFile image) {

        badgeService.createBadge(badge, image);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateBadge(
            @PathVariable Long id,
            @RequestPart("badge") Badge badge,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        badge.setId(id);
        badgeService.updateBadge(id, badge, image);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBadge(@PathVariable Long id) {
        badgeService.deleteBadge(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Badge>> getAll() {
        return ResponseEntity.ok(badgeService.getAllBadges());
    }
}
