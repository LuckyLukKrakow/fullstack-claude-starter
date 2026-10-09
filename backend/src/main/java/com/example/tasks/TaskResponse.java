package com.example.tasks;

public record TaskResponse(Long id, String title) {
    static TaskResponse from(TaskEntity task) {
        return new TaskResponse(task.getId(), task.getTitle());
    }
}
