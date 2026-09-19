package com.example.awsmysql.dto;

import com.example.awsmysql.entity.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        String city,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCity(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}

