package com.fbdls.port1.repository;


import com.fbdls.port1.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {


    List<Reply> findTop3ByOrderByRidDesc();
}
