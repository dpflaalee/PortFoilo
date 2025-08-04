package com.yoonlee3.diary.group;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.yoonlee3.diary.badge.Badge;
import com.yoonlee3.diary.badge.BadgeService;
import com.yoonlee3.diary.diary.DiaryRepository;
import com.yoonlee3.diary.follow.Follow;
import com.yoonlee3.diary.follow.FollowRepository;
import com.yoonlee3.diary.follow.FollowService;
import com.yoonlee3.diary.goal.Goal;
import com.yoonlee3.diary.goal.GoalService;
import com.yoonlee3.diary.goalStatus.GoalSatusService;
import com.yoonlee3.diary.goalStatus.GoalStatus;
import com.yoonlee3.diary.groupDiary.GroupDiary;
import com.yoonlee3.diary.groupDiary.GroupDiaryService;
import com.yoonlee3.diary.groupHasUser.JoinToGroupService;
import com.yoonlee3.diary.openScope.OpenScope;
import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserService;

@Controller
public class GroupController {

	@Autowired
	GroupService groupService;
	@Autowired
	UserService userService;
	@Autowired
	JoinToGroupService joinToGroupService;
	@Autowired
	GroupDiaryService groupDiaryService;
	@Autowired
	BadgeService badgeService;
	@Autowired
	FollowRepository followRepository;
	@Autowired
	FollowService followService;
	@Autowired
	DiaryRepository diaryRepository;
	@Autowired
	GoalService goalService;
	@Autowired
	GoalSatusService goalSatusService;

	// 로그인 된 유저 닉네임 설정
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
			
			// 나를 차단한 유저들
			List<User> usersWhoBlockedMe = userService.getUsersWhoBlocked(user.getId());
			Set<Long> usersWhoBlockedMeIds = usersWhoBlockedMe.stream().map(User::getId).collect(Collectors.toSet());
			model.addAttribute("usersWhoBlockedMeIds", usersWhoBlockedMeIds);

			// 내가 차단한 유저들
			Set<Long> blockedUserIds = userService.getBlockedUsers(user.getId()).stream().map(User::getId)
					.collect(Collectors.toSet());
			model.addAttribute("blockedUserIds", blockedUserIds);

