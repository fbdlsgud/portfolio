package com.fbdls.port1.controller;


import com.fbdls.port1.service.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class VisitController {

    @Autowired
    private VisitService visitService;


    @GetMapping("/visit")
    public void visit() {

        visitService.increaseVisit();


    }


    @GetMapping("/visitCount")
    public Map<String, Integer> visitCount() {
        int today = visitService.getTodayVisitCount();
        int total = visitService.getTotalCount();

        Map<String, Integer> result = new HashMap<>();
        result.put("today", today);
        result.put("total", total);

        return  result;

    }




}
