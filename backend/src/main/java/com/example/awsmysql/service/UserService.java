package com.example.awsmysql.service;

import com.example.awsmysql.dto.CreateUserRequest;
import com.example.awsmysql.dto.UserResponse;
import com.example.awsmysql.entity.User;
import com.example.awsmysql.exception.UserNotFoundException;
import com.example.awsmysql.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse createUser(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "User already exists with email: " + request.email()
            );
        }

        User user = new User(
                request.name(),
                request.email(),
                request.city()
        );

        return UserResponse.from(
                userRepository.save(user)
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return UserResponse.from(user);
    }

    public UserResponse updateUser(
            Long id,
            CreateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        user.setName(request.name());
        user.setEmail(request.email());
        user.setCity(request.city());

        return UserResponse.from(
                userRepository.save(user)
        );
    }

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }

        userRepository.deleteById(id);
    }
}
