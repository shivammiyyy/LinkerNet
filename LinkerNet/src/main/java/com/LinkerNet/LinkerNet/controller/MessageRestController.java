package com.LinkerNet.LinkerNet.controller;

import com.LinkerNet.LinkerNet.model.Message;
import com.LinkerNet.LinkerNet.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageRestController {

    private final ChatService chatService;

    public MessageRestController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("")
    public List<Message> getAllMessages() {
        return chatService.getAllMessages();
    }
}
