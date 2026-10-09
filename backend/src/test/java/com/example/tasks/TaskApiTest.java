package com.example.tasks;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskApiTest {
    @Autowired MockMvc mvc;
    @Autowired TaskRepository repository;

    @BeforeEach void clear() { repository.deleteAll(); }

    @Test void createsAndListsTasks() throws Exception {
        mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"  Example  \"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.title").value("Example"));
        mvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Example"));
    }

    @Test void rejectsBlankTitle() throws Exception {
        mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"  \"}"))
            .andExpect(status().isBadRequest());
    }

    @Test void rejectsTooLongTitle() throws Exception {
        mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"" + "a".repeat(201) + "\"}"))
            .andExpect(status().isBadRequest());
    }
}
