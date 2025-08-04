package com.yoonlee3.diary.user;

import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yoonlee3.diary.follow.BlockService;
import com.yoonlee3.diary.follow.FollowService;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    private final FollowService followService;
    private final UserRepository userRepository;
    private final BlockService blockService;

    @Autowired
    public ProfileController(FollowService followService, UserRepository userRepository, BlockService blockService) {
        this.followService = followService;
        this.userRepository = userRepository;
        this.blockService = blockService;
    }

    @GetMapping("/{userId}")
    public String getUserProfile(@PathVariable Long userId, Principal principal, Model model) {
        // 프로필 사용자 찾기
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        User viewer = null;
        if (principal != null) {
            viewer = userRepository.findByUsername(principal.getName());
        }

        // 차단 여부 확인
        boolean isBlocked = false;
        if (viewer != null) {
            isBlocked = blockService.isBlocked(viewer, targetUser);
        }
        
        UserProfileDto userProfile = followService.getUserProfile(viewer, targetUser);

        // 모델에 사용자 프로필 정보 추가
        model.addAttribute("userProfile", userProfile);
        model.addAttribute("viewer", viewer);

        return "profile"; 
    }
    
}
