package com.example.awsmysql.service;


import com.example.awsmysql.dto.TaskRequest;
import com.example.awsmysql.dto.TaskResponse;
import com.example.awsmysql.entity.Task;
import com.example.awsmysql.entity.User;
import com.example.awsmysql.repository.TaskRepository;
import com.example.awsmysql.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            UserRepository userRepository
    ) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }


    // GET tasks for user
    public List<TaskResponse> getTasksByUserId(Long userId) {

        // Make sure user exists
        userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return taskRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // ADD task
    public TaskResponse createTask(
            Long userId,
            TaskRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Task task = new Task();

        task.setTitle(request.getTitle());

        task.setCompleted(request.isCompleted());

        task.setUser(user);

        Task savedTask = taskRepository.save(task);

        return toResponse(savedTask);
    }


    // MODIFY task
    public TaskResponse updateTask(Long taskId, TaskRequest request) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found")
                );

        task.setTitle(request.getTitle());

        // Task is being marked complete
        if (!task.isCompleted() && request.isCompleted()) {

            task.setCompleted(true);
            task.setCompletedAt(LocalDateTime.now());
        }

        // Task is being marked incomplete again
        else if (task.isCompleted() && !request.isCompleted()) {

            task.setCompleted(false);
            task.setCompletedAt(null);
        }

        Task savedTask = taskRepository.save(task);

        return new TaskResponse(
                savedTask.getId(),
                savedTask.getUser().getId(),
                savedTask.getTitle(),
                savedTask.isCompleted(),
                savedTask.getCompletedAt()
        );
    }



    // DELETE task
    public void deleteTask(Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found")
                );

        taskRepository.delete(task);
    }


    private TaskResponse toResponse(Task task) {

        return new TaskResponse(
                task.getId(),
                task.getUser().getId(),
                task.getTitle(),
                task.isCompleted(),
                task.getCompletedAt()
        );
    }
}
