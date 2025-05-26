
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageSender, GuruChat } from './types';
import { GURU_INITIAL_MESSAGE } from './constants';
import { createGuruChatSession, sendMessageToGuru } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { AcademicCapIcon } from '@heroicons/react/24/solid'; // Added for consistency with ChatMessage

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true for session init
  const [chatSession, setChatSession] = useState<GuruChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await createGuruChatSession();
      setChatSession(session);
      setMessages([
        {
          id: crypto.randomUUID(),
          text: GURU_INITIAL_MESSAGE,
          sender: MessageSender.GURU,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Initialization error:", err);
      const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred during initialization.";
      setError(errorMessage);
      setMessages([{
        id: crypto.randomUUID(),
        text: `Error initializing Guru: ${errorMessage}. Please ensure your API_KEY is correctly configured and try refreshing.`,
        sender: MessageSender.SYSTEM,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!chatSession || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: MessageSender.USER,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const guruResponseText = await sendMessageToGuru(chatSession, text);
      const guruMessage: Message = {
        id: crypto.randomUUID(),
        text: guruResponseText,
        sender: MessageSender.GURU,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, guruMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessageText = (err instanceof Error) ? err.message : "An unknown error occurred.";
      setError(`Guru is having trouble responding: ${errorMessageText}`);
      const systemErrorMessage: Message = {
        id: crypto.randomUUID(),
        text: `Sorry, I encountered an issue: ${errorMessageText}. Please try again.`,
        sender: MessageSender.SYSTEM,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, systemErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-[#2C2530]">
      <Header />
      {isLoading && messages.length === 0 && ( // Initial loading spinner for session creation
        <div className="flex-grow flex flex-col items-center justify-center text-gray-300">
          <LoadingSpinner size="w-12 h-12" color="text-[#E0409A]" />
          <p className="mt-4 text-lg">Initializing Guru...</p>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      )}
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4 pb-20">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
         {isLoading && messages.length > 0 && ( // Loading indicator for Guru's response
          <div className="flex justify-start items-end mb-4">
            <div className="mr-2 flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-[#E0409A]" />
            </div>
            <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 shadow-md bg-[#3B3242] text-gray-200 self-start rounded-r-xl rounded-tl-xl">
              <LoadingSpinner size="w-5 h-5" color="text-[#E0409A]" />
            </div>
          </div>
        )}
      </div>
      {/* Error display for API key or general critical errors */}
      {error && !isLoading && messages.length <=1 && ( // Only show this if initial load failed and no messages are shown
        <div className="p-4 m-4 bg-red-800 border border-red-600 text-red-200 rounded-md text-center">
          <p className="font-semibold">Critical Error:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">Please check your API key setup and network connection, then refresh the page.</p>
        </div>
      )}
      <div className="sticky bottom-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;