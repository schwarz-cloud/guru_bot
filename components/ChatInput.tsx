
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#251E28] border-t border-[#4A3F55] shadow- اوپر">
      <div className="flex items-end bg-[#3B3242] rounded-xl p-2 border border-[#4A3F55] focus-within:ring-2 focus-within:ring-[#E0409A]">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Guru something or type your thoughts..."
          className="flex-grow p-2 bg-transparent border-none focus:ring-0 resize-none max-h-40 overflow-y-auto text-sm text-gray-200 placeholder-gray-500"
          rows={1}
          disabled={isLoading}
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="ml-2 p-2.5 rounded-full text-white bg-[#E0409A] hover:bg-[#C73888] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#E0409A] focus:ring-offset-2 focus:ring-offset-[#251E28]"
          aria-label="Send message"
        >
          {isLoading ? <LoadingSpinner size="w-5 h-5" color="text-white" /> : <PaperAirplaneIcon className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;