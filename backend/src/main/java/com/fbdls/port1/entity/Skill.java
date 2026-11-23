package com.fbdls.port1.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sid;

    @Column(name = "skill_name")
    private String skillName;
    @Column(name = "skill_desc")
    private String skillDesc;


}
