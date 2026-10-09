# Backend
Java 21, Maven, Spring Boot. `TaskController` → `TaskService` → `TaskRepository`.
Use validated request records and response DTOs. Transactions belong in services.
Run `mvn -B verify` here. H2 and create-drop are demo-only: data disappears on shutdown.
