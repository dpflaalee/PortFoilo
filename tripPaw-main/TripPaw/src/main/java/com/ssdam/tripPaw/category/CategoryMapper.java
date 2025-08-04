package com.ssdam.tripPaw.category;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Category;

@Mapper
public interface CategoryMapper {
	
	// insert
    public int insert(Category category);
    
    // select
    public List<Category> findAll();
    public Category findById(Long id);
    public Category findByName(String name);
    
    // update
    public int updateById(Long id);

	public int count();

	public int countCategories();
    
}