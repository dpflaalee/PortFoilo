package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.CheckTemplate;
import com.ssdam.tripPaw.domain.CheckTemplateItem;

@Mapper
public interface CheckTemplateMapper {
	
    //템플릿 생성
    void insertTemplate(CheckTemplate template);
    int countTemplates();  // 데이터 중복 방지용
    
    //템플릿 목록조회
    List<CheckTemplate> selectAllTemplates();
    
    //템플릿 상세조회
    CheckTemplate selectTemplateWithItems(@Param("id") Long id);
    
    //템플릿 수정
    int updateTemplate(CheckTemplate template);
    
    //항목 삭제 - 삭제 후 재등록 가능
    int deleteTemplateItemsByTemplateId(@Param("checktemplateId") Long checktemplateId);
    
    //템플릿 삭제 - 항목 삭제 O
    int deleteTemplateById(@Param("id") Long id);

}
