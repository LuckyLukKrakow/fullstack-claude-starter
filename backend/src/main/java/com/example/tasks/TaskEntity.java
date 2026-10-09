package com.example.tasks;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    protected TaskEntity() {}

    public TaskEntity(String title) { this.title = title; }
    public Long getId() { return id; }
    public String getTitle() { return title; }
}
