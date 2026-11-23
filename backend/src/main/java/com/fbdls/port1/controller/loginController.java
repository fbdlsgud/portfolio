package com.fbdls.port1.controller;

import com.fbdls.port1.entity.Login;
import com.fbdls.port1.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class loginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
         return loginService.vaildLogin(login.getLoginId(),login.getLoginPwd())
                 .map(user -> {
                     Map<String, Object> result = new HashMap<>();
                     result.put("status", "ok");
                     result.put("username", user.getUsername());
                     result.put("loginId", user.getLoginId());
                     return ResponseEntity.ok(result);
                 })
                 .orElseGet(() -> ResponseEntity
                         .status(HttpStatus.UNAUTHORIZED)
                         .body(Map.of("status", "fail", "message", "로그인 실패")));
    }

}
