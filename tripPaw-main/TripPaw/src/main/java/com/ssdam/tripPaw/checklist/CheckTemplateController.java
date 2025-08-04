package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.CheckTemplate;
import com.ssdam.tripPaw.domain.CheckTemplateItem;

import lombok.RequiredArgsConstructor;

@RestController @RequiredArgsConstructor @RequestMapping("/api/check-templates")
public class CheckTemplateController {
	   private final CheckTemplateService checkTemplateService;
	   private final CheckTemplateItemService checkTemplateItemService;

	    // 1.템플릿 전체 조회
	    @GetMapping
	    public List<CheckTemplate> getAllTemplates() {
	        return checkTemplateService.getAllTemplates();
	    }

	    // 2.템플릿 상세 조회 (항목 포함)
	    @GetMapping("/{id}")
	    public CheckTemplate getTemplateWithItems(@PathVariable Long id) {
	        return checkTemplateService.getTemplateWithItems(id);
	    }

	    // 3. 아이템 전체 항목 조회 (템플릿 생성 시 선택용)
	    @GetMapping("/items/all")
	    public List<CheckTemplateItem> findAllItems() {
	        return checkTemplateItemService.findAllItems();	    }

	    // 3-1. 템플릿 생성
	    @PostMapping
	    public ResponseEntity<Void> createTemplate(@RequestBody CreateTemplateDTO dto) {
	        checkTemplateService.createTemplate(dto.toEntity(), dto.getSelectedItemIds());
	        return ResponseEntity.status(HttpStatus.CREATED).build();
	    }

	    // 4. 템플릿 수정
	    @PutMapping("/{id}")
	    public ResponseEntity<Void> updateTemplate(@PathVariable Long id, @RequestBody CreateTemplateDTO dto) {
	        CheckTemplate template = dto.toEntity();
	        template.setId(id);
	        checkTemplateService.updateTemplate(template, dto.getSelectedItemIds());
	        return ResponseEntity.ok().build();
	    }

	    // 5. 템플릿 삭제
	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
	        checkTemplateService.deleteTemplate(id);
	        return ResponseEntity.noContent().build();
	    }
}
