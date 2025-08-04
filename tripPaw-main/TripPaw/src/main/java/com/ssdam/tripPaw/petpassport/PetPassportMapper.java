package com.ssdam.tripPaw.petpassport;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.ssdam.tripPaw.domain.PetPassport;

@Mapper
public interface PetPassportMapper {
    // 1. 여권 생성
    void insertPetPassport(PetPassport passport);
    
    // 여권 ID로 단건 조회
    PetPassport selectPassportById(Long passportId);

    // 2. 유저 ID로 여권 조회
    List<PetPassport> selectPassportsByMemberId(Long memberId);

    // 3. 여권 ID로 상세 조회 (도장 포함)
    PetPassport selectPassportWithSeals(@Param("passportId") Long passportId);

    // 4. 여권번호 중복 체크
    int countByPassNum(@Param("passNum") String passNum);
    
    // 5. 수정
    void updatePetPassport(PetPassport passport);

    // 6. 삭제
    int deletePetPassport(@Param("passportId") Long passportId);
}
