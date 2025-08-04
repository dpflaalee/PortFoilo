package com.yoonlee3.diary.template;

import java.util.Optional;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yoonlee3.diary.openScope.OpenScope;

@Service
public class TemplateService {
	
    @Autowired TemplateRepositroy templateRepositroy;
	
    @PostConstruct
    public void initializeOpenScopes() {
        Template privateTemplate1 = new Template();
        privateTemplate1.setTemplate_title("theme1");
        
        Template privateTemplate2 = new Template();
        privateTemplate2.setTemplate_title("theme2");
        
        Template privateTemplate3 = new Template();
        privateTemplate3.setTemplate_title("theme3");
        
        templateRepositroy.save(privateTemplate1);
        templateRepositroy.save(privateTemplate2);
        templateRepositroy.save(privateTemplate3);
    }
	
    public Template findTempalteById(Long template_id ) {
	return templateRepositroy.findTempalteById(template_id);
    }
}
