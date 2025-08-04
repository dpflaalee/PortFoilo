package com.ssdam.tripPaw.badge;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.Badge;

@Mapper
public interface BadgeMapper {
	void insertBadge(Badge badge);
	void insertOrUpdateBadge(Badge badge);
    void updateBadge(Badge badge);
    void deleteBadge(Long id);
    Badge findById(Long id);
    List<Badge> findAll();
    
    @Insert("INSERT INTO badge (name, description, image_url, weight) VALUES (#{name}, #{description}, #{imageUrl}, #{weight})")
    void insertBadgeDummy(Badge badge);
    
    @Select("SELECT COUNT(*) FROM badge")
    int countBadges();

}
