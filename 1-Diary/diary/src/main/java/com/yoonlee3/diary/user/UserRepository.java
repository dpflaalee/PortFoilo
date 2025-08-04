package com.yoonlee3.diary.user;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);
	Optional<User> findByResetToken(String resetToken);

	@Query("select u from User u where u.username= :username")
	User findByUsername(String username);
	
	@Query("select u from User u where u.username= :username")
	List<User> findUsersByUsername(String username);
	
    	@Query("select case when count(u) > 0 then true else false end from User u where u.username = :username")
    	boolean existsByUsername(String username);

	@Modifying
	@Transactional
	@Query("update User u set u.username= :username where u.id= :user_id ")
	int updateById(Long user_id, String username);

	@Modifying
	@Transactional
	@Query("update User u set u.password= :password where u.email= :email ")
	int updateByIdAndPassword(String password, String email);

	List<User> findByUsernameContaining(String keyword);
	
	List<User> findByUsernameContainingIgnoreCase(String keyword);
}
