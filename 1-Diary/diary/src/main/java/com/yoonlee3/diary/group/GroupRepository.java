package com.yoonlee3.diary.group;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface GroupRepository extends JpaRepository<YL3Group, Long> {

	@Query("select g from YL3Group g where g.group_title = :group_title")
	YL3Group findByGroupTitle(String group_title);

	@Query("select g from YL3Group g where g.group_leader = :user_id")
	List<YL3Group> findByGroupLeader(Long user_id);

	@Modifying
	@Transactional
	@Query("update YL3Group g set g.badge.id = g.badge.id +1 where g.id = :group_id")
	int updateGroupBadge(@Param("group_id") Long group_id);

	@Modifying
	@Transactional
	@Query("update YL3Group g set g.group_title = :group_title, group_content = :group_content"
			+ " where g.id = :group_id")
	int updateGroup(String group_title, String group_content, Long group_id);

	@Modifying
	@Transactional
	@Query("delete from YL3Group g where g.id = :group_id and g.group_leader.id = :user_id")
	int deleteGroup(Long group_id, Long user_id);

}
