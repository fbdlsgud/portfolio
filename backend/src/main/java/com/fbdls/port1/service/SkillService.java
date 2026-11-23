package com.fbdls.port1.service;


import com.fbdls.port1.entity.Skill;
import com.fbdls.port1.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;


    public List<Skill> getAllSkill() {
        return skillRepository.findAll();
    }


    public Skill saveSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public void deleteById(Integer sid) {
        skillRepository.deleteById(sid);

    }
}
