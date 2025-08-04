package com.yoonlee3.diary.like;

import java.security.Principal;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yoonlee3.diary.user.User;
import com.yoonlee3.diary.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class LikeController {
	
    private final LikeService likeService;
    private final UserRepository userRepository;

    // 좋아요
    @PostMapping("/diary/like")
    public String toggleLike(@RequestParam Long diaryId, Principal principal) {
        if (principal != null) {
            String email = principal.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("사용자 정보가 없습니다."));

            boolean isLiked = likeService.toggleLike(diaryId, user.getId());

            return "redirect:/mainTemplate/detail/" + diaryId;
        }
        return "redirect:user/login";
    }
    
    @PostMapping("group/diary/like")
    public String GtoggleLike(@RequestParam Long diaryId, Principal principal) {
        if (principal != null) {
            String email = principal.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("사용자 정보가 없습니다."));

            boolean isLiked = likeService.toggleLike(diaryId, user.getId());

            return "redirect:/group/groupDiaryDetail/" + diaryId;
        }
        return "redirect:user/login";
    }   
    
    // 좋아요 상태 확인
    @GetMapping("/status")
    @ResponseBody
    public boolean isLiked(@RequestParam Long diaryId, Principal principal) {
        if (principal != null) {
            String email = principal.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("사용자 정보가 없습니다."));
            return likeService.isLiked(diaryId, user.getId());
        }
        return false;
    }
}
