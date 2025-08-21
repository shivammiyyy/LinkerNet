package com.LinkerNet.LinkerNet.service;


import com.LinkerNet.LinkerNet.model.Message;
import com.LinkerNet.LinkerNet.repository.ChatRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepo chatRepository;

    public ChatService(ChatRepo chatRepository) {
        this.chatRepository = chatRepository;
    }

    // Save a message
    public Message saveMessage(String sender, String content) {
        Message message = new Message(sender, content, LocalDateTime.now());
        return chatRepository.save(message);
    }

    // Fetch old messages (e.g., when someone joins)
    public List<Message> getAllMessages() {
        return chatRepository.findAll();
    }
}


