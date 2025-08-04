package com.ssdam.tripPaw.review;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.ReviewType;

@Mapper
public interface ReviewTypeMapper {
	ReviewType findById(Long id);
	
	//더미데이터 삽입용 코드. 
	@Insert("INSERT INTO review_type (target_type) VALUES (#{targetType})")
	@Options(useGeneratedKeys = true, keyProperty = "id")
	void insertReviewType(ReviewType reviewType);
	
	void insertReviewTypes();
}
