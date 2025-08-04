package com.ssdam.tripPaw.review;

import java.util.List;

public class PagedResponse<T> {
    private List<T> content;
    private int totalElements;
    private int totalPages;

    public PagedResponse() {}

    public PagedResponse(List<T> content, int totalElements, int size) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = (int) Math.ceil((double) totalElements / size);
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public int getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(int totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}
