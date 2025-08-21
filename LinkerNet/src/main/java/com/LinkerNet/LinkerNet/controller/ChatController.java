package com.LinkerNet.LinkerNet.controller;

import com.LinkerNet.LinkerNet.model.Message;
import com.LinkerNet.LinkerNet.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Incoming messages sent to /app/sendMessage
    @MessageMapping("/sendMessage")
    // Broadcast to all subscribed clients on /topic/messages
    @SendTo("/topic/messages")
    public Message broadcastMessage(Message message) {
        chatService.saveMessage(message.getSender(), message.getContent());
        return message;
    }
}
