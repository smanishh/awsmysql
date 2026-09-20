package com.example.awsmysql.dto;

import java.time.LocalDateTime;

public class TaskResponse {

    private Long id;

    private Long userId;

    private String title;

    private boolean completed;
    private LocalDateTime completedAt;

    public TaskResponse(
            Long id,
            Long userId,
            String title,
            boolean completed,
            LocalDateTime completedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.completed = completed;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}

