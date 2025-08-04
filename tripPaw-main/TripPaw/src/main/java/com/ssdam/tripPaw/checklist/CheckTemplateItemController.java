package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.CheckTemplateItem;

import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/template-items") @RequiredArgsConstructor
public class CheckTemplateItemController {
	private final CheckTemplateItemService service;
	
    // 멤버 아이디로 조회 - 관리자용
    @GetMapping("/member/{memberId}")
    public List<CheckTemplateItem> getItemsByMemberId(@PathVariable Long memberId) {
        return service.findItemsByMemberIds(List.of(memberId));
    }

    // 전체 항목 조회
    @GetMapping
    public List<CheckTemplateItem> getAllItems() { return service.findAllItems(); }

    // 단일 항목 추가
    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody CheckTemplateItem item) {
        service.saveItem(item);
        return ResponseEntity.ok("등록 완료");
    }

    // 항목 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody CheckTemplateItem item) {
        item.setId(id);
        int result = service.updateItem(item);
        return ResponseEntity.ok(result > 0 ? "수정 완료" : "수정 실패");
    }

    // 항목 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        int result = service.deleteItem(id);
        return ResponseEntity.ok(result > 0 ? "삭제 완료" : "삭제 실패");
    }
}
