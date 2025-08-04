package com.ssdam.tripPaw.checklist;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssdam.tripPaw.domain.CheckRoutine;
import com.ssdam.tripPaw.domain.MemberCheck;

import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/member-checks") @RequiredArgsConstructor
public class MemberCheckController {

	private final MemberCheckService memberCheckService;
	private final CheckRoutineMapper checkRoutineMapper;
	
	//복수선택 템플릿 하나의 루틴으로 묶고 일괄삽입
	@PostMapping("/routine/from-templates")
	public ResponseEntity<List<CheckRoutine>> createBothRoutines(@RequestBody RoutineTemplateRequest request) {
	    List<CheckRoutine> created = memberCheckService.createRoutineForBothScopes(
	        request.getMemberId(),
	        request.getMemberTripPlanId(),
	        request.getTemplateIds(),
	        request.getTitle(),
	        request.getIsSaved() //boolean flag 전달
	    );
	    return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}


    	// 체크리스트 항목 추가
	@PostMapping
	public ResponseEntity<String> addMemberCheck(@RequestBody MemberCheck memberCheck) {
	    // CheckRoutine 존재 여부 확인
	    if (memberCheck.getCheckRoutine() == null || memberCheck.getCheckRoutine().getId() == null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("CheckRoutine ID is required.");	    }

	    CheckRoutine checkRoutine = checkRoutineMapper.selectCheckRoutineById(memberCheck.getCheckRoutine().getId());
	    if (checkRoutine == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("CheckRoutine not found for id: " + memberCheck.getCheckRoutine().getId());
	    }

	    memberCheck.setCheckRoutine(checkRoutine);
	    memberCheckService.addMemberCheck(memberCheck);

	    return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// 루틴 기준 체크리스트 조회
	@GetMapping("/routine/{routineId}")
	public ResponseEntity<List<MemberCheck>> getByRoutineId(@PathVariable Long routineId) {
		List<MemberCheck> list = memberCheckService.getMemberChecksByRoutineId(routineId);
		return ResponseEntity.ok(list);
	}
	
	// 멤버 기준 체크리스트 조회
	@GetMapping("/member/{memberId}")
	public ResponseEntity<List<MemberCheck>> getByMemberId(@PathVariable Long memberId) {
		List<MemberCheck> list = memberCheckService.getMemberChecksByMemberId(memberId);
		return ResponseEntity.ok(list);
	}
	
	// 경로 기준 체크리스트 조회
	@GetMapping("/route/{routeId}")
	public ResponseEntity<List<MemberCheck>> getByRouteId(@PathVariable Long routeId) {
		List<MemberCheck> list = memberCheckService.getMemberChecksByRouteId(routeId);
		return ResponseEntity.ok(list);
	}
	
	// 체크리스트 항목 수정
	@PutMapping("/{id}")
	public ResponseEntity<Void> updateMemberCheck(@PathVariable Long id, @RequestBody MemberCheck memberCheck) {
		memberCheck.setId(id);
		boolean updated = memberCheckService.updateMemberCheck(memberCheck);
		if (updated) return ResponseEntity.noContent().build();
		return ResponseEntity.notFound().build();
	}
	
	// 체크리스트 항목 삭제
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteMemberCheck(@PathVariable Long id) {
		boolean deleted = memberCheckService.deleteMemberCheck(id);
		if (deleted) return ResponseEntity.noContent().build();
		return ResponseEntity.notFound().build();
	}
	
	// 루틴 전체 조회 (템플릿 선택용 등)
	@GetMapping("/routines/member/{memberId}")
	public ResponseEntity<List<CheckRoutine>> getRoutinesByMember(@PathVariable Long memberId) {
		List<CheckRoutine> routines = memberCheckService.getRoutinesByMemberId(memberId);
		return ResponseEntity.ok(routines);
	}
	
	// 루틴 + 항목 상세 조회
	@GetMapping("/routine/detail/{routineId}")
	public ResponseEntity<CheckRoutine> getRoutineWithItems(@PathVariable Long routineId) {
		CheckRoutine routine = memberCheckService.getRoutineWithItems(routineId);
		if (routine == null) return ResponseEntity.notFound().build();
		return ResponseEntity.ok(routine);
	}
	
	// 루틴 생성 예시 (체크리스트 생성 시작 시)
	@PostMapping("/routine")
	public ResponseEntity<CheckRoutine> createRoutine(@RequestBody CheckRoutine checkRoutine) {
		CheckRoutine created = memberCheckService.createCheckRoutine(checkRoutine);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}
    
}
