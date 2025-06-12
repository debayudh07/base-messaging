"use client";
import { useState, useEffect, useRef } from "react";
import type { Conversation, Message } from "../types";

export const useConversation = (conversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load and stream messages when conversation changes
  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        setError(null);
        const messageList = await conversation.messages();
        setMessages(messageList);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();

    // Stream new messages
    const streamMessages = async () => {
      try {
        const stream = await conversation.streamMessages();
        for await (const message of stream) {
          setMessages((prevMessages) => {
            // Avoid duplicates
            if (prevMessages.find(m => m.id === message.id)) {
              return prevMessages;
            }
            return [...prevMessages, message];
          });
        }
      } catch (err) {
        console.error("Error streaming messages:", err);
      }
    };

    streamMessages();
  }, [conversation]);

  const sendMessage = async (messageContent: string): Promise<void> => {
    if (!conversation || !messageContent.trim()) return;

    try {
      setError(null);
      await conversation.send(messageContent);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
      throw err;
    }
  };

  return {
    messages,
    isLoadingMessages,
    error,
    messagesEndRef,
    sendMessage,
    setError,
  };
};
