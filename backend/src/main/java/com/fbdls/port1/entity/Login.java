package com.fbdls.port1.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Login {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lid;

    private String username;
    @Column(name = "login_id")
    private String loginId;
    @Column(name = "login_pwd")
    private String loginPwd;

}
