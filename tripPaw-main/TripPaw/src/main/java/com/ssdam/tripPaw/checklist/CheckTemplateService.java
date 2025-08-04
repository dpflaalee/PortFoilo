package com.ssdam.tripPaw.checklist;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.CheckTemplate;
import com.ssdam.tripPaw.domain.CheckTemplateItem;

@Service
public class CheckTemplateService {
	@Autowired
	private CheckTemplateMapper checkTemplateMapper;
	@Autowired
	private CheckTemplateItemMapper checkTemplateItemMapper;

	// 1. 템플릿 전체목록조회
	public List<CheckTemplate> getAllTemplates() {
		return checkTemplateMapper.selectAllTemplates();	}

	// 2. 템플릿 상세 조회 (항목 포함)
	public CheckTemplate getTemplateWithItems(Long templateId) {
		return checkTemplateMapper.selectTemplateWithItems(templateId);	}

	// 3. 템플릿 생성 (선택된 기존 항목들을 복사해서 연결)
	@Transactional
	public void createTemplate(CheckTemplate template, List<Long> selectedItemIds) {
	    checkTemplateMapper.insertTemplate(template);  // 템플릿 저장 (id 생성됨)

	    if (selectedItemIds != null && !selectedItemIds.isEmpty()) {
	        List<CheckTemplateItem> items = checkTemplateItemMapper.selectItemsByIds(selectedItemIds);

	        // 복사본으로 새 템플릿에 할당
	        List<CheckTemplateItem> copiedItems = items.stream().map(original -> {
	            CheckTemplateItem item = new CheckTemplateItem();
	            item.setContent(original.getContent());
	            item.setChecktemplateId(template.getId()); // mybatis용
	            item.setCheckTemplate(template);           // JPA용
	            return item;
	        }).collect(Collectors.toList());

	        checkTemplateItemMapper.insertTemplateItems(copiedItems);
	    }
	}

	// 4. 템플릿 수정
	public void updateTemplate(CheckTemplate template, List<Long> selectedItemIds) {
		// 템플릿 수정
		checkTemplateMapper.updateTemplate(template);

		// 기존 항목 삭제
		checkTemplateMapper.deleteTemplateItemsByTemplateId(template.getId());

		// 기존 항목들 조회 → 복사
		List<CheckTemplateItem> originalItems = checkTemplateItemMapper.selectItemsByIds(selectedItemIds);

		List<CheckTemplateItem> copiedItems = new ArrayList<>();
		for (CheckTemplateItem original : originalItems) {
			CheckTemplateItem copy = new CheckTemplateItem();
			copy.setContent(original.getContent());
			copy.setChecktemplateId(template.getId());
			copiedItems.add(copy);
		}

		// 삽입
		if (!copiedItems.isEmpty()) { checkTemplateItemMapper.insertTemplateItems(copiedItems);	}
	}

	// 5. 템플릿 삭제
	public void deleteTemplate(Long templateId) {
		checkTemplateMapper.deleteTemplateItemsByTemplateId(templateId);
		checkTemplateMapper.deleteTemplateById(templateId);
	}
}
