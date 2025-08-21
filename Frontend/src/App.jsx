import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

window.global = window;

function App() {
  const backendHost = useMemo(() => window.location.hostname || "localhost", []);
  const restBase = useMemo(() => `http://${backendHost}:8080`, [backendHost]);
  const wsEndpoint = useMemo(() => `http://${backendHost}:8080/chat`, [backendHost]);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]); // {sender, content, timestamp?}
  const [nick, setNick] = useState("");
  const [text, setText] = useState("");
  const stompRef = useRef(null);
  const listRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  /** Fetch existing chat history */
  useEffect(() => {
    axios
      .get(`${restBase}/api/messages`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      })
      .catch(() => {
        // ignore if history API is unavailable
      });
  }, [restBase, scrollToBottom]);

  /** Connect WebSocket */
  useEffect(() => {
    const socket = new SockJS(wsEndpoint);
    const stompClient = Stomp.over(socket);
    stompClient.connect(
      {},
      () => {
        setConnected(true);
        stompClient.subscribe("/topic/messages", (msg) => {
          const body = JSON.parse(msg.body);
          setMessages((prev) => [...prev, body]);
          setTimeout(scrollToBottom, 50);
        });
      },
      () => {
        setConnected(false);
      }
    );

    stompRef.current = stompClient;

    return () => {
      if (stompRef.current) {
        stompRef.current.disconnect();
      }
    };
  }, [wsEndpoint, scrollToBottom]);

  /** Send message */
  const send = useCallback(() => {
    if (stompRef.current && text.trim()) {
      const msg = {
        sender: nick || "Anonymous",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      stompRef.current.send("/app/chat", {}, JSON.stringify(msg));
      setText("");
    }
  }, [nick, text]);

  /** Handle Enter key to send */
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-4 md:p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">DisasterNet – LAN Chat</h1>
          <div className="text-sm text-gray-500">
            Backend: <code>{restBase}</code> &middot; WS: <code>{wsEndpoint}</code> &middot;{" "}
            {connected ? (
              <span className="text-green-600 font-medium">Connected</span>
            ) : (
              <span className="text-red-600 font-medium">Disconnected</span>
            )}
          </div>
        </header>

        {/* Nickname */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Your nickname (optional)</label>
          <input
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="e.g. Medic-2"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="h-96 overflow-y-auto border rounded-xl p-3 bg-gray-50 mb-3"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="mb-2">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{m.sender || "Anonymous"}</span>
                  <span className="text-gray-400">:</span>
                  <span className="ml-2 break-words">{m.content}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Composer */}
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            placeholder="Type a message and press Enter…"
            className="flex-1 border rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring"
          />
          <button
            onClick={send}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            disabled={!connected}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
