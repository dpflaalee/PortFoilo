package com.yoonlee3.diary.goal;

import java.security.Principal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yoonlee3.diary.diary.Diary;
import com.yoonlee3.diary.goalStatus.GoalSatusService;
import com.yoonlee3.diary.goalStatus.GoalStatus;
import com.yoonlee3.diary.group.YL3Group;
import com.yoonlee3.diary.groupHasUser.JoinToGroupService;
import com.yoonlee3.diary.openScope.OpenScope;
import com.yoonlee3.diary.openScope.OpenScopeService;
import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserService;
import com.yoonlee3.diary.userAchiv.UserAchiv;
import com.yoonlee3.diary.userAchiv.UserAchivService;

@Controller
public class GoalController {

	@Autowired
	GoalService goalService;
	@Autowired
	UserService userService;
	@Autowired
	GoalSatusService goalSatusService;
	@Autowired
	OpenScopeService openScopeService;
	@Autowired
	UserAchivService userAchivService;
	@Autowired
	JoinToGroupService joinToGroupService;

	@ModelAttribute
	   public void NicknameToModel(Model model, Principal principal) {
	      if (principal != null) {
	         String email = principal.getName();
	         User user = userService.findByEmail(email);
	         if (user != null) {
	            model.addAttribute("nickname", user.getUsername());
	            model.addAttribute("user", user);
	            List<YL3Group> groups = joinToGroupService.findGroupById(user.getId());
	            model.addAttribute("groups", groups);
	            model.addAttribute("profileImage", user.getProfileImageUrl());
	         } else {
	            model.addAttribute("nickname", "Guest");
	            model.addAttribute("groups", Collections.emptySet());
	         }
	      } else {
	         model.addAttribute("nickname", "Guest");
	      }
	   }


	// 목표 생성하기
	@PostMapping("goal/insert")
	public String goalInsert_post(
	    Principal principal,
	    @RequestParam String goal_content,
	    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
	    @RequestParam("openScope.id") Long openScopeId) {

	    String email = principal.getName();
	    User user = userService.findByEmail(email);

	    OpenScope openScope = openScopeService.findOpenScopeById(openScopeId);

	    Goal goal = new Goal();
	    goal.setGoal_content(goal_content);
	    goal.setStartDate(startDate);
	    goal.setDueDate(dueDate);
	    goal.setOpenScope(openScope);

	    goalService.insertGoal(goal, user);
	    return "redirect:/mypage";
	}

	// 목표 수정하기
	@PostMapping("goal/update/{id}")
	public String goalUpdate_post(
	    @PathVariable("id") Long goal_id,
	    @RequestParam String goal_content,
	    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
	    @RequestParam Long open_scope_id) {

	    Goal goal = goalService.findByGoalId(goal_id);
	    OpenScope openScope = openScopeService.findOpenScopeById(open_scope_id);

	    goal.setGoal_content(goal_content);
	    goal.setStartDate(startDate);
	    goal.setDueDate(dueDate);
	    goal.setOpenScope(openScope);

	    goalService.updateGoal(goal);
	    return "redirect:/mypage";
	}

	// 목표 성공
	@PostMapping("goal/success/{id}")
	public String goalIsSuccess_post(@PathVariable("id") Long goal_id,
			@RequestParam(value = "is_success", required = false) Boolean is_success,
			@RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		System.out.println("날짜............" + date);
		if (date == null) {
			date = LocalDate.now();
		}
		Goal goal = goalService.findByGoalId(goal_id);

		Optional<GoalStatus> findGoalStatus = goalSatusService.findTodayGoalStatus(goal, date);
		GoalStatus goalStatus;

		if (findGoalStatus.isPresent()) {
			goalStatus = findGoalStatus.get();
			goalStatus.setIs_success(is_success != null ? is_success : false);
			goalSatusService.updateGoalStatus(goalStatus, date, goal);
		} else {
			goalStatus = new GoalStatus();
			goalStatus.setGoal(goal);
			goalStatus.setCreateDate(date);
			// 체크박스가 비어있으면 false 처리
			goalStatus.setIs_success(is_success != null ? is_success : false);
			goalSatusService.insertGoalStatus(goalStatus, date);
		}
		if (!LocalDate.now().isBefore(goal.getDueDate())) {
		    userAchivService.insertOrUpdateUserAchiv(goal);
		}
		return "redirect:/mypage?selectedDate=" + date;
	}

	// 목표 삭제하기
	@PostMapping("goal/delete/{id}")
	public String goalDelete_post(@PathVariable("id") Long goal_id, Principal principal) {

		String email = principal.getName();
		User user = userService.findByEmail(email);
		Goal goal = goalService.findByGoalId(goal_id);

		if (userAchivService.selectById(goal).isPresent()) {
			userAchivService.deleteUserAchive(goal);
		}
		goalService.deleteGoal(goal, user.getId());
		return "redirect:/mypage";
	}

	// 완료된 목표 보러가기
	@GetMapping("/user/goalComplate")
	public String goalComplate(Model model, Principal principal) {
		model.addAttribute("isMyPage", true);
		String email = principal.getName();
		User user = userService.findByEmail(email);

		List<UserAchiv> achivs = userAchivService.findByUserId(user);
		model.addAttribute("achivs", achivs);
		return "user/goalComplate";
	}

	// 완료된 목표 보러가기
	@GetMapping(value="/user/goalComplate/chart", produces="application/json; charset=UTF-8")
	@ResponseBody
	public List<Map<String,Object>> goalComplateChart(  Principal principal) {
		
		String email = principal.getName();
		User user = userService.findByEmail(email);
		List<UserAchiv> achivs = userAchivService.findByUserId(user);	
		List<Map<String,Object>> goalData=new ArrayList<>();
	    for (UserAchiv achiv : achivs) {
	        Map<String, Object> data = new HashMap<>();
	        String goalContent = achiv.getGoal().getGoal_content();
	        data.put("getGoal_content", goalContent); 
	        data.put("completionRate", achiv.getCompletionRate()); // 달성률
	        goalData.add(data);
	    } 
		return goalData;
	}
	
	// 날짜 바꾸기
	@PostMapping("/goal/byDate")
	public String goalByDate(@RequestParam("selectedDate") String selectedDate, Model model) {
		LocalDate date = LocalDate.parse(selectedDate);

		return "redirect:/mypage?selectedDate=" + date;
	}

}
