package com.fbdls.port1.repository;


import com.fbdls.port1.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Integer> {

    Optional <Visit> findByVisitDate(LocalDate visitDate);
}
