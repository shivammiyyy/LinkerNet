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

    // Save a message, validating input
    public Message saveMessage(String sender, String content) {
        if (sender == null || sender.trim().isEmpty() || content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Sender and content must not be empty");
        }
        Message message = new Message(sender, content, LocalDateTime.now());
        return chatRepository.save(message);
    }

    // Fetch all messages (for history, etc.)
    public List<Message> getAllMessages() {
        return chatRepository.findAll();
    }
}