			// 작성한 일기 수 가져오기
			long diaryCount = diaryRepository.countByUser(user);
			model.addAttribute("diaryCount", diaryCount);

		} else {
			model.addAttribute("nickname", "Guest");
			model.addAttribute("groups", Collections.emptySet());
		}
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

	// 그룹 홈 화면
	@GetMapping("/group/main")
	public String groupHome(Model model, Principal principal) {
		List<YL3Group> groups = groupService.findAll();
		model.addAttribute("groupList", groups);
		model.addAttribute("isGroupPage", true);

		String email = principal.getName();
		User user = userService.findByEmail(email);

		// 작성한 일기 수 가져오기
		long diaryCount = diaryRepository.countByUser(user);
		model.addAttribute("diaryCount", diaryCount);
		
		// 그룹 뱃지 계산하기
		for (YL3Group group : groups) {
			int badgeLevel = badgeService.calculateBadgeLevel(group.getCreate_date().toLocalDate());
			Badge badge = badgeService.findById((long) badgeLevel)
					.orElseThrow(() -> new RuntimeException("뱃지를 찾을 수 없습니다."));
			group.setBadge(badge);
		}

		List<Follow> followers = followRepository.findByFollowing(user);
		List<Follow> followings = followRepository.findByFollower(user);
		model.addAttribute("followers", followers);
		model.addAttribute("followings", followings);

		// 팔로워 수와 팔로잉 수를 계산해서 모델에 추가
		long followerCount = followRepository.countByFollowing(user);
		long followingCount = followRepository.countByFollower(user);
		model.addAttribute("followerCount", followerCount);
		model.addAttribute("followingCount", followingCount);
		return "group/main";
	}

	// 그룹 화면
	@GetMapping("group/group/{id}")
	public String groupPage(Principal principal, @PathVariable("id") Long group_id, Model model,
			@ModelAttribute("turnMessage") String turnMessage) {

		model.addAttribute("isGroupPage", true);

		YL3Group group = groupService.findById(group_id);

		// 그룹 리더인지 확인
		String email = principal.getName();
		User user = userService.findByEmail(email);
		boolean isLeader = group.getGroup_leader().getId().equals(user.getId());
		model.addAttribute("isLeader", isLeader);

		// 내가 그룹에 속해있는지 확인
		List<User> groupUsers = group.getUsers();
		if (groupUsers.contains(user)) {
			model.addAttribute("isMyGroup", true);
		}

		model.addAttribute("myId", user.getId());

		// 그룹에 속한 유저들
		List<User> users = group.getUsers();
		LocalDate today = LocalDate.now();

		// 그 유저들의 오늘 목표 성공 여부
		List<Goal> allGoals = new ArrayList<>();
		List<GoalStatus> statusList = new ArrayList<>();
		Map<User, List<Goal>> userGoalsMap = new LinkedHashMap<>();
		
		
		for (User groupuser : users) {
		    List<Goal> userGoals = goalService.findTodayGoalByUserId(groupuser, today);
		    
		    List<Goal> visibleUserGoals = userGoals.stream()
		        .filter(g -> canViewGoal(g, user))
		        .collect(Collectors.toList());

		    userGoalsMap.put(groupuser, visibleUserGoals);
		    allGoals.addAll(visibleUserGoals);

		    for (Goal g : visibleUserGoals) {
		        GoalStatus status = goalSatusService.findTodaySuccessGoal(g, today);
		        if (status != null) {
		            statusList.add(status);
		        }
		    }
		}

		Set<Long> successGoalIds = statusList.stream()
			    .filter(gs -> Boolean.TRUE.equals(gs.getIs_success()))
			    .map(gs -> gs.getGoal().getId())
			    .collect(Collectors.toSet());
		
		model.addAttribute("successGoalIds", successGoalIds);
		model.addAttribute("userGoalsMap", userGoalsMap);
		model.addAttribute("statusList", statusList);

		// 그 유저들의 다이어리 리스트
		model.addAttribute("groupUser", users);
		List<GroupDiary> groupDiaryList1 = groupDiaryService.findByGroupId(group);

		List<GroupDiary> visibleDiaries = groupDiaryList1.stream().filter(d -> {
			if (d.getDiary() == null || d.getDiary().getOpenScope() == null)
				return false;

			String scope = d.getDiary().getOpenScope().getOpenScope_value();
			if ("GROUP".equals(scope)) {
				return user.getGroups().contains(d.getGroup()) || d.getDiary().getUser().equals(user);
			}
			return true;
		}).collect(Collectors.toList());
		model.addAttribute("groupDiaryList", visibleDiaries);

		// turn 자동 넘기기
		if (group.getLastTurnDate() == null || group.getLastTurnDate().isBefore(today)) {
			// 오늘로 업데이트
			group.setLastTurnDate(today);

			int nextTurn = (group.getCurrentTurn() + 1) % users.size();
			group.setCurrentTurn(nextTurn);
		}

		model.addAttribute("group", group);
		model.addAttribute("users", users);

		if (turnMessage != null && !turnMessage.isEmpty()) {
			model.addAttribute("turnMessage", turnMessage);
		}

		List<Follow> followers = followRepository.findByFollowing(user);
		List<Follow> followings = followRepository.findByFollower(user);
		model.addAttribute("followers", followers);
		model.addAttribute("followings", followings);

		// 팔로워 수와 팔로잉 수를 계산해서 모델에 추가
		long followerCount = followRepository.countByFollowing(user);
		long followingCount = followRepository.countByFollower(user);
		model.addAttribute("followerCount", followerCount);
		model.addAttribute("followingCount", followingCount);

		return "group/group";
	}

	// 그룹 가입하기 화면
	@PostMapping("group/join/{id}")
	public String groupJoin_post(Principal principal, @PathVariable("id") Long group_id,
			RedirectAttributes redirectAttributes) throws IOException {
		String email = principal.getName();
		User user = userService.findByEmail(email);
		int result = joinToGroupService.joinToGroup(group_id, user.getId());

		if (result == 0) {
			redirectAttributes.addFlashAttribute("message", "가입 성공!");
		} else if (result == 1) {
			redirectAttributes.addFlashAttribute("message", "그룹은 8명을 초과할 수 없습니다.");
		} else if (result == 2) {
			redirectAttributes.addFlashAttribute("message", "이미 가입된 그룹입니다.");
		}

		return "redirect:/group/main";
	}

	// 그룹 수정하기
	@PostMapping("group/update/{id}")
	public String groupUpdate_post(@PathVariable("id") Long group_id, Principal principal,
			@RequestParam String group_title, @RequestParam String group_content) {

		YL3Group group = groupService.findById(group_id);
		group.setGroup_title(group_title);
		group.setGroup_content(group_content);

		groupService.updateGroup(group);
		return "redirect:/mypage";
	}

	// 그룹 생성하기 화면
	@PostMapping("group/insert")
	public String groupInsert_post(Principal principal, @RequestParam String group_title,
			@RequestParam String group_content) {

		String username = principal.getName();
		User user = userService.findByEmail(username);

		YL3Group group = new YL3Group();
		group.setGroup_title(group_title);
		group.setGroup_content(group_content);
		Badge badge = badgeService.findById(1l).orElseThrow();
		group.setBadge(badge);
		group.setGroup_leader(user);

		groupService.insertGroup(group);
		return "redirect:/mypage";
	}

	// 그룹 탈퇴하기 화면
	@PostMapping("group/leave/{id}")
	public String groupLeave_Post(Principal principal, @PathVariable("id") Long group_id,
			RedirectAttributes redirectAttributes) {
		String email = principal.getName();
		User user = userService.findByEmail(email);

		YL3Group group = groupService.findById(group_id);

		int result = joinToGroupService.leaveGroup(group, user);
		if (result == 0) {
			redirectAttributes.addFlashAttribute("message", " 탈퇴되었습니다. ");
		} else if (result == 1) {
			redirectAttributes.addFlashAttribute("message", " 해당 그룹에 가입되어 있지 않습니다.");
		} else if (result == 2) {
			redirectAttributes.addFlashAttribute("message", " 그룹 리더는 그룹을 탈퇴할 수 없습니다.");
		}

		return "redirect:/group/main";
	}

	// 그룹 삭제하기 화면
	@PostMapping("group/delete/{id}")
	public String groupDelete_post(Principal principal, @PathVariable("id") Long group_id, Model model) {

		String email = principal.getName();
		User user = userService.findByEmail(email);
		YL3Group group = groupService.findById(group_id);

		// 그룹 - 다이어리 연결 삭제하기
		List<GroupDiary> diaryList = groupDiaryService.findByGroupId(group);
		for (GroupDiary diary : diaryList) {
			groupDiaryService.deleteGroupDiary(diary);
		}
		groupService.deleteGroup(group);
		return "redirect:/main";
	}

	// 그룹 검색
	@GetMapping(value = "/search/group/{search}", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public Map<String, Object> searchGroup(@PathVariable String search) {
		Map<String, Object> result = new HashMap<>();
		try {
			YL3Group group = groupService.findByGroupTitle(search);

			if (group != null) {
				Map<String, Object> groupDetails = new HashMap<>();
				groupDetails.put("group_title", group.getGroup_title());
				groupDetails.put("badge_title", group.getBadge() != null ? group.getBadge().getBadge_title() : "없음");

				result.put("groups", groupDetails);
				result.put("status", "success");
			} else {
				result.put("status", "error");
				result.put("message", "해당 그룹을 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("status", "error");
			result.put("message", e.getMessage());
		}
		return result;
	}

	@GetMapping("group/{g_id}/follow/{u_id}")
	public String follow(@PathVariable("g_id") Long group_id, @PathVariable("u_id") Long user_id, Principal principal) {
		User findfollower = userService.findByEmail(principal.getName());
		User follower = userService.findById(findfollower.getId());
		User following = userService.findById(user_id);
		followService.follow(follower, following);
		return "redirect:/group/group/" + group_id;
	}

	// 그룹 강퇴시키기
	@GetMapping("/group/{g_id}/kick/{u_id}")
	public String kickUser(@PathVariable("u_id") Long user_id, @PathVariable("g_id") Long group_id,
			RedirectAttributes redirectAttributes) {

		YL3Group group = groupService.findById(group_id);
		User user = userService.findById(user_id);

		int result = joinToGroupService.leaveGroup(group, user);
		if (result == 0) {
			redirectAttributes.addFlashAttribute("message", " 탈퇴되었습니다. ");
		} else if (result == 1) {
			redirectAttributes.addFlashAttribute("message", " 해당 그룹에 가입되어 있지 않습니다.");
		} else if (result == 2) {
			redirectAttributes.addFlashAttribute("message", " 그룹 리더는 그룹을 탈퇴할 수 없습니다.");
		}

		return "redirect:/group/group/" + group_id;
	}

}
