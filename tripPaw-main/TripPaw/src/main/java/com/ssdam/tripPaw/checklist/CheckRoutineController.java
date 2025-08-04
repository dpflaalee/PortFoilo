package com.ssdam.tripPaw.checklist;

import java.util.List;

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

import lombok.RequiredArgsConstructor;

@RestController @RequiredArgsConstructor @RequestMapping("/api/routine")
public class CheckRoutineController {
	private final CheckRoutineService checkRoutineService;
	
	//루틴생성
	@PostMapping
    public ResponseEntity<Void> createRoutine(@RequestBody CheckRoutine routine) {
        checkRoutineService.createRoutine(routine);
        return ResponseEntity.ok().build();
    }

	//단일루틴조회(항목포함)
    @GetMapping("/{id}")
    public ResponseEntity<CheckRoutine> getRoutineWithItems(@PathVariable Long id) {
        CheckRoutine routine = checkRoutineService.getRoutineWithItems(id);
        return ResponseEntity.ok(routine);
    }

    //유저의 전체 루틴 조회
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<CheckRoutine>> getRoutinesByMember(@PathVariable Long memberId) {
        List<CheckRoutine> routines = checkRoutineService.getRoutinesByMemberId(memberId);
        return ResponseEntity.ok(routines);
    }
    
    //여행용 루틴조회
    @GetMapping("/member/{memberId}/trip/{tripPlanId}")
    public ResponseEntity<List<CheckRoutine>> getRoutinesByTripPlan(
        @PathVariable Long memberId,
        @PathVariable Long tripPlanId
    ) {
        List<CheckRoutine> routines = checkRoutineService.getRoutinesByTripPlan(memberId, tripPlanId);
        return ResponseEntity.ok(routines);
    }

    //루틴 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateRoutine(@PathVariable Long id, @RequestBody CheckRoutine routine) {
        routine.setId(id);
        checkRoutineService.updateRoutine(routine);
        return ResponseEntity.ok().build();
    }

    //루틴 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long id) {
        checkRoutineService.deleteRoutine(id);
        return ResponseEntity.ok().build();
    }
}
