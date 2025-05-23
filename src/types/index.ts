
export type LLM = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  lightColor: string;
  selected: boolean;
  devilsAdvocate?: boolean; // Advocatus Diaboli Modus
};

export type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  respondingTo?: string;
  isConsensus?: boolean;
  consensusFrom?: string;
  isExplainLikeIm10?: boolean; // Erklärung für 10-Jährige
  isDevilsAdvocate?: boolean; // Advocatus Diaboli Antwort
};

export type ConversationState = {
  messages: Message[];
  activeModels: LLM[];
  prompt: string;
  isTyping: Record<string, boolean>;
};

export type ApiKeys = {
  openai?: string;  // für ChatGPT
  anthropic?: string; // für Claude
  google?: string;   // für Gemini
  deepseek?: string;  // für DeepSeek
};
