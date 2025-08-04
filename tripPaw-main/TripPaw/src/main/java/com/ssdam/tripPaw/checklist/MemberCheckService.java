package com.ssdam.tripPaw.checklist;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.CheckRoutine;
import com.ssdam.tripPaw.domain.CheckTemplateItem;
import com.ssdam.tripPaw.domain.MemberCheck;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class MemberCheckService {
	
    private final MemberCheckMapper memberCheckMapper;
    private final CheckRoutineMapper checkRoutineMapper;
    private final CheckTemplateItemMapper checkTemplateItemMapper;
    
    //복수선택 템플릿 하나의 루틴으로 묶고 일괄삽입
    @Transactional
    public List<CheckRoutine> createRoutineForBothScopes(
        Long memberId,
        Long tripPlanId,
        List<Long> templateIds,
        String title,
        boolean includePersonalRoutine //개인 루틴 생성 여부
    ) {
        List<CheckRoutine> routines = new ArrayList<>();

        // 여행 루틴 생성 (isSaved = false)
        CheckRoutine tripRoutine = new CheckRoutine();
        tripRoutine.setTitle(title + " (여행용)");
        tripRoutine.setMemberId(memberId);
        tripRoutine.setIsSaved(false);
        tripRoutine.setMemberTripPlanId(tripPlanId);
        checkRoutineMapper.insertCheckRoutine(tripRoutine);
        routines.add(tripRoutine);

        // 템플릿 항목 불러오기
        List<CheckTemplateItem> items = new ArrayList<>();
        for (Long templateId : templateIds) {
            List<CheckTemplateItem> itemList = checkTemplateItemMapper.selectItemsByTemplateId(templateId);
            items.addAll(itemList);
        }

        for (CheckTemplateItem item : items) {
            MemberCheck tripCheck = new MemberCheck();
            tripCheck.setCheckRoutine(tripRoutine);
            tripCheck.setCheckTemplateItem(item);
            tripCheck.setCustomContent(null);
            tripCheck.setIsChecked(false);
            memberCheckMapper.insertMemberCheck(tripCheck);
        }

        //개인 루틴 생성 조건부 처리
        if (includePersonalRoutine) {
            CheckRoutine personalRoutine = new CheckRoutine();
            personalRoutine.setTitle(title + " (내 루틴)");
            personalRoutine.setMemberId(memberId);
            personalRoutine.setIsSaved(true);
            personalRoutine.setMemberTripPlanId(null);
            checkRoutineMapper.insertCheckRoutine(personalRoutine);
            routines.add(personalRoutine);

            for (CheckTemplateItem item : items) {
                MemberCheck personalCheck = new MemberCheck();
                personalCheck.setCheckRoutine(personalRoutine);
                personalCheck.setCheckTemplateItem(item);
                personalCheck.setCustomContent(null);
                personalCheck.setIsChecked(false);
                memberCheckMapper.insertMemberCheck(personalCheck);
            }
        }

        return routines;
    }
    
    // 체크리스트 항목 추가
    @Transactional
    public void addMemberCheck(MemberCheck memberCheck) {
        // routineId로 CheckRoutine 객체 찾기
        CheckRoutine checkRoutine = checkRoutineMapper.selectCheckRoutineById(memberCheck.getCheckRoutine().getId());

        if (checkRoutine != null) {
            memberCheck.setCheckRoutine(checkRoutine);
            memberCheckMapper.insertMemberCheck(memberCheck);
        } else {
            // routineId가 유효하지 않으면 예외 처리
            throw new RuntimeException("CheckRoutine not found for id: " + memberCheck.getCheckRoutine().getId());
        }
    }

    // 루틴 ID 기준 체크리스트 조회
    public List<MemberCheck> getMemberChecksByRoutineId(Long routineId) {
        return memberCheckMapper.selectByRoutineId(routineId);
    }

    // 멤버 ID 기준 체크리스트 조회
    public List<MemberCheck> getMemberChecksByMemberId(Long memberId) {
        return memberCheckMapper.selectByMemberId(memberId);
    }

    // 경로 ID 기준 체크리스트 조회
    public List<MemberCheck> getMemberChecksByRouteId(Long routeId) {
        return memberCheckMapper.selectByRouteId(routeId);
    }

    // 체크리스트 항목 수정 (내용 or 체크여부)
    @Transactional
    public boolean updateMemberCheck(MemberCheck memberCheck) {
        int updated = memberCheckMapper.updateMemberCheck(memberCheck);
        return updated > 0;
    }

    // 체크리스트 항목 삭제
    @Transactional
    public boolean deleteMemberCheck(Long id) {
        int deleted = memberCheckMapper.deleteMemberCheckById(id);
        return deleted > 0;
    }

    // 루틴 삭제 시 해당 루틴에 속한 체크리스트 전체 삭제
    @Transactional
    public void deleteMemberChecksByRoutineId(Long routineId) {
        memberCheckMapper.deleteByRoutineId(routineId);
    }

    // (추가) 루틴 생성 - 체크리스트 생성시 필요
    @Transactional
    public CheckRoutine createCheckRoutine(CheckRoutine checkRoutine) {
        checkRoutineMapper.insertCheckRoutine(checkRoutine);
        return checkRoutine;
    }

    // 루틴과 그에 딸린 체크리스트 항목 모두 조회
    public CheckRoutine getRoutineWithItems(Long routineId) {
        return checkRoutineMapper.selectRoutineWithItemsById(routineId);
    }
    
    // (추가) 멤버 기준 루틴 전체 조회
    public List<CheckRoutine> getRoutinesByMemberId(Long memberId) {
        return checkRoutineMapper.selectRoutinesByMemberId(memberId);
    }
    
}
