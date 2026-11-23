package com.fbdls.port1.controller;

import com.fbdls.port1.entity.Reply;
import com.fbdls.port1.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReplyController {


    @Autowired
    ReplyService replyService;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/replyList")
    public List<Reply> replyList() {
        return replyService.getAllReply();
    }

    @PostMapping("/addReply")
    public ResponseEntity<String> addReply(@RequestBody Reply reply) {

        String hash = passwordEncoder.encode(reply.getUserPwd());

        reply.setUserPwd(hash);

        replyService.saveReply(reply);
        return ResponseEntity.ok("댓글 등록 성공");
    }

    @GetMapping("/replyLatest")
    public List<Reply> replyLatest() {
        return replyService.findTop3ByOrderByRidDesc();
    }


    @PostMapping("deleteReply")
    public ResponseEntity<String> deleteReply(@RequestBody Reply reply) {

        Reply replyPwdChk = replyService.findByRid(reply.getRid());

        if (replyPwdChk == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("댓글이 존재하지 않습니다.");
        }

        if (!passwordEncoder.matches(reply.getUserPwd(), replyPwdChk.getUserPwd())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("비밀번호가 일치하지 않습니다.");
        }

        replyService.deleteReply(reply.getRid());
        return ResponseEntity.ok("삭제 완료!");
    }

    @PostMapping("deleteAll")
    public ResponseEntity<String> deleteAll() {
        replyService.deleteAll();

        return ResponseEntity.ok("삭제 완료");
    }

}
