package com.ssdam.tripPaw.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.ReviewImage;

@Mapper
public interface ReviewImageMapper {
	void insertReviewImage(ReviewImage reviewImage);
	
	void deleteImagesByReviewId(@Param("reviewId") Long reviewId);
	
	List<String> findImageUrlsByReviewId(@Param("reviewId") Long reviewId);
}
