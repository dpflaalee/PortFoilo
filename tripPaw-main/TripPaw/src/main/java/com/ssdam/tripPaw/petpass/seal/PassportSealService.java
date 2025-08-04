package com.ssdam.tripPaw.petpass.seal;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.PassportSeal;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class PassportSealService {
	
	private final PassportSealMapper passportSealMapper;
	
	public void addPassportSeal(PassportSeal passportSeal) {
		passportSealMapper.insert(passportSeal);
	}
	
	public PassportSeal getPassportSeal(Long id) {
		return passportSealMapper.findById(id);
	}
	
	public List<PassportSeal> getPassportSealsByPassportId(Long passportId) {
		return passportSealMapper.findByPassportId(passportId);
	}
	
	public void deletePassportSeal(Long id) {
		passportSealMapper.delete(id);
	}

}
