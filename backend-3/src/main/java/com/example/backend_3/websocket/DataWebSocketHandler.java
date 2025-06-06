package com.example.backend_3.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;

public class DataWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(DataWebSocketHandler.class);
    private static final List<WebSocketSession> sessions = new ArrayList<>();

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
      sessions.add(session);
      logger.info("✅ WebSocket connection established: {}", session.getId());
    }

    @Override
    public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) {
      // You can log or handle incoming message here
      logger.info("📩 Received message from {}: {}", session.getId(), message.getPayload());
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
      sessions.remove(session);
      logger.info("❌ WebSocket connection closed: {}", session.getId());
    }

    public static void broadcast(Object data) {
      try {
        String json = new ObjectMapper().writeValueAsString(data);
        for (WebSocketSession session : sessions) {
          if (session.isOpen()) {
            session.sendMessage(new TextMessage(json));
          }
        }
      } catch (IOException e) {
        logger.error("❌ Failed to broadcast WebSocket message", e);
      }
    }
}
