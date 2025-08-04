package com.yoonlee3.diary.groupHasUser;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yoonlee3.diary.group.YL3Group;
import com.yoonlee3.diary.group.GroupRepository;
import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserService;

@Service
public class JoinToGroupService {

	private final GroupRepository groupRepository;
	private final UserService userService;

	@Autowired
	public JoinToGroupService(GroupRepository groupRepository, UserService userService) {
		super();
		this.groupRepository = groupRepository;
		this.userService = userService;
	}

	// 그룹 참여하기
	@Transactional
	public int joinToGroup(Long group_id, Long user_id) {
		YL3Group group = groupRepository.findById(group_id).orElseThrow(()-> new RuntimeException("해당 그룹은 존재하지 않습니다."));
		User user = userService.findById(user_id);

		int currentSize = group.getUsers().size();
		if (currentSize >= 8) {
			return 1;
		}
		if (group.getUsers().contains(user)) {
			return 2;
		} 

		group.getUsers().add(user);
		user.getGroups().add(group);
		return 0;
	}

	// 그룹 떠나기
	@Transactional
	public int leaveGroup(YL3Group group, User user) {
		YL3Group findgroup = groupRepository.findById(group.getId()).orElseThrow(()-> new RuntimeException("해당 그룹은 존재하지 않습니다."));
		User finduser = userService.findById(user.getId());

		if (!findgroup.getUsers().contains(finduser)) {
			return 1;
		} else if (findgroup.getGroup_leader().equals(finduser)) {
			return 2;
		} else {
			findgroup.getUsers().remove(finduser);
			finduser.getGroups().remove(findgroup);
			return 0;
		}
	}

	// 그룹 수 확인하기
	@Transactional
	public int checkGroupSize(Long group_id) {
		YL3Group group = groupRepository.findById(group_id).orElseThrow(()-> new RuntimeException("해당 그룹은 존재하지 않습니다."));
		return group.getUsers().size();
	}
	
	// 유저가 속한 그룹 불러오기
	@Transactional
	public List<YL3Group> findGroupById(Long user_id){
		User user = userService.findById(user_id);
		return user.getGroups();
	}
	
}
