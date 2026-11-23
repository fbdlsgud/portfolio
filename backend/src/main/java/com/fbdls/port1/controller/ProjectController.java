package com.fbdls.port1.controller;

import com.fbdls.port1.entity.Project;
import com.fbdls.port1.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProjectController {

    @Autowired
    ProjectService projectService;

    @GetMapping("/projectList")
    public List<Project> getProjectList() {
        return projectService.getAllProject();
    }

    @PostMapping("/addProject")
    public ResponseEntity<String> addProject(@RequestBody Project project) {
        Project p = projectService.saveProject(project);

        return ResponseEntity.ok(p.getTitle());
    }

    @PutMapping("/editProject")
    public ResponseEntity<String> editProject(@RequestBody Project project) {

        Project p = projectService.saveProject(project);

        return ResponseEntity.ok(p.getTitle());
    }

    @DeleteMapping("/projectDelete/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable int id) {
        projectService.deleteById(id);

        return ResponseEntity.ok("Project deleted successfully 삭제");
    }


    @GetMapping("/projectLatest")
    public List<Project> getProjectLatest() {
        return projectService.findTop3ByOrderByIdDesc();
    }

}
