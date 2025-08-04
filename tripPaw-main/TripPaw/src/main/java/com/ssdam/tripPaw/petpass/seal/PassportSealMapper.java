package com.ssdam.tripPaw.petpass.seal;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.PassportSeal;

@Mapper
public interface PassportSealMapper {
	void insert(PassportSeal passportSeal);
	
	PassportSeal findById(Long id);
	
	List<PassportSeal> findByPassportId(Long passportId);
	
	void delete(Long id);
}
