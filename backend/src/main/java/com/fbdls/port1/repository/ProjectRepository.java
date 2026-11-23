package com.fbdls.port1.repository;

import com.fbdls.port1.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findTop3ByOrderByIdDesc();
}
