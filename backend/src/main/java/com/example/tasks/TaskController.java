package com.example.tasks;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) { this.service = service; }

    @GetMapping
    public List<TaskResponse> list() { return service.list(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody CreateTask request) {
        return service.create(request.title());
    }

    public record CreateTask(@NotBlank @Size(max = 200) String title) {}
}
