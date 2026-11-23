package com.fbdls.port1.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Project {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;


    @Lob
    @Column(name = "main_desc", columnDefinition = "TEXT")
    private String mainDesc;

    @Column(name = "sub_desc")
    private String subDesc;

    private String skill;
    private String people;
    private String date;
}
