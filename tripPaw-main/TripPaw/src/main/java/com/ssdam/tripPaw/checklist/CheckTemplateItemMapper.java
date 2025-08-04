package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.CheckTemplateItem;

@Mapper
public interface CheckTemplateItemMapper {
	
    //단일항목생성
    void insertTemplateItem(CheckTemplateItem item);
    
    //여러항목조회
    List<CheckTemplateItem> selectItemsByIds(@Param("ids") List<Long> ids);
    
    //전체항목조회
    List<CheckTemplateItem> selectAllItems();
    
    //멤버 아이디로 조회 - 관리자용
    List<CheckTemplateItem> selectItemsByMemberIds(@Param("memberIds") List<Long> memberIds);
        
    //다중삽입 bulk insert
    int insertTemplateItems(@Param("items") List<CheckTemplateItem> items);
    
    //단일항목수정
    int updateTemplateItem(CheckTemplateItem item);
    
    //단일항목 삭제
    int deleteItemById(@Param("id") Long id);
    
    List<CheckTemplateItem> selectItemsByTemplateId(Long templateId);
    
}
