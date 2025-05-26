
import { Chat } from "@google/genai";

export enum MessageSender {
  USER = 'user',
  GURU = 'guru',
  SYSTEM = 'system', // For error messages or system notifications
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
}

export interface GuruChat extends Chat {}
    