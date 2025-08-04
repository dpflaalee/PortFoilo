package com.ssdam.tripPaw.checklist;

import java.util.List;

import lombok.Data;

@Data
public class RoutineTemplateRequest {
    private Long memberId;
    private Long memberTripPlanId;
    private List<Long> templateIds;
    private String title;
    private boolean isSaved; 
    public boolean getIsSaved() {
        return isSaved;
    }
}
