import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

window.global = window; // Fix for sockjs in some environments

function App() {
  // const backendHost = useMemo(() => window.location.hostname || "localhost", []);
  const backendHost = "192.168.1.7";
  const restBase = useMemo(() => `http://${backendHost}:8080`, [backendHost]);
  const wsEndpoint = useMemo(() => `http://${backendHost}:8080/chat`, [backendHost]);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [nick, setNick] = useState("");
  const [text, setText] = useState("");
  const stompRef = useRef(null);
  const listRef = useRef(null);

  // Scrolls chat pane to bottom
  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  // Fetch chat history on load
  useEffect(() => {
    axios.get(`${restBase}/api/messages`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setMessages(res.data);
          setTimeout(scrollToBottom, 100);
        }
      })
      .catch(() => { /* ignore failures */ });
  }, [restBase, scrollToBottom]);

  // Setup and activate STOMP client over SockJS
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(wsEndpoint),

      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/messages", msg => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
          setTimeout(scrollToBottom, 50);
        });
      },

      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
      },

      onDisconnect: () => {
        setConnected(false);
      },
    });

    client.activate();
    stompRef.current = client;

    return () => client.deactivate();
  }, [wsEndpoint, scrollToBottom]);

  // Send message handler
  const send = useCallback(() => {
    if (stompRef.current && text.trim()) {
      const msg = {
        sender: nick.trim() || "Anonymous",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      stompRef.current.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(msg),
      });
      setText("");
    }
  }, [nick, text]);

  // Handle Enter key for sending message (Shift + Enter for newline)
  const handleKeyDown = useCallback(e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }, [send]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-xl flex flex-col">
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-100 tracking-wide font-mono select-none">
            LinkerNet LAN Chat
          </h1>
          <span className={`text-sm font-semibold ${
            connected ? 'text-green-400' : 'text-red-500'
          }`}>
            {connected ? "Connected" : "Disconnected"}
          </span>
        </header>

        {/* Messages */}
        <main 
          ref={listRef} 
          className="flex-grow overflow-y-auto bg-gray-900 px-6 py-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
          {messages.length === 0 ? (
            <p className="text-gray-500 italic text-center mt-12 select-none">
              No messages yet. Start the conversation.
            </p>
          ) : (
            messages.map((msg, index) => {
              const isSelf = msg.sender?.toLowerCase() === (nick || "").toLowerCase();
              return (
                <div 
                  key={index}
                  className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                >
                  <span className={`text-xs font-mono select-text ${
                    isSelf ? "text-green-400" : "text-blue-400"
                  }`}>
                    {msg.sender || "Anonymous"} <span className="text-gray-600">at</span> {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  <div 
                    className={`mt-1 rounded-lg px-4 py-2 max-w-xs break-words whitespace-pre-wrap leading-relaxed select-text ${
                      isSelf 
                        ? "bg-green-700 text-green-100" 
                        : "bg-blue-700 text-blue-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </main>

        {/* Input area */}
        <footer className="bg-gray-800 border-t border-gray-700 p-6 flex flex-col sm:flex-row gap-4 items-center">
          <input 
            type="text"
            placeholder="Your Nickname (optional)" 
            value={nick}
            onChange={e => setNick(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
          />
          <textarea
            rows={2}
            placeholder="Type a message and press Enter..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow resize-none rounded-lg p-3 bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            onClick={send}
            disabled={!connected}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-300
              ${connected ? "bg-green-500 hover:bg-green-600 text-gray-900" : "bg-gray-600 cursor-not-allowed text-gray-400"}
            `}
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
