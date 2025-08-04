package com.yoonlee3.diary.openScope;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OpenScopeRepository extends JpaRepository<OpenScope, Long> {

	@Query("select os from OpenScope os where os.id = :open_scope_id")
	OpenScope findByOpenScopeId(Long open_scope_id);

}
