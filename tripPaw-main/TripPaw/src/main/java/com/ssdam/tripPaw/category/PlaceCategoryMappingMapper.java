package com.ssdam.tripPaw.category;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ssdam.tripPaw.domain.Category;

@Mapper
public interface PlaceCategoryMappingMapper {
	
    void insertMapping(@Param("placeId") Long placeId, @Param("categoryId") Long categoryId);

    boolean existsMapping(@Param("placeId") Long placeId, @Param("categoryId") Long categoryId);

    List<Category> findCategoriesByPlaceId(@Param("placeId") Long placeId);

	List<Long> findCategoryIdsByPlaceTypeId(Long id);
}