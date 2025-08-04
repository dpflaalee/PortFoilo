package com.yoonlee3.diary.like;

import java.io.Serializable;
import java.util.Objects;

public class LikesId implements Serializable {
	
    private Long diary;
    private Long user;

    public LikesId() {}

    public LikesId(Long diary, Long user) {
        this.diary = diary;
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LikesId)) return false;
        LikesId likeId = (LikesId) o;
        return Objects.equals(diary, likeId.diary) &&
               Objects.equals(user, likeId.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(diary, user);
    }
}
