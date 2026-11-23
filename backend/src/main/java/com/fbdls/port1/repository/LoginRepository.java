package com.fbdls.port1.repository;

import com.fbdls.port1.entity.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository<Login, Integer> {
    Optional<Login> findByLoginIdAndLoginPwd(String loginId, String loginPwd);
}
