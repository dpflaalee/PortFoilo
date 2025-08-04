package com.yoonlee3.diary.diary;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.yoonlee3.diary.follow.Follow;
import com.yoonlee3.diary.follow.FollowRepository;
import com.yoonlee3.diary.goal.Goal;
import com.yoonlee3.diary.goal.GoalService;
import com.yoonlee3.diary.goalStatus.GoalSatusService;
import com.yoonlee3.diary.goalStatus.GoalStatus;
import com.yoonlee3.diary.group.GroupService;
import com.yoonlee3.diary.group.YL3Group;
import com.yoonlee3.diary.groupDiary.GroupDiary;
import com.yoonlee3.diary.groupDiary.GroupDiaryService;
import com.yoonlee3.diary.groupHasUser.JoinToGroupService;
import com.yoonlee3.diary.like.LikeRepository;
import com.yoonlee3.diary.like.LikeService;
import com.yoonlee3.diary.openScope.OpenScope;
import com.yoonlee3.diary.openScope.OpenScopeService;
import com.yoonlee3.diary.template.Template;
import com.yoonlee3.diary.template.TemplateService;
import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class DiaryController {

	@Autowired
	DiaryService diaryService;
	@Autowired
	UserService userService;
	@Autowired
	Diary_gptService api;
	@Autowired
	LikeService likeService;
	@Autowired
	OpenScopeService openScopeService;
	@Autowired
	TemplateService templateService;
	@Autowired
	JoinToGroupService joinToGroupService;
	@Autowired
	GroupService groupService;
	@Autowired
	GroupDiaryService groupDiaryService;
	@Autowired
	GoalService goalService;
	@Autowired
	GoalSatusService goalSatusService;
	@Autowired
	FollowRepository followRepository;
	@Autowired
	DiaryRepository diaryRepository;
	@Autowired
	LikeRepository likeRepository;

	@ModelAttribute
	public void NicknameToModel(Model model, Principal principal) {
		if (principal != null) {
			String email = principal.getName();
			User user = userService.findByEmail(email);
			model.addAttribute("nickname", user.getUsername());
			model.addAttribute("user", user);

			List<YL3Group> groups = joinToGroupService.findGroupById(user.getId());
			model.addAttribute("groups", groups);

			model.addAttribute("profileImage", user.getProfileImageUrl());
			
			// 작성한 일기 수 가져오기
			long diaryCount = diaryRepository.countByUser(user); // 일기 작성 수
			model.addAttribute("diaryCount", diaryCount); // 다이어리 수

		} else {
			model.addAttribute("nickname", "Guest");
			model.addAttribute("groups", Collections.emptySet());
		}
	}

	// 메인
	@GetMapping("/main")
	public String mainList(Principal principal, Model model) {
		String email = principal.getName();
		User user = userService.findByEmail(email);
		List<Diary> allDiaries = diaryService.findAll();

		// 공개범위에 따라 필터링_수정
		List<Diary> visibleDiaries = allDiaries.stream()
				.filter(diary -> !diary.getOpenScope().getOpenScope_value().equals("GROUP"))
				.filter(diary -> canViewDiary(diary, user)).collect(Collectors.toList());

		// 작성한 일기 수 가져오기
		long diaryCount = diaryRepository.countByUser(user); // 일기 작성 수
		model.addAttribute("diaryCount", diaryCount); // 다이어리 수

		List<Follow> followers = followRepository.findByFollowing(user); // 나를 팔로우한 사람들
		List<Follow> followings = followRepository.findByFollower(user); // 내가 팔로우한 사람들
		model.addAttribute("followers", followers); // 팔로워 리스트
		model.addAttribute("followings", followings); // 팔로잉 리스트

		// 팔로워 수와 팔로잉 수를 계산해서 모델에 추가
		long followerCount = followRepository.countByFollowing(user);
		long followingCount = followRepository.countByFollower(user);
		model.addAttribute("followerCount", followerCount); // 팔로워 수
		model.addAttribute("followingCount", followingCount); // 팔로잉 수

		model.addAttribute("list", visibleDiaries);
		model.addAttribute("isMainPage", true);
		return "mainTemplate/main";
	}

	private boolean canViewDiary(Diary diary, User user) {
		OpenScope openScope = diary.getOpenScope();

		// 공개범위에 맞는 필터링을 추가
		if (openScope.getOpenScope_value().equals("PRIVATE") && !diary.getUser().equals(user)) {
			return false;
		}

		if (openScope.getOpenScope_value().equals("FRIENDS")
				&& !(user.getFollowers().stream().anyMatch(follow -> follow.getFollowing().equals(diary.getUser()))
						|| diary.getUser().equals(user))) {
			return false;
		}

		if (openScope.getOpenScope_value().equals("GROUP") && (!diary.getGroupDiaries().stream()
				.anyMatch(groupDiary -> user.getGroups().contains(groupDiary.getGroup()))
				&& !diary.getUser().equals(user))) {
			return false;
		}

		return true;
	}
	
	private boolean canViewGoal(Goal goal, User user) {
		if (goal == null || goal.getOpenScope() == null || goal.getUser() == null) {
			return false;
		}

		OpenScope openScope = goal.getOpenScope();

		// '나만보기'
		if (openScope.getOpenScope_value().equals("PRIVATE") && !goal.getUser().equals(user)) {
			return false;
		}

		// '친구공개'
		if (openScope.getOpenScope_value().equals("FRIENDS") &&
				!(user.getFollowers().stream().anyMatch(f -> f.getFollowing().equals(goal.getUser()))
				  || goal.getUser().equals(user))) {
			return false;
		}

		return true; // 전체공개
	}

	// 상세보기
	@GetMapping("/mainTemplate/detail/{id}")
	public String detail(@PathVariable Long id, Model model, Principal principal) {
		model.addAttribute("dto", diaryService.findById(id));

		long likeCount = likeService.getLikeCount(id);
		model.addAttribute("likeCount", likeCount);

		if (principal != null) {
			String email = principal.getName();
			User user = userService.findByEmail(email);
			boolean isLiked = likeService.isLiked(id, user.getId());
			model.addAttribute("isLiked", isLiked); // 좋아요 여부 추가
		} else {
			model.addAttribute("isLiked", false); // 비로그인 시 좋아요 상태 false
		}

		Diary diary = diaryService.findById(id);
		Template template = diary.getTemplate();
		String theme = template.getTemplate_title();
		model.addAttribute("theme", theme);
		return "mainTemplate/detail";
	}

	// 글 작성하기
	@GetMapping("/diary/insert")
	public String insert_get(Principal principal, Model model,
			@RequestParam(value = "selectedDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

		String email = principal.getName();
		User user = userService.findByEmail(email);

		LocalDate selectedDate = (date != null) ? date : LocalDate.now();
		List<Goal> goals = goalService.findTodayGoalByUserId(user, selectedDate);
		Map<Long, GoalStatus> goalStatusMap = new HashMap<>();
		for (Goal goal : goals) {
			goalSatusService.findTodayGoalStatus(goal, selectedDate)
					.ifPresent(status -> goalStatusMap.put(goal.getId(), status));
		}
		model.addAttribute("goalStatusMap", goalStatusMap);
		model.addAttribute("selectedDate", selectedDate);
		model.addAttribute("goals", goals);
		return "mainTemplate/write";
	}

	@PostMapping("/diary/insert")
	public String insert_post(Diary diary, @RequestParam(required = false) Long open_scope_id,
			@RequestParam(required = false) Long template_id, Principal principal, Model model) {
		String email = principal.getName();
		User user = userService.findByEmail(email);

		diary.setUser(user);

		OpenScope openScope = openScopeService.findOpenScopeById(open_scope_id);
		diary.setOpenScope(openScope);
		Template template = templateService.findTempalteById(template_id);
		diary.setTemplate(template);

		diaryService.insert(diary);
		return "redirect:/main";
	}

	// 이모지 요약 받기
	@PostMapping("/diary/emoji")
	@ResponseBody
	public Map<String, String> getSummary(@RequestBody Map<String, String> request) {
		String diaryContent = request.get("content");
		String emoji = api.getAIResponse(diaryContent);
		Map<String, String> result = new HashMap<>();
		result.put("emoji", emoji);
		return result;
	}

	// 글 수정하기
	@GetMapping("/diary/update/{id}")
	public String update_get(@PathVariable Long id, Principal principal, Model model, RedirectAttributes rttr) {
		Diary diary = diaryService.update_view(id); // 수정할 글 가져오기
		if (diary.getUser().getEmail().equals(principal.getName())) {
			model.addAttribute("dto", diary); // 수정할 일기 가져오기
			return "mainTemplate/update";
		} else {
			rttr.addFlashAttribute("msg", "본인이 작성한 글만 수정할 수 있습니다.");
			return "redirect:/main";
		}
	}

	@PostMapping("/diary/update")
	public String update_post(Diary diary, RedirectAttributes rttr,
	                          @RequestParam(required = false) Long open_scope_id,
	                          @RequestParam(required = false) Long template_id,
	                          Principal principal) {
	    String msg = "fail";

	    Diary existingDiary = diaryService.update_view(diary.getId());

	    //본인 확인
	    if (!existingDiary.getUser().getEmail().equals(principal.getName())) {
	        rttr.addFlashAttribute("msg", "본인이 작성한 글만 수정할 수 있습니다.");
	        return "redirect:/main";
	    }

	    // 수정 내용 반영
	    existingDiary.setDiary_title(diary.getDiary_title());
	    existingDiary.setDiary_content(diary.getDiary_content());
	    existingDiary.setDiary_emoji(diary.getDiary_emoji());

	    if (open_scope_id != null) {
	        OpenScope openScope = openScopeService.findOpenScopeById(open_scope_id);
	        if (openScope != null) {
	            existingDiary.setOpenScope(openScope);
	        }
	    }

	    if (template_id != null) {
	        Template template = templateService.findTempalteById(template_id);
	        if (template != null) {
	            existingDiary.setTemplate(template);
	        }
	    }

	    if (diaryService.update(existingDiary) > 0) {
	        msg = "글수정완료!";
	    }

	    rttr.addFlashAttribute("msg", msg);
	    return "redirect:/mainTemplate/detail/" + existingDiary.getId();
	}

	// 글 삭제하기
	@GetMapping("/diary/delete/{id}")
	public String delete_get(@PathVariable Long id, Principal principal, Model model, RedirectAttributes rttr) {
		Diary diary = diaryService.findById(id);

		// 다이어리가 존재하고, 현재 로그인한 사용자가 작성자와 일치하는지 확인
		if (diary == null) {
			rttr.addFlashAttribute("msg", "다이어리를 찾을 수 없습니다.");
			return "redirect:/main";
		}

		if (diary.getUser().getEmail().equals(principal.getName())) {
			model.addAttribute("diary", diary);
			return "/diary/delete/{id}";
		} else {
			rttr.addFlashAttribute("msg", "본인이 작성한 글만 삭제할 수 있습니다.");
			return "redirect:/main";
		}
	}

	@Transactional
	@PostMapping("/diary/delete/{id}")
	public String delete_post(@PathVariable Long id, Principal principal, RedirectAttributes rttr) {
		Diary diary = diaryService.findById(id);

		if (diary == null) {
			rttr.addFlashAttribute("msg", "다이어리를 찾을 수 없습니다.");
			return "redirect:/main";
		}

		if (!diary.getUser().getEmail().equals(principal.getName())) {
			rttr.addFlashAttribute("msg", "본인이 작성한 글만 삭제할 수 있습니다.");
			return "redirect:/main";
		}

		try {
			likeRepository.deleteByDiaryId(diary.getId());
		    groupDiaryService.deleteByDiary(diary);
		    diaryService.delete(diary);
		    rttr.addFlashAttribute("msg", "글삭제 성공!");
		} catch (Exception e) {
		    rttr.addFlashAttribute("msg", "그룹에서 먼저 삭제해주세요. ");
		    TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
		}


		return "redirect:/main";
	}

	/// Group
	// 그룹 다이어리 쓸 때 목표 그룹 수 만큼 가져오기
	@GetMapping("group/{id}/diary/insert")
	public String insertGroupDiary_get(@PathVariable("id") Long group_id, Model model, Principal principal,
			RedirectAttributes redirectAttributes) {

		// 그룹 사이즈 계산하기
		YL3Group group = groupService.findById(group_id);
		model.addAttribute("group", group);
		int groupSize = group.getUsers().size();
		model.addAttribute("groupSize", groupSize);

		// 오늘 날짜, 그룹 사이즈 날짜
		List<LocalDate> dateList = new ArrayList<>();
		LocalDate today = LocalDate.now();
		LocalDate startDate = today.minusDays(groupSize - 1); // 시작 날짜

		// 유저 찾기
		String email = principal.getName();
		User user = userService.findByEmail(email);

		// 오늘 쓰는 날인지 계산
		int currentTurn = group.getCurrentTurn();

		if (currentTurn >= groupSize) {
			// 턴 리셋
			currentTurn = 0;
			group.setCurrentTurn(0);
			groupService.insertGroup(group); // 저장
		}
		User currentUser = group.getUsers().get(currentTurn);

		if (!user.getId().equals(currentUser.getId())) {
			redirectAttributes.addAttribute("turnMessage", "지금은 차례가 아닙니다.");
			return "redirect:/group/group/" + group_id;
		}

		// 유저의 목표 가져오기
		List<Goal> goals = goalService.findOverGoalByUserId(user, startDate);
		model.addAttribute("goals", goals);

		// 그룹 사이즈 만큼의 목표 상태 가져오기
		for (int i = 0; i < groupSize; i++) {
			dateList.add(startDate.plusDays(i)); // 시작일부터 하루씩 추가
		}

		model.addAttribute("dateList", dateList);

		Map<String, Map<String, Boolean>> goalStatusDateMap = new HashMap<>();
		for (Goal g : goals) {
			Map<String, Boolean> dateSuccessMap = new HashMap<>();
			for (LocalDate date : dateList) {
				GoalStatus status = goalSatusService.findByGoalIdAndDate(g.getId(), date);
				String dateKey = date.toString();
				if (status != null) {
					dateSuccessMap.put(dateKey, status.getIs_success());
				} else {
					dateSuccessMap.put(dateKey, false);
				}
			}
			goalStatusDateMap.put(g.getId().toString(), dateSuccessMap);
		}
		model.addAttribute("goalStatusDateMap", goalStatusDateMap);

		return "group/group_write";
	}

	/// 그룹 다이어리 쓰기(post)
	@PostMapping("group/{id}/diary/insert")
	public String insertGroupDiary_post(Diary diary, Principal principal,
			@RequestParam(required = false) Long template_id, @PathVariable("id") Long group_id) {
		// 유저찾기
		String email = principal.getName();
		User user = userService.findByEmail(email);
		
		// 다이어리 저장
		Diary newDiary = new Diary();
		newDiary.setDiary_title(diary.getDiary_title());
		newDiary.setDiary_content(diary.getDiary_content());
		newDiary.setCreate_date(LocalDateTime.now());
		newDiary.setUser(user);
		newDiary.setDiary_emoji(diary.getDiary_emoji());
		newDiary.setOpenScope(diary.getOpenScope());
		
		Template template = templateService.findTempalteById(template_id);
		newDiary.setTemplate(template);

		Diary savedDiary = diaryService.insert(newDiary);

		// 그룹 다이어리로 저장
		YL3Group group = groupService.findById(group_id);
		groupDiaryService.insertGroupDiary(group, savedDiary);

		// turn 넘기기
		int nextTurn = (group.getCurrentTurn() + 1) % group.getUsers().size();
		group.setCurrentTurn(nextTurn);
		LocalDate today = LocalDate.now();
		group.setLastTurnDate(today);
		groupService.insertGroup(group);

		return "redirect:/group/group/" + group_id;
	}

	// 상세보기
	@GetMapping("group/groupDiaryDetail/{id}")
	public String groupDiaryDetail_get(@PathVariable("id") Long diary_id, Model model, Principal principal) {
		
		// 일기 찾기
		Diary diary = diaryService.findById(diary_id);
		model.addAttribute("dto", diaryService.findById(diary_id));

		// 다이어리로 그룹 찾기
		GroupDiary findDiary = groupDiaryService.findByDiaryId(diary);
		YL3Group group = groupService.findById(findDiary.getGroup().getId());

		// 그룹 사이즈 계산
		int groupSize = group.getUsers().size();
		
		//로그인 한 나
		String email = principal.getName();
		final User user = userService.findByEmail(email);
		
		// 글쓴 유저의 목표 가져오기
		List<LocalDate> dateList = new ArrayList<>();
		LocalDate today = diary.getCreate_date().toLocalDate();

		User diaryUser = diary.getUser();
		
		LocalDate startDate = today.minusDays(groupSize - 1);
		List<Goal> goals = goalService.findOverGoalByUserId(diaryUser, startDate);
		
		// 목표 공개범위 필터링
		List<Goal> visibleGoals = goals.stream()
		    .filter(g -> canViewGoal(g, user))
		    .collect(Collectors.toList());
		model.addAttribute("goals", visibleGoals);

		
		// 그룹 사이즈 만큼의 목표 상태 가져오기
		model.addAttribute("group", group);

		for (int i = 0; i < groupSize; i++) {
			dateList.add(startDate.plusDays(i)); // 시작일부터 하루씩 추가
		}

		model.addAttribute("dateList", dateList);

		Map<String, Map<String, Boolean>> goalStatusDateMap = new HashMap<>();
		for (Goal g : visibleGoals) {
			Map<String, Boolean> dateSuccessMap = new HashMap<>();
			for (LocalDate date : dateList) {
				GoalStatus status = goalSatusService.findByGoalIdAndDate(g.getId(), date);
				String dateKey = date.toString();
				if (status != null) {
					dateSuccessMap.put(dateKey, status.getIs_success());
				} else {
					dateSuccessMap.put(dateKey, false);
				}
			}
			goalStatusDateMap.put(g.getId().toString(), dateSuccessMap);
		}
		model.addAttribute("goalStatusDateMap", goalStatusDateMap);

		long likeCount = likeService.getLikeCount(diary_id);
		model.addAttribute("likeCount", likeCount);

		if (principal != null) {
			boolean isLiked = likeService.isLiked(diary_id, user.getId());
			model.addAttribute("isLiked", isLiked); // 좋아요 여부 추가
		}

		Template template = diary.getTemplate();
		String theme = template.getTemplate_title();
		model.addAttribute("theme", theme);

		return "group/groupDiaryDetail";
	}

	// 그룹 다이어리 수정
	@GetMapping("/group/diary/update/{id}")
	public String updateGroupDiary_get(@PathVariable Long id, Principal principal, Model model,
			RedirectAttributes rttr) {
		Diary diary = diaryService.update_view(id); // 수정할 글 가져오기
		if (diary.getUser().getEmail().equals(principal.getName())) {
			model.addAttribute("dto", diary); // 수정할 일기 가져오기
			return "group/group_update";
		} else {
			rttr.addFlashAttribute("msg", "본인이 작성한 글만 수정할 수 있습니다.");
			return "redirect:/group/groupDiaryDetail/" + diary.getId();
		}
	}

	@PostMapping("/group/diary/update")
	public String updateGroupDiary_post(Diary diary, RedirectAttributes rttr,
			@RequestParam(required = false) Long open_scope_id, @RequestParam(required = false) Long template_id) {
		String msg = "fail";

		Diary existingDiary = diaryService.findById(diary.getId());

		// 수정 내용 반영
		existingDiary.setDiary_title(diary.getDiary_title());
		existingDiary.setDiary_content(diary.getDiary_content());
		existingDiary.setDiary_emoji(diary.getDiary_emoji());

		if (open_scope_id != null) {
			OpenScope openScope = openScopeService.findOpenScopeById(open_scope_id);
			if (openScope != null) {
				existingDiary.setOpenScope(openScope);
			}
		}

		if (template_id != null) {
			Template template = templateService.findTempalteById(template_id);
			if (template != null) {
				existingDiary.setTemplate(template);
			}
		}

		if (diaryService.update(existingDiary) > 0) {
			msg = "글수정완료!";
		}

		rttr.addFlashAttribute("msg", msg);
		return "redirect:/group/groupDiaryDetail/" + diary.getId(); // 글수정기능
	}

	// 그룹 다이어리 삭제
	@PostMapping("/group/diary/delete/{id}")
	public String deleteGroupDiary_post(@PathVariable("id") Long diary_id, Principal principal,
			RedirectAttributes rttr) {
		Diary diary = diaryService.findById(diary_id);
		GroupDiary findGroupDiary = groupDiaryService.findByDiaryId(diary);
		YL3Group group = findGroupDiary.getGroup();

		if (diary.getUser().getEmail().equals(principal.getName())) {
			// 삭제 처리
			if (groupDiaryService.deleteGroupDiary(findGroupDiary) > 0) {
				rttr.addFlashAttribute("msg", "글삭제 성공!");
			} else {
				rttr.addFlashAttribute("msg", "글삭제 실패!");
			}
		} else {
			rttr.addFlashAttribute("msg", "본인이 작성한 글만 삭제할 수 있습니다.");
		}

		return "redirect:/group/group/" + group.getId();
	}

	// 좋아요 기능
	@GetMapping("/main/likes")
	public String getDiarySortedByLikes(Principal principal, Model model) {
	    String email = principal.getName();
	    User user = userService.findByEmail(email);

	    List<Diary> allDiaries = diaryService.findAll();

	    // 공개 범위 필터링 + 좋아요 수 캐싱
	    Map<Long, Long> likeCountMap = allDiaries.stream()
	        .filter(diary -> canViewDiary(diary, user))
	        .collect(Collectors.toMap(
	            Diary::getId,
	            diary -> likeService.getLikeCount(diary.getId())
	        ));

	    // 정렬
	    List<Diary> sortedVisibleDiaries = allDiaries.stream()
	        .filter(diary -> canViewDiary(diary, user))
	        .sorted(Comparator.comparingLong((Diary diary) ->
	        	likeCountMap.getOrDefault(diary.getId(), 0L)
	        		).reversed())
	        .collect(Collectors.toList());

	    model.addAttribute("list", sortedVisibleDiaries);
	    model.addAttribute("isMainPage", true);
	    return "mainTemplate/main";
	}

}
