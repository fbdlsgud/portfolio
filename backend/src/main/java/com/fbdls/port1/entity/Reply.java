package com.fbdls.port1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rid;

    private String userId;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String userPwd;

    private String reply;

    private String avatar;


}
