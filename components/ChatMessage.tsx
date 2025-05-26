
import React from 'react';
import { Message, MessageSender } from '../types';
import { UserCircleIcon, AcademicCapIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;
  const isGuru = message.sender === MessageSender.GURU;
  const isSystem = message.sender === MessageSender.SYSTEM;

  const bubbleClasses = isUser
    ? 'bg-[#E0409A] text-white self-end rounded-l-xl rounded-tr-xl'
    : isGuru
    ? 'bg-[#3B3242] text-gray-200 self-start rounded-r-xl rounded-tl-xl'
    : 'bg-red-700 text-red-100 self-center rounded-xl border border-red-500';
  
  const avatar = isUser ? (
    <UserCircleIcon className="h-8 w-8 text-[#E0409A]" />
  ) : isGuru ? (
    <AcademicCapIcon className="h-8 w-8 text-[#E0409A]" />
  ) : (
    <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
  );

  const containerClasses = `flex mb-4 items-end ${isUser ? 'justify-end' : 'justify-start'}`;
  if (isSystem) { // Center system messages
    containerClasses.replace('justify-start', 'justify-center').replace('justify-end', 'justify-center');
  }


  // Basic markdown-like formatting for bold text and newlines
  const formatText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\n)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
      }
      if (part === '\n') {
        return <br key={index} />;
      }
      return part;
    });
  };


  return (
    <div className={containerClasses}>
      {!isUser && !isSystem && <div className="mr-2 flex-shrink-0">{avatar}</div>}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 shadow-md ${bubbleClasses} ${isSystem ? 'text-center' : ''}`}>
        <p className="text-sm whitespace-pre-wrap">{formatText(message.text)}</p>
        {/* <span className="text-xs opacity-75 mt-1 block text-gray-500">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span> */}
      </div>
      {(isUser || isSystem) && <div className="ml-2 flex-shrink-0">{avatar}</div>}
    </div>
  );
};

export default ChatMessage;