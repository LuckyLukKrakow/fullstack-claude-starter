package com.example.tasks;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) { this.repository = repository; }

    public List<TaskResponse> list() {
        return repository.findAll(Sort.by("id")).stream().map(TaskResponse::from).toList();
    }

    @Transactional
    public TaskResponse create(String title) {
        return TaskResponse.from(repository.save(new TaskEntity(title.strip())));
    }
}
