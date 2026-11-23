package com.fbdls.port1.service;


import com.fbdls.port1.entity.Visit;
import com.fbdls.port1.repository.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;

@Service
public class VisitService {

    @Autowired
    private VisitRepository visitRepository;

    public void increaseVisit(){

        LocalDate now = LocalDate.now(ZoneId.of("Asia/Seoul"));

        Visit visit = visitRepository.findByVisitDate(now)
                .orElseGet(()->{
                    Visit newVisit = new Visit();
                    newVisit.setVisitDate(now);
                    newVisit.setCount(0);
                    return newVisit;
                });

        visit.setCount(visit.getCount()+1);
        visitRepository.save(visit);
    }

    public int getTodayVisitCount(){
        return visitRepository.findByVisitDate(LocalDate.now(ZoneId.of("Asia/Seoul")))
                .map(Visit::getCount)
                .orElse(0);
    }

    public int getTotalCount(){
        return visitRepository.findAll().stream()
                .mapToInt(Visit::getCount)
                .sum();
    }



}
