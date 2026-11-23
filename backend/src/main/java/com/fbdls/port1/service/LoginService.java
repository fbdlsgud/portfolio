package com.fbdls.port1.service;

import com.fbdls.port1.entity.Login;
import com.fbdls.port1.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    public Optional<Login> vaildLogin(String loginId, String loginPwd) {
        return loginRepository.findByLoginIdAndLoginPwd(loginId,loginPwd);

    }
}


