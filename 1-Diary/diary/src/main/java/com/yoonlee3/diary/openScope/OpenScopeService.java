package com.yoonlee3.diary.openScope;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OpenScopeService {

    @Autowired
    OpenScopeRepository openScopeRepository;

    @PostConstruct
    public void initializeOpenScopes() {
        // 이미 공개범위가 존재하는지 확인 (중복 방지)
        if (openScopeRepository.count() == 0) {
            // "나만보기"
            OpenScope privateScope = new OpenScope();
            privateScope.setOpenScope_title("나만보기");
            privateScope.setOpenScope_value("PRIVATE");

            // "친구공개"
            OpenScope friendsScope = new OpenScope();
            friendsScope.setOpenScope_title("친구공개");
            friendsScope.setOpenScope_value("FRIENDS");

            // "그룹공개"
            OpenScope groupScope = new OpenScope();
            groupScope.setOpenScope_title("그룹공개");
            groupScope.setOpenScope_value("GROUP");

            // "전체공개"
            OpenScope publicScope = new OpenScope();
            publicScope.setOpenScope_title("전체공개");
            publicScope.setOpenScope_value("PUBLIC");

            openScopeRepository.save(privateScope);
            openScopeRepository.save(friendsScope);
            openScopeRepository.save(groupScope);
            openScopeRepository.save(publicScope);

            System.out.println("초기 공개 범위가 데이터베이스에 저장되었습니다.");
        }
    }
	
    public OpenScope findOpenScope(OpenScope openScope) {
	return openScopeRepository.findByOpenScopeId(openScope.getId());
    }
    
    public OpenScope findOpenScopeById(Long open_scope_id) {
	return openScopeRepository.findByOpenScopeId(open_scope_id);
    } 

}
