package com.example.awsmysql.controller;

import com.example.awsmysql.dto.TaskRequest;
import com.example.awsmysql.dto.TaskResponse;
import com.example.awsmysql.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    // GET /api/tasks/user/{userId}
    @GetMapping("/user/{userId}")
    public List<TaskResponse> getTasksByUserId(
            @PathVariable Long userId
    ) {

        return taskService.getTasksByUserId(userId);
    }


    // POST /api/tasks/user/{userId}
    @PostMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(
            @PathVariable Long userId,
            @RequestBody TaskRequest request
    ) {

        return taskService.createTask(userId, request);
    }


    // PUT /api/tasks/{taskId}
    @PutMapping("/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskRequest request
    ) {

        return taskService.updateTask(taskId, request);
    }


    // DELETE /api/tasks/{taskId}
    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(
            @PathVariable Long taskId
    ) {

        taskService.deleteTask(taskId);
    }
}
