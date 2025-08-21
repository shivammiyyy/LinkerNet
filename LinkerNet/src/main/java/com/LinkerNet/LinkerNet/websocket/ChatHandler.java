package com.LinkerNet.LinkerNet.websocket;

import com.LinkerNet.LinkerNet.model.Message;
import com.LinkerNet.LinkerNet.service.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashSet;
import java.util.Set;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = new HashSet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ChatService chatService;

    public ChatHandler(ChatService chatService) {
        this.chatService = chatService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("New connection: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Message chatMessage = objectMapper.readValue(message.getPayload(), Message.class);

        // Save message to DB
        chatService.saveMessage(chatMessage.getSender(), chatMessage.getContent());

        // Broadcast to all sessions
        broadcast(chatMessage);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("Connection closed: " + session.getId());
    }

    private void broadcast(Message message) throws Exception {
        String jsonMessage = objectMapper.writeValueAsString(message);
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(jsonMessage));
            }
        }
    }
}
