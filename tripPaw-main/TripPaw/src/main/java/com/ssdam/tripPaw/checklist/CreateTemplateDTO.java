package com.ssdam.tripPaw.checklist;

import java.util.List;

import com.ssdam.tripPaw.domain.CheckTemplate;
import com.ssdam.tripPaw.domain.Member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTemplateDTO {
    private String title;
    private int type;
    private Long memberId;
    private List<Long> selectedItemIds;

    public CheckTemplate toEntity() {
        CheckTemplate template = new CheckTemplate();
        template.setTitle(this.title);
        template.setType(this.type);

        Member member = new Member();
        member.setId(this.memberId);
        template.setMember(member);

        return template;
    }
}
