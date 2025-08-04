package com.yoonlee3.diary.group;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yoonlee3.diary.groupDiary.GroupDiary;
import com.yoonlee3.diary.groupDiary.GroupDiaryService;
import com.yoonlee3.diary.groupHasUser.JoinToGroupService;
import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserService;

@Service
public class GroupService {

	@Autowired
	GroupRepository groupRepository;
	@Autowired
	JoinToGroupService joinToGroupService;
	@Autowired
	UserService userService;
	@Autowired
	GroupDiaryService groupDiaryService;

	public void insertGroup(YL3Group group) {
		YL3Group save = groupRepository.save(group);
		User user = save.getGroup_leader();
		joinToGroupService.joinToGroup(save.getId(), user.getId());
	}

	public List<YL3Group> findAll() {
		return groupRepository.findAll();
	}

	public YL3Group findByGroupTitle(String group_title) {
		return groupRepository.findByGroupTitle(group_title);
	}

	public YL3Group findById(Long group_id) {
		return groupRepository.findById(group_id).orElseThrow(() -> new RuntimeException("존재하지 않는 그룹입니다."));
	}

	public int updateGroupBadge(Long group_id) {
		return groupRepository.updateGroupBadge(group_id);
	}

	public int updateGroup(YL3Group group) {
		return groupRepository.updateGroup(group.getGroup_title(), group.getGroup_content(), group.getId());
	}

	public int deleteGroup(YL3Group group) {
		YL3Group findgroup = groupRepository.findById(group.getId())
				.orElseThrow(() -> new RuntimeException("존재하지 않는 그룹입니다."));
		// 그룹안에 있는 유저들 가져오기
		List<User> users = group.getUsers();
		// 리더가 아닌 유저들 그룹 떠나게 하기
		if (!users.contains(group.getGroup_leader())) {
			for (User u : users) {
				joinToGroupService.leaveGroup(group, u);
			}
		}

		return groupRepository.deleteGroup(findgroup.getId(), findgroup.getGroup_leader().getId());
	}

}
