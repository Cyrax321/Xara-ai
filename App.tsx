import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import type { Message, ChatState } from './types';

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const generateResponse = async (userMessage: string) => {
    try {
      const response = await fetch(HUGGINGFACE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: userMessage,
        }),
      });
      
      const data = await response.json();
      return data[0]?.generated_text || "I'm having trouble thinking right now. Could you try asking me something else?";
    } catch (error) {
      console.error('Error:', error);
      return "Oopsie! I'm having a little trouble connecting right now. Could you try again?";
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    const response = await generateResponse(content);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      role: 'assistant',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
      isLoading: false,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Xara AI
          </h1>
          <p className="text-gray-600 mt-2">Your kawaii AI companion! ✨</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="h-[60vh] overflow-y-auto space-y-4 mb-4 p-2">
            {chatState.messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <Sparkles className="w-8 h-8 mx-auto mb-2" />
                <p>Send me a message to start chatting!</p>
              </div>
            )}
            {chatState.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {chatState.isLoading && (
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </motion.div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={chatState.isLoading}
          />
        </div>
        
        <p className="text-center text-sm text-gray-400">
          Powered by HuggingFace 🤗
        </p>
      </div>
    </div>
  );
}

export default App;