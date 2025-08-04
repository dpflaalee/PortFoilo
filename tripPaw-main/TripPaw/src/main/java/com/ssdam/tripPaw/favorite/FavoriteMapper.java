package com.ssdam.tripPaw.favorite;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.ssdam.tripPaw.domain.Favorite;

@Mapper
public interface FavoriteMapper {

    // 즐겨찾기 등록
    int insertFavorite(Favorite favorite);

    // 즐겨찾기 삭제
    int deleteFavorite(Favorite favorite);

    // 특정 즐겨찾기 조회
    Favorite selectFavorite(Favorite favorite);

    // 특정 유저의 즐겨찾기 목록
    List<Favorite> selectFavoritesByMemberId(Long memberId);
}
