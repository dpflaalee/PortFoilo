package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.CheckTemplateItem;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class CheckTemplateItemService {
	
    private final CheckTemplateItemMapper mapper;
	
    // 0. 멤버 아이디로 조회 - 관리자용
    public List<CheckTemplateItem> findItemsByMemberIds(List<Long> memberIds) {
	return mapper.selectItemsByMemberIds(memberIds);	}

    // 1. 전체 조회
    public List<CheckTemplateItem> findAllItems() {
        return mapper.selectAllItems();    }

    // 2. 단일 삽입
    public void saveItem(CheckTemplateItem item) {
        mapper.insertTemplateItem(item);    }

    // 3. 단일 수정
    public int updateItem(CheckTemplateItem item) {
        return mapper.updateTemplateItem(item);    }

    // 4. 단일 삭제
    public int deleteItem(Long id) {
        return mapper.deleteItemById(id);    }

    // 5. ID 목록으로 항목 조회
    public List<CheckTemplateItem> findItemsByIds(List<Long> ids) {
        return mapper.selectItemsByIds(ids);    }

}
