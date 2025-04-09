
export type LLM = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  lightColor: string;
  selected: boolean;
};

export type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  respondingTo?: string;
  isConsensus?: boolean;
};

export type ConversationState = {
  messages: Message[];
  activeModels: LLM[];
  prompt: string;
  isTyping: Record<string, boolean>;
};
