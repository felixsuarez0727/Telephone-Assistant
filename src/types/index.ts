// Types for messages
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationState {
  messages: Message[];
  callSid?: string;
  callerPhone?: string;
  reservationInfo?: ReservationInfo;
  intent?: ConversationIntent;
}

export interface ReservationInfo {
  name?: string;
  date?: string;
  time?: string;
  people?: number;
  confirmed: boolean;
}

export enum ConversationIntent {
  UNKNOWN = 'unknown',
  GREETING = 'greeting',
  MENU_INFO = 'menu_info',
  HOURS_INFO = 'hours_info',
  RESERVATION = 'reservation',
  CONFIRMATION = 'confirmation',
  FAREWELL = 'farewell'
}

// Types for the Twilio API
export interface TwilioRequest {
  CallSid: string;
  From: string;
  SpeechResult?: string;
  [key: string]: any;
}

// Types for the Reservation API
export interface ReservationRequest {
  name: string;
  date: string;
  time: string;
  people: number;
  phone: string;
  notes?: string;
}