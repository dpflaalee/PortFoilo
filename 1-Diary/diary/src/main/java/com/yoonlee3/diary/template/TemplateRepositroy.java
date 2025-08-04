package com.yoonlee3.diary.template;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TemplateRepositroy extends JpaRepository<Template, Long> {

	@Query("select t from Template t where t.id= :template_id")
	Template findTempalteById(Long template_id);
	
}
