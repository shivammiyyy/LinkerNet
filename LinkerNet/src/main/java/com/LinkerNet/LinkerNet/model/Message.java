package com.LinkerNet.LinkerNet.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String sender;
    @Setter
    private String content;
    @Setter
    private LocalDateTime timestamp;

    public Message() {}

    public Message(String sender, String content, LocalDateTime timestamp) {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Getters & setters
    public Long getId() { return id; }
    public String getSender() { return sender; }

    public String getContent() { return content; }

    public LocalDateTime getTimestamp() { return timestamp; }
}

