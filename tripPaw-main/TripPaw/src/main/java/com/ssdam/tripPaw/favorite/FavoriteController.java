package com.ssdam.tripPaw.favorite;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ssdam.tripPaw.domain.Favorite;
import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.dto.FavoritePlaceDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/favorite")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 즐겨찾기 등록
    @PostMapping("/add")
    public ResponseEntity<String> addFavorite(@RequestBody Favorite favorite) {
        favoriteService.addFavorite(favorite);
        return ResponseEntity.ok("즐겨찾기에 추가되었습니다.");
    }

    // 즐겨찾기 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<String> removeFavorite(@RequestBody Favorite favorite) {
        favoriteService.removeFavorite(favorite);
        return ResponseEntity.ok("즐겨찾기에서 삭제되었습니다.");
    }

    // 단건 즐겨찾기 여부 확인
    @GetMapping("/check")
    public ResponseEntity<Favorite> checkFavorite(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            @RequestParam Long memberId
    ) {
        try {
            Favorite favorite = new Favorite();
            favorite.setTargetId(targetId);
            favorite.setTargetType(targetType);
            Member member = new Member();
            member.setId(memberId);
            favorite.setMember(member);

            Favorite found = favoriteService.getFavorite(favorite);
            return found != null ? ResponseEntity.ok(found) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace(); // 로그에 상세 출력
            return ResponseEntity.internalServerError().build();
        }
    }

    // 특정 유저의 장소 즐겨찾기 목록
    @GetMapping("/member/place/{memberId}")
    public ResponseEntity<List<FavoritePlaceDto>> getFavoritePlaces(@PathVariable Long memberId) {
        List<FavoritePlaceDto> dtos = favoriteService.getFavoritePlacesByMember(memberId);
        System.out.println("FavoritePlaceDto : " + dtos);
        return ResponseEntity.ok(dtos);
    }
    

}
