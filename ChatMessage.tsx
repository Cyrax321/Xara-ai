import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-pink-100' : 'bg-purple-100'
      }`}>
        {isBot ? (
          <Bot className="w-5 h-5 text-pink-500" />
        ) : (
          <User className="w-5 h-5 text-purple-500" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isBot
            ? 'bg-pink-50 text-gray-800'
            : 'bg-purple-50 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </motion.div>
  );
}