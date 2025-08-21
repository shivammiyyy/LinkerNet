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

    // When client sends message to /app/sendMessage
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")  // broadcast to all clients subscribed to /topic/messages
    public Message broadcastMessage(Message message) {
        // Save to DB
        chatService.saveMessage(message.getSender(), message.getContent());

        // Return message to be broadcasted
        return message;
    }
}



