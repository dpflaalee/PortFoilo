package com.ssdam.tripPaw.search;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ssdam.tripPaw.dto.SearchResultDto;

import lombok.RequiredArgsConstructor;


@Controller
@RequiredArgsConstructor
public class SearchController {
     
    private final SearchService searchService;

    @GetMapping("/search")
    @ResponseBody
    public SearchResultDto search(
    	    @RequestParam String keyword,
    	    @RequestParam(required = false) String region,
    	    @RequestParam(defaultValue = "0") int offset, //offset 추가
    	    @RequestParam(defaultValue = "0") int tripPlanOffset
    	) {
        return searchService.search(keyword, region, offset, tripPlanOffset); 
    	}
}
