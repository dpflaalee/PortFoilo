package com.ssdam.tripPaw.category;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Category;

@Service
public class CategoryService {
	
    @Autowired CategoryMapper categoryMapper;
	
    // insert
    public int insert(Category category) {
	return categoryMapper.insert(category);
    };
    
    // select
    public List<Category> findAll() {
    	return categoryMapper.findAll();
    };
    public Category findById(Long id) {
    	return categoryMapper.findById(id);
    };
    public Category findByName(String name) {
    	return categoryMapper.findByName(name);
    };
    
    // update
    public int updateById(Long id) {
    	return categoryMapper.updateById(id);
    };
    
}
