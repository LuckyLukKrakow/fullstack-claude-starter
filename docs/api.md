# HTTP contract

Development: Vite on http://127.0.0.1:5173 proxies `/api` to Java on port 8080.
GET `/api/tasks`: 200 and an array of `{ "id": 1, "title": "Example" }`, ordered by id.
POST `/api/tasks`: JSON `{ "title": "Example" }`; 201 and the created task.
Title: required string, nonblank, maximum 200 characters; surrounding whitespace is stripped.
Invalid input: 400. Response error bodies are not yet a stable application contract.
H2 is in memory; restart deletes tasks. No authentication, pagination or multiuser isolation.
The TypeScript Task type mirrors the response DTO. Update both when changing this contract.
