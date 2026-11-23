package com.fbdls.port1.service;

import com.fbdls.port1.entity.Project;
import com.fbdls.port1.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProject() {
        return projectRepository.findAll();
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteById(int id) {
        projectRepository.deleteById(id);
    }

    public List<Project> findTop3ByOrderByIdDesc() {
        return  projectRepository.findTop3ByOrderByIdDesc();
    }
}
